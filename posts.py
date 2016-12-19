import sqlite3

# used for time stamps 
import time
import datetime
import pytz
from pytz import timezone

import hashlib

import string
import random
import os
import sys
from users import Users
import time


import psycopg2
import urllib

class Posts:

	def __init__(self):
		self.ADMIN_TABLE = "admin_table"
		self.REPORT_TABLE = "report_table"
		self.COMMENT_ID_TABLE = "c_id"
		self.FEED_NAMES = "feed_names"
		self.EVENT_TABLE = "BALT"
		self.COMMENT_TABLE = "c_" + self.EVENT_TABLE
		self.NOTIFICATION_TABLE = "notification_table"
		self.NOTIFICAITON_ID_TABLE = "n_id"
		self.USER_NOTIFICATION_PREFIX = "n_"
		self.SEEN_POSTS_TABLE = "seen_posts_table"

		# for when we upload to heroku
		# comment out if testing
		urllib.parse.uses_netloc.append("postgres")
		os.environ["DATABASE_URL"] = "postgres://spkgochzoicojm:y0MABz523D1H-zMqeZVvplCuC2@ec2-54-163-252-55.compute-1.amazonaws.com:5432/d15b0teu2kkhek"
		url = urllib.parse.urlparse(os.environ["DATABASE_URL"])


		self.post_db = psycopg2.connect(
		    database=url.path[1:],
		    user=url.username,
		    password=url.password,
		    host=url.hostname,
		    port=url.port,
		)
		self.post_db.autocommit = True

		self.db = self.post_db.cursor()

	def closeConnection(self):
		self.db.close()
		self.post_db.close()


	def getTimeString(self):
		return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

	# generates a random id
	def id_generator(self, size=6, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))


	def createSeenPostsTable(self):
		sql = "CREATE TABLE IF NOT EXISTS " + self.SEEN_POSTS_TABLE + " (userID TEXT PRIMARY KEY)"
		self.db.execute(sql)



		
		addIndexCode = 'CREATE INDEX IF NOT EXISTS userID ON ' + self.SEEN_POSTS_TABLE + ' (userID)'
		self.db.execute(addIndexCode)


	# adds a post to the last seen posts table
	def addPostToSeenTable(self, comment_id):
		sql =  "ALTER TABLE " + self.SEEN_POSTS_TABLE + " ADD %s BOOLEAN"
		self.db.execute(self.db.mogrify(sql, (comment_id,)))

		thisPost = self.getPostById(comment_id)

		sql = "UPDATE " + self.SEEN_POSTS_TABLE + " SET %s = %s"
		self.db.execute(self.mogrify(sql, (comment_id, False)))

		sql = "UPDATE " + self.SEEN_POSTS_TABLE + "SET %s = %s WHERE userID = %s"
		self.db.execute(self.mogrify(sql, (comment_id, True, thisPost['post_id'])))
		self.post_db.commit()


	def updatePostAsSeen(self, userID, comment_id):
		sql = "UPDATE " + self.SEEN_POSTS_TABLE + "SET %s = %s WHERE userID = %s"
		self.db.execute(self.mogrify(sql, (comment_id, True, userID)))
		self.post_db.commit()


	def addUserToLastSeenTable(self, userID):
		sql = "INSERT INTO " + self.SEEN_POSTS_TABLE + " (userID) VALUES (%s) ON CONFLICT (userID) DO UPDATE SET userID = %s"
		self.db.execute(self.db.mogrify(sql, (userID, userID)))
		self.post_db.commit()

	

	# deletes a table
	def deleteTable(self, table_name):	
		deleteTableCode = "DROP TABLE IF EXISTS " + table_name
		self.db.execute(deleteTableCode)
		self.post_db.commit()

	# resets db
	def resetDatabase(self):
		
		self.deleteTable(self.ADMIN_TABLE)
		self.deleteTable(self.REPORT_TABLE)


		self.deleteTable(self.COMMENT_ID_TABLE)
		self.deleteTable(self.FEED_NAMES)

		user_manager = Users()
		user_list = user_manager.getUserList()
		user_manager.closeConnection()
		for userID in user_list:
			notification_table_name = self.USER_NOTIFICATION_PREFIX + userID
			self.deleteTable(notification_table_name)

		self.initializePosts()

	def initializePosts(self):
		self.createAdminTable()
		self.createReportTable()
		self.createFeedNameTable()
		self.createCommentIdTable()
		self.createNotificationTable()
		
	def ghostFollow(self, feed_name, userID, unique_id):
		thisItem = self.getPostById(unique_id)
		timeStamp = time.time()
		timeString = self.getTimeString()
		if thisItem != None:
			sql = "INSERT INTO " + feed_name + " (body, poster_id, feed_name, comment_id, unique_id, timeString, timeStamp, following, ghost_following) VALUES (%s, %s, %s,%s,%s,%s,%s,%s,%s)"
			
		else:
			thisItem = self.getCommentById(unique_id)

		body = "GHOST FOLLOWING"
		poster_id = userID
		following = True
		ghost_following = True 
		self.db.execute(self.db.mogrify(sql, (body, poster_id, feed_name, thisItem['comment_id'], thisItem['unique_id'], timeString, timeStamp, following, ghost_following)))
		self.post_db.commit()

	def createNotificationTable(self):
		createNotificationTableCode = 'CREATE TABLE IF NOT EXISTS ' + self.NOTIFICATION_TABLE + ' (feed_name TEXT, comment_id TEXT, receiver_id TEXT, sender_id TEXT, action TEXT, seen BOOLEAN, notification_id TEXT, timeStamp FLOAT, timeString TEXT)'
		self.db.execute(createNotificationTableCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS comment_id ON ' + self.NOTIFICATION_TABLE + ' (comment_id)'
		self.db.execute(addIndexCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS receiver_id ON ' + self.NOTIFICATION_TABLE + ' (receiver_id)'
		self.db.execute(addIndexCode)

		createNotificationIdTableCode = "CREATE TABLE IF NOT EXISTS " + self.NOTIFICAITON_ID_TABLE + " (notification_id TEXT)"
		self.db.execute(createNotificationIdTableCode)
		addIndexCode = "CREATE INDEX IF NOT EXISTS notification_id ON " + self.NOTIFICAITON_ID_TABLE + "(notification_id)"
		self.db.execute(addIndexCode)

	# adds a notification
	# defaults to unseens
	# stop from doing something if receiver_id = sender_id
	def createNotification(self, feed_name, comment_id, receiver_id, sender_id, action):
		if receiver_id != sender_id:	
			self.createNotificationTable()
			seen = False
			timeStamp = time.time()
			timeString = self.getTimeString()

			# if the user already has an unseen notification from this thread, simply update that one
			# if there is a previous notificaiton from the same thread, but has been seen, then create a new one
			user_short_list = self.getShortListNotifications(receiver_id)
			dupNotification = False
			for note in user_short_list:
				if comment_id == note['comment_id'] and seen == False:
					dupNotification = True

			# if duped, update the previous copy in notification table and the short list
			if dupNotification == True:
				sql = "UPDATE " + self.NOTIFICATION_TABLE + " SET sender_id = %s, action = %s, timeString = %s, timeStamp = %s \
				WHERE comment_id = %s"
				self.db.execute(self.db.mogrify(sql, (sender_id, action, timeString, timeStamp, comment_id)))
				self.post_db.commit()


				self.createShortList(receiver_id)
				sql = "UPDATE " + self.USER_NOTIFICATION_PREFIX + receiver_id + " SET sender_id = %s, action = %s, timeString = %s, timeStamp = %s \
				WHERE comment_id = %s"
				self.db.execute(self.db.mogrify(sql, (sender_id, action, timeString, timeStamp, comment_id)))
				self.post_db.commit()



			# if not duped, add it
			elif dupNotification == False:
				
				notification_id = self.hash_notification_id(timeString)
				self.addNotificationId(notification_id)
				addNotificationCode = "INSERT INTO " + self.NOTIFICATION_TABLE + " (feed_name, comment_id, receiver_id, sender_id, action, seen, notification_id, timeStamp, timeString) VALUES (%s, %s,%s,%s,%s,%s, %s, %s, %s)"
				self.db.execute(self.db.mogrify(addNotificationCode, (feed_name, comment_id, receiver_id, sender_id, action, seen, notification_id, timeStamp, timeString)))
				self.post_db.commit()
				self.addToShortList(feed_name, comment_id, receiver_id, sender_id, action, notification_id, timeStamp, timeString)

	def createShortList(self, receiver_id):
		table_name = self.USER_NOTIFICATION_PREFIX + receiver_id
		sql = 'CREATE TABLE IF NOT EXISTS ' + table_name + ' (feed_name TEXT, comment_id TEXT, receiver_id TEXT, sender_id TEXT, action TEXT, seen BOOLEAN, notification_id TEXT, timeStamp FLOAT, timeString TEXT)'
		self.db.execute(sql)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS comment_id ON ' + self.NOTIFICATION_TABLE + ' (comment_id)'
		self.db.execute(addIndexCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS receiver_id ON ' + self.NOTIFICATION_TABLE + ' (receiver_id)'
		self.db.execute(addIndexCode)


	def addToShortList(self, feed_name, comment_id, receiver_id, sender_id, action, notification_id, timeStamp, timeString):
		# create the short_list table for this user

		self.createShortList(receiver_id)

		threshold = 100

		seen = False
		table_name = self.USER_NOTIFICATION_PREFIX + receiver_id
		sql = "INSERT INTO " + table_name + " (feed_name, comment_id, receiver_id, sender_id, action, seen, notification_id, timeStamp, timeString) VALUES (%s, %s, %s,%s,%s,%s, %s, %s, %s)"
		self.db.execute(self.db.mogrify(sql, (feed_name, comment_id, receiver_id, sender_id, action, seen, notification_id, timeStamp, timeString)))
		self.post_db.commit()

		# then if we are at more than the threshold, remove the oldest one
		sql = "SELECT * FROM " + table_name
		self.db.execute(sql)
		query = self.db.fetchall()
		notification_list = self.notificationListToDict(query)
		if len(notification_list) > threshold:
			self.sortAscending(notification_list)
			self.removeFromShortList(feed_name, receiver_id, notification_list[0]['notification_id'])
			

	def removeFromShortList(self, receiver_id, notification_id):
		self.createShortList(receiver_id)
		table_name = self.USER_NOTIFICATION_PREFIX + receiver_id
		sql = "DELETE FROM " + table_name + " WHERE notification_id = %s"
		self.db.execute(self.db.mogrify(sql, (notification_id,)))
		self.post_db.commit()


	def getShortListNotifications(self,userID):
		self.createShortList(userID)
		table_name = self.USER_NOTIFICATION_PREFIX + userID
		sql = "SELECT * FROM " + table_name + " WHERE receiver_id = %s"
		self.db.execute(self.db.mogrify(sql, (userID,)))
		query = self.db.fetchall()
		notification_list = self.notificationListToDict(query)
		return notification_list


	def getNotifications(self, userID):
		sql = "SELECT * FROM " + self.NOTIFICATION_TABLE + " WHERE receiver_id = %s"
		self.db.execute(self.db.mogrify(sql, (userID,)))
		query = self.db.fetchall()
		notification_list = self.notificationListToDict(query)
		return notification_list

	def notificationListToDict(self, query):
		n_list = list()
		for note in query:
			this_note = {}
			this_note['feed_name'] = note[0]
			this_note['comment_id'] = note[1]
			this_note['receiver_id'] = note[2]
			this_note['sender_id'] = note[3]
			this_note['action'] = note[4]
			this_note['seen'] = note[5]
			this_note['notification_id'] = note[6]
			this_note['timeStamp'] = note[7]
			this_note['timeString'] = note[8]
			n_list.append(this_note)
		return n_list


	def markNotificationAsSeen(self, notification_id):
		sql = "UPDATE " + self.NOTIFICATION_TABLE + " SET seen = True WHERE notification_id = %s"
		self.db.execute(self.db.mogrify(sql, (notification_id,)))
		self.post_db.commit()


	def createAdminTable(self):
		createAdminTableCode = 'CREATE TABLE IF NOT EXISTS ' + self.ADMIN_TABLE  + '(feed_name TEXT, body TEXT, poster_id TEXT, action TEXT, unique_id TEXT, timeString TEXT, timeStamp FLOAT, isComment BOOLEAN)'
		self.db.execute(createAdminTableCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS unique_id ON ' + self.ADMIN_TABLE + ' (unique_id)'
		self.db.execute(addIndexCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS poster_id ON ' + self.ADMIN_TABLE + ' (poster_id)'
		self.db.execute(addIndexCode)
		self.post_db.commit()

	def updateAdminTable(self, feed_name, body, poster_id, action, unique_id, timeString, timeStamp, isComment):
		updateAdminTableCode = "INSERT INTO " + self.ADMIN_TABLE  + "(feed_name, body, poster_id, action, unique_id, timeString, timeStamp, isComment) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
		self.db.execute(self.db.mogrify(updateAdminTableCode, (feed_name, body, poster_id, action, unique_id, timeString, timeStamp, isComment)))
		self.post_db.commit() 


	def createThread(self, feed_name):
		if not self.isFeed(feed_name):
			self.addFeedName(feed_name)
			createTableCode = 'CREATE TABLE IF NOT EXISTS ' + feed_name + ' (body TEXT, poster_id TEXT, feed_name TEXT, comment_id TEXT, timeString TEXT, timeStamp FLOAT, isTrade BOOLEAN, isPlay BOOLEAN, isChill BOOLEAN, unique_id TEXT, numComments INT, following BOOLEAN, ghost_following BOOLEAN)'
			self.db.execute(createTableCode)
			addIndexCode = 'CREATE INDEX IF NOT EXISTS poster_id ON ' + feed_name + ' (poster_id)'
			self.db.execute(addIndexCode)
			addIndexCode = 'CREATE INDEX IF NOT EXISTS comment_id ON ' + feed_name + ' (comment_id)'
			self.db.execute(addIndexCode)
			addIndexCode = 'CREATE INDEX IF NOT EXISTS unique_id ON ' + feed_name + ' (unique_id)'
			self.db.execute(addIndexCode)
			addIndexCode = 'CREATE INDEX IF NOT EXISTS timeStamp ON ' + feed_name + ' (timeStamp)'
			self.db.execute(addIndexCode)

			comments_id = "c_" + feed_name
			createTableCode = 'CREATE TABLE IF NOT EXISTS ' + comments_id + ' (body TEXT, poster_id TEXT, feed_name TEXT, comment_id TEXT, timeString TEXT, timeStamp FLOAT, unique_id TEXT, following BOOLEAN, ghost_following BOOLEAN)'
			self.db.execute(createTableCode)
			addIndexCode = 'CREATE INDEX IF NOT EXISTS poster_id ON ' + comments_id + ' (poster_id)'
			self.db.execute(addIndexCode)
			addIndexCode = 'CREATE INDEX IF NOT EXISTS comment_id ON ' + comments_id + ' (comment_id)'
			self.db.execute(addIndexCode)
			addIndexCode = 'CREATE INDEX IF NOT EXISTS timeStamp ON ' + comments_id + ' (timeStamp)'
			self.db.execute(addIndexCode)
			addIndexCode = 'CREATE INDEX IF NOT EXISTS unique_id ON ' + comments_id + ' (unique_id)'
			self.db.execute(addIndexCode)


	def createFeedNameTable(self):
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + self.FEED_NAMES + ' (feed_name TEXT)'
		self.db.execute(createTableCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS feed_name ON ' + self.FEED_NAMES + ' (feed_name)'
		self.db.execute(addIndexCode)

	def getFeedNames(self):
		sql = "SELECT feed_name FROM " + self.FEED_NAMES 
		self.db.execute(self.db.mogrify(sql))
		query = self.db.fetchall()
		feed_list = list()
		for f in query:
			feed_list.append(f[0])
		return feed_list

	def isFeed(self, feed_name):
		feed_list = self.getFeedNames()
		if feed_name in feed_list:
			return True
		else:
			return False


	def createReportTable(self):
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + self.REPORT_TABLE + ' (feed_name TEXT, id TEXT, body TEXT, reason TEXT ,isComment BOOLEAN, description TEXT, timeString TEXT, timeStamp FLOAT, reporting_user TEXT, reported_user TEXT)'
		self.db.execute(createTableCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS id ON ' + self.REPORT_TABLE + ' (id)'
		self.db.execute(addIndexCode)

	def reportPost(self, feed_name, comment_id, reason, description, reporting_user, reported_user):
		body = self.getPostById(feed_name, comment_id)['body']
		timeStamp = time.time()
		timeString = self.getTimeString()

		self.db.execute(self.db.mogrify("INSERT INTO " + self.REPORT_TABLE + "(feed_name, id, body, reason, isComment, description, timeStamp, timeString, reporting_user, reported_user) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", (feed_name, comment_id, body, reason, False, description, timeStamp, timeString, reporting_user, reported_user)))
		self.post_db.commit()

		action = "REPORTED POST"
		isComment = False
		self.updateAdminTable(feed_name, body, reported_user, action, comment_id, timeString, timeStamp, isComment)


	def reportComment(self, feed_name, unique_id, reason, description, reporting_user, reported_user):
		body = self.getCommentById(feed_name, unique_id)['body']
		timeStamp = time.time()
		timeString = self.timeString()
		self.db.execute(self.db.mogrify("INSERT INTO " + self.REPORT_TABLE + "(feed_name, id, body, reason, isComment, description, timeStamp, timeString, reporting_user, reported_user) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", (feed_name, unique_id, body, reason, True, description, timeStamp, timeString, reporting_user, reported_user)))
		self.post_db.commit()	
		action = "REPORTED COMMENT"
		isComment = True
		self.updateAdminTable(feed_name, body, reported_user, action, unique_id, timeString, timeStamp, isComment)

	def hash_feed_name(self, s):	
		# hash_code = 7;
		# for i  in range(0,len(s)):
		# 	hash_code = (hash_code * 31 + ord(s[i])) % 1000000000
		# feed_id = str(hash_code)
		feed_id = str(hash(s) % 1000000000)
		while(self.cIdTaken(feed_id)):
			feed_id = str(int(feed_id) + 1)	
		return comment_id

	def getPostById(self, feed_name, comment_id):
		self.db.execute(self.db.mogrify("SELECT * FROM " + feed_name + " WHERE comment_id = %s", (comment_id,)))
		this_post = self.db.fetchall()
		output = self.postListToDict(this_post)
		if len(output) == 0:
			return None
		else:
			return output[0]

	def getCommentById(self, feed_name, unique_id):
		table_name = "c_" + feed_name
		self.db.execute(self.db.mogrify("SELECT * FROM " + table_name + " WHERE unique_id = %s", (unique_id,)))
		this_comment = self.db.fetchall()
		output = self.commentListToDict(this_comment)

		sys.stdout.flush()
		if len (output) == 0:
			return None
		return output[0]	


	def addFeedName(self, feed_name):
		self.db.execute(self.db.mogrify("INSERT INTO " + self.FEED_NAMES + " (feed_name) VALUES (%s) ", (feed_name,)))
		self.post_db.commit()

	def addNotificationId(self, notification_id):
		self.db.execute(self.db.mogrify("INSERT INTO " + self.NOTIFICAITON_ID_TABLE + "(notification_id) VALUES (%s) ", (notification_id,)))
		self.post_db.commit()

	def createCommentIdTable(self):
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + self.COMMENT_ID_TABLE + ' (comment_id TEXT)'
		self.db.execute(createTableCode)


	def hash_comment_id(self, s):
		comment_id = str(hash(s) % 1000000000)
		while(self.cIdTaken(comment_id)):
			comment_id = str(int(comment_id) + 1)
		
		return comment_id

	def feedNameTaken(self, feed_name):
		fetchMatchingIdCode = "SELECT * FROM " + self.FEED_NAMES + " WHERE feed_name = %s"
		self.db.execute(self.db.mogrify(fetchMatchingIdCode, (feed_name,)))
		matchList = self.db.fetchall()
		if len(matchList) > 0:
			return True
		else:
			return False

	def cIdTaken(self, comment_id):
		fetchMatchingIdCode = "SELECT * FROM " + self.COMMENT_ID_TABLE + " WHERE comment_id = %s"

		self.db.execute(self.db.mogrify(fetchMatchingIdCode, (comment_id,)))
		matchList = self.db.fetchall()

		if len(matchList) > 0:
			return True
		else:
			return False

	def nIdTaken(self, notification_id):
		fetchMatchingIdCode = "SELECT * FROM " + self.NOTIFICAITON_ID_TABLE + " WHERE notification_id = %s"
		self.db.execute(self.db.mogrify(fetchMatchingIdCode, (notification_id,)))
		matchList = self.db.fetchall()
		if len(matchList) > 0:
			return True
		else:
			return False	


	def hash_notification_id(self, s):	
		notification_id = str(hash(s) % 1000000000)
		while(self.nIdTaken(notification_id)):
			notification_id = str(int(notification_id) + 1)	
		return notification_id

	def addCommentIdToList(self, comment_id):
		self.db.execute("INSERT INTO " + self.COMMENT_ID_TABLE + " (comment_id) VALUES (%s)", (comment_id,))
		self.post_db.commit()

	# posts on a thread
	def postInThread(self, feed_name, body, poster_id, isTrade = None, isPlay = None, isChill = None, comment_id = None):
		timeStamp = time.time()
		timeString = self.getTimeString()


		if isTrade == None:
			isTrade = False
		if isPlay == None:
			isPlay = False
		if isChill == None:
			isChill = False

		if comment_id == None:
			comment_id = hash_comment_id(str(timeStamp))

		self.addCommentIdToList(comment_id)
		unique_id = comment_id
		# start with zero comments
		numComments = 0 

		# following by default
		following = True

		# not just_following (ghost follower)
		ghost_following = False

		post_code = self.db.mogrify("INSERT INTO " + feed_name + " (body, poster_id, feed_name, comment_id, timeString, timeStamp, isTrade, isPlay, isChill, unique_id, numComments, following, ghost_following) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s, %s)", (body, poster_id, feed_name, comment_id, timeString, timeStamp, isTrade, isPlay, isChill, unique_id, numComments, following, ghost_following))
		self.db.execute(post_code)
		self.post_db.commit()

		action = "MAKE POST"
		isComment = False
		self.updateAdminTable(feed_name, body, poster_id, action, unique_id, timeString, timeStamp, isComment)

	def makeComment(self, feed_name, comment_id, body, poster_id, unique_id = None):
		timeStamp = time.time()
		timeString = self.getTimeString()
		comment_id = comment_id

		if unique_id == None:
			unique_id = self.hash_comment_id(comment_id)
		
		self.addCommentIdToList(unique_id)

		# update number of comments
		this_post = self.getPostById(feed_name,comment_id)
		updatedNumComments = this_post['numComments'] + 1
		update_code = "UPDATE " + feed_name  + " SET " + "numComments" + " = %s WHERE unique_id = '" + comment_id + "'"
		self.db.execute(self.db.mogrify(update_code, (updatedNumComments,)))
		self.post_db.commit()

		# following by default
		following = True

		# not just_following (ghost follower)
		ghost_following = False

		self.db.execute(self.db.mogrify('INSERT INTO c_' + feed_name + ' (body, poster_id, feed_name, comment_id, timeString, timeStamp, unique_id, following, ghost_following) VALUES (%s,%s,%s,%s,%s,%s,%s, %s, %s)', (body, poster_id, feed_name, comment_id, timeString, timeStamp, unique_id, following, ghost_following)))
		self.post_db.commit()
		action = "MAKE COMMENT"
		isComment = True
		self.updateAdminTable(feed_name, body, poster_id, action, unique_id, timeString, timeStamp, isComment)


		# add notificaiton
		# adjust this later
		participating_users = self.getParticipatingUsers(feed_name, comment_id)
		user_manager = Users()
		for userID in participating_users:
			action = user_manager.getInfo(poster_id)['first_name'] + " commented on " + this_post['body']
			self.createNotification(feed_name, comment_id, userID, poster_id, action)

		user_manager.closeConnection()


	# # deletes a post by ID
	# def deletePost(thead_id, post_id):

	# sorts a list of messages
	# the first message will be the earliest message in time
	def selectionSort(self, alist):
		for fillslot in range(len(alist)-1,0,-1):
			positionOfMax = 0
			for location in range(1,fillslot+1):
				if alist[location]['timeStamp'] > alist[positionOfMax]['timeStamp']:
					positionOfMax = location

		temp = alist[fillslot]
		alist[fillslot] = alist[positionOfMax]
		alist[positionOfMax] = temp
		return alist


	def getPosts(self, feed_name, tradeFilter = None, playFilter = None, chillFilter = None):
		
		feed_table_name =  feed_name
		sql_code = "SELECT * FROM " + feed_table_name + " WHERE ghost_following = %s AND feed_name = %s"

		ghost_following = False
		self.db.execute(self.db.mogrify(sql_code, (ghost_following,feed_name)))	

		posts = self.db.fetchall()
		postDict = self.postListToDict(posts)
		return postDict


		

	def getComments(self, feed_name, comment_id = None):
		feed_table_name =  "c_" + feed_name

		sql_code = "SELECT * FROM " + feed_table_name
		if comment_id != None:
			sql_code = sql_code + " WHERE comment_id = %s AND ghost_following = %s"
			self.db.execute(self.db.mogrify(sql_code, (comment_id, False)))

		else:
			sql_code = sql_code + " WHERE ghost_following = %s"
			ghost_following = False
			self.db.execute(self.db.mogrify(sql_code, (ghost_following,)))	
		# db.execute("SELECT * FROM " + thread_id)
		posts = self.db.fetchall()
		postDict = self.commentListToDict(posts)
		return postDict


	# add back later

	def getAll(self, feed_name, tradeFilter = None, playFilter = None, chillFilter = None):
		
		all_list = list()

		this_table_posts = self.getPosts(feed_name, tradeFilter = tradeFilter, playFilter = playFilter, chillFilter = chillFilter)
		for post in this_table_posts:
			all_list.append(post)

		this_table_posts = self.getComments(feed_name)
		for post in this_table_posts:
			all_list.append(post)

		return all_list



	def updateTime(self, feed_name, unique_id):
		table_name  = feed_name
		timeStamp = time.time()
		timeString = self.getTimeString()
		update_time_code = "UPDATE " + table_name  + " SET timeString = ?, timeStamp = ? WHERE unique_id = '" + unique_id + "'"
		self.db.execute(self.db.mogrify(update_time_code, (timeString, timeStamp)))
		self.post_db.commit()

	# edits post 
	# field_name should be a string
	def editPost(self, feed_name, unique_id, field_name, field_data):
		table_name  = feed_name
		timeStamp = time.time()
		timeString = self.timeString()
		update_code = "UPDATE " + table_name  + " SET " + field_name + " = %s WHERE unique_id = '" + unique_id + "'"
		self.db.execute(self.db.mogrify(update_code, (field_data,)))
		self.post_db.commit()

		thisPost = self.getPostById(feed_name, unique_id)
		action = "EDIT POST"
		isComment = False

		self.updateAdminTable(thisPost['feed_name'], thisPost['body'], thisPost['poster_id'], action, thisPost['unique_id'], timeString, timeStamp, isComment)


	# edits comments 
	# field_name should be a string
	def editComment(self, feed_name, unique_id, field_name, field_data):
		table_name  = "c_" + feed_name
		timeStamp = time.time()
		timeString = self.getTimeString()
		update_code = "UPDATE " + table_name  + " SET " + field_name + " = %s WHERE unique_id = '" + unique_id + "'"
		self.db.execute(self.db.mogrify(update_code, (field_data,)))
		self.post_db.commit()

		thisComment= self.getCommentById(feed_name, unique_id)
		action = "EDIT COMMENT"
		isComment = True
		self.updateAdminTable(thisComment['feed_name'], thisComment['body'], thisComment['poster_id'], action , thisComment['unique_id'], timeString, timeStamp, isComment)



	def deletePost(self, feed_name, unique_id):
		timeStamp = time.time()
		timeString = self.getTimeString()
		thisPost = self.getPostById(feed_name, unique_id)
		action = "DELETE POST"
		isComment = False
		self.updateAdminTable(thisPost['feed_name'], thisPost['body'], thisPost['poster_id'], action , thisPost['unique_id'], timeString, timeStamp, isComment)


		table_name = feed_name
		sql = "DELETE FROM " + table_name + " WHERE unique_id = %s"
		self.db.execute(self.db.mogrify(sql, (unique_id,)))

		table_name = "c_" + feed_name
		sql = "DELETE FROM " + table_name + " WHERE comment_id = %s"
		self.db.execute(self.db.mogrify(sql, (unique_id,)))
		self.post_db.commit()



	def deleteComment(self, feed_name, unique_id):
		timeStamp = time.time()
		timeString = self.getTimeString()
		thisComment = self.getCommentById(feed_name, unique_id)
		action = "DELETE COMMENT"
		isComment = True
		self.updateAdminTable(thisComment['feed_name'], thisComment['body'], thisComment['poster_id'], action , thisComment['unique_id'], timeString, timeStamp, isComment)

		# update number of comments
		this_post = self.getPostById(feed_name,thisComment['comment_id'])
		updatedNumComments = this_post['numComments'] - 1
		update_code = "UPDATE " + feed_name  + " SET " + "numComments" + " = %s WHERE unique_id = '" + thisComment['comment_id'] + "'"
		self.db.execute(self.db.mogrify(update_code, (updatedNumComments,)))
		self.post_db.commit()

		table_name = "c_" + feed_name
		sql = "DELETE FROM " + table_name + " WHERE unique_id = %s"
		self.db.execute(self.db.mogrify(sql, (unique_id,)))
		self.post_db.commit()

	# returns list of all users in a thread
	def getParticipatingUsers(self, feed_name, unique_id):
		# this checks if the unique id goes with a comment or ID
		thisItem = self.getPostById(feed_name, unique_id)
		if thisItem == None:
			thisItem = self.getCommentById(unique_id)
		comment_id = thisItem['comment_id']
		user_list = list()
		user_list.append(self.getPostById(feed_name, comment_id)['poster_id'])
		c_feed_name = "c_" + feed_name
		search_code = "SELECT poster_id FROM " + c_feed_name  + " WHERE comment_id = '" + comment_id + "'"
		self.db.execute(self.db.mogrify(search_code))
		user_query = self.db.fetchall()
		for user_id in user_query:
			if user_id[0] not in user_list:
				user_list.append(user_id[0])

		return user_list




	def postListToDict(self, posts):
		postList = list()
		user_manager = Users()
		for post in posts:

			thisPost = {}
			thisPost['body'] = post[0]
			thisPost['poster_id'] = post[1]
			thisPost['feed_name'] = post[2]
			thisPost['timeString'] = post[4]
			thisPost['timeStamp'] = post[5]
			thisPost['time'] = self.date_format(int(thisPost['timeStamp']))
			thisPost['isTrade'] = post[6]
			thisPost['isPlay'] = post[7]
			thisPost['isChill'] = post[8]
			thisPost['comment_id'] = post[3]
			thisPost['isComment'] = False
			thisUser = user_manager.getInfo(thisPost['poster_id'])
			thisPost['first_name'] = thisUser['first_name']
			thisPost['last_name'] = thisUser['last_name']
			thisPost['avatar_url'] = thisUser['avatar_url']
			thisPost['unique_id'] = post[9]
			thisPost['numComments'] = post[10]
			postList.append(thisPost)
		user_manager.closeConnection()	
		return postList	

	def commentListToDict(self, comments):
		commentList = list()
		user_manager = Users()
		for comment in comments:
			thisComment = {}
			thisComment['body'] = comment[0]
			thisComment['poster_id'] = comment[1]
			thisComment['feed_name'] = comment[2]
			thisComment['timeString'] = comment[4]
			thisComment['timeStamp'] = comment[5]
			thisComment['comment_id'] = comment[3]
			thisComment['unique_id'] = comment[6]
			thisComment['isComment'] = True
			thisUser = user_manager.getInfo(thisComment['poster_id'])
			thisComment['first_name'] = thisUser['first_name']
			thisComment['last_name'] = thisUser['last_name']
			thisComment['avatar_url'] = thisUser['avatar_url']
			thisComment['time'] = self.date_format(int(thisComment['timeStamp']))
			commentList.append(thisComment)
		user_manager.closeConnection()
		return commentList	


	def date_format(self, time = False):
		"""
		Get a datetime object or a int() Epoch timestamp and return a
		pretty string like 'an hour ago', 'Yesterday', '3 months ago',
		'just now', etc
		"""
		from datetime import datetime
		now = datetime.now()
		if type(time) is int:
		    diff = now - datetime.fromtimestamp(time)
		elif isinstance(time,datetime):
		    diff = now - time
		elif not time:
		    diff = now - now
		second_diff = diff.seconds
		day_diff = diff.days

		if day_diff < 0:
		    return ''

		if day_diff == 0:
		    if second_diff < 10:
		        return "just now"
		    if second_diff < 60:
		        return str(second_diff) + "s"
		    if second_diff < 120:
		        return "1m"
		    if second_diff < 3600:
		        return str(int(second_diff / 60)) + "m"
		    if second_diff < 7200:
		        return "1h"
		    if second_diff < 86400:
		        return str(int(second_diff / 3600)) + "h"
		if day_diff == 1:
		    return "1d"
		if day_diff < 7:
		    return str(int(day_diff)) + "d"
		if day_diff < 31:
		    return str(int(day_diff / 7)) + "w"
		if day_diff < 365:
		    return str(int(day_diff / 30)) + "m"
		return str(int(day_diff / 365)) + "y"


	def search(self, postDict, s = None, poster_id = None, isComment = None):
		removeList = list()
		new_list = list()
		for item in postDict:
			new_list.append(item)

		if s != None:
			for post in new_list:
				if post['body'].lower().find(s.lower()) == -1:
					removeList.append(post)
			for post in removeList:
				new_list.remove(post)

		removeList = list()
		if poster_id != None:
			for post in new_list:
				if post['poster_id'].lower() != poster_id.lower():
					removeList.append(post)
			for post in removeList:
				new_list.remove(post)
		
		return new_list
			
	# runs mergesort on a list of messages
	def sortAscending(self, alist):
		for fillslot in range(len(alist)-1,0,-1):
			positionOfMax = 0
			for location in range(1,fillslot+1):
				if alist[location]['timeStamp'] > alist[positionOfMax]['timeStamp']:
					positionOfMax = location

			temp = alist[fillslot]
			alist[fillslot] = alist[positionOfMax]
			alist[positionOfMax] = temp

	# runs mergesort on a list of messages
	def sortDescending(self, alist):
		for fillslot in range(len(alist)-1,0,-1):
			positionOfMax = 0
			for location in range(1,fillslot+1):
				if alist[location]['timeStamp'] < alist[positionOfMax]['timeStamp']:
					positionOfMax = location

			temp = alist[fillslot]
			alist[fillslot] = alist[positionOfMax]
			alist[positionOfMax] = temp


def test_posting(test_size):
	resetDatabase()
	feed_name = "TEST_EVENT"

	
	createThread(feed_name)
	testUsers = ['darekj', 'elic', 'briank', 'luisv', 'paulc', 'mashis', 'yuuyaw', 'shoutay', 'gabbys']
	times = {}
	times['size'] = test_size

	time_0 = time.time()
	for n in range(0,test_size):
		body = id_generator()

		user_index = random.randint(0,len(testUsers)-1)
		
		isTrade = (random.randint(0,1) == 1)
		isPlay = (random.randint(0,1) == 1)
		isChill = (random.randint(0,1) == 1)
		postInThread(feed_name, body, testUsers[user_index], isTrade, isPlay, isChill)

	time_1 = time.time()
	total_time = time_1 - time_0
	times['post_time'] = total_time
	print("done with posts!")

	time_0 = time.time()
	all_posts = getPosts(feed_name)
	time_1 = time.time()

	sortAscending(all_posts)

	total_time = time_1 - time_0
	times['get_time'] = total_time
	print("done with get posts!")


	count = 0
	time_0 = time.time()
	for post in all_posts:
		randomInt = random.randint(0,3)
		if randomInt < 3:
			numComments = random.randint(10,30)
			for n in range(0, numComments):
				user_index = random.randint(0,6)
				print("made comment number : " + str(count))
				count = count + 1
				sys.stdout.flush()
				makeComment(feed_name, post['comment_id'], id_generator(), testUsers[user_index])



	time_1 = time.time()
	total_time = time_1 - time_0
	times['comment_time'] = total_time
	print("done with get comments!")	

	time_0 = time.time()
	# report random posts
	for x in getAll(feed_name):
		if x['isComment']:
			randomInt = random.randint(0,9)
			if randomInt < 3:
				reportComment(feed_name, x['unique_id'], id_generator(), id_generator(), 'darekj', x['poster_id'])
		else:
			randomInt = random.randint(0,9)
			if randomInt < 3:
				reportPost(feed_name, x['unique_id'], id_generator(), id_generator(), 'darekj', x['poster_id'])


	time_1 = time.time()
	total_time = time_1 - time_0
	times['report_time'] = total_time		
	print("done with get reports!")	


	time_0 = time.time()
	# edit random posts
	for x in getAll(feed_name):
		if x['isComment']:
			randomInt = random.randint(0,9)
			if randomInt < 3:
				editComment(feed_name, x['unique_id'], 'body', "CHANGED!")
		else:
			randomInt = random.randint(0,9)
			if randomInt < 3:
				editPost(feed_name, x['unique_id'], 'body', "CHANGED!")


	time_1 = time.time()
	total_time = time_1 - time_0
	times['edit_time'] = total_time	

	print("done with get edits!")


	time_0 = time.time()
	for x in getPosts(feed_name):
		if x['body'] == "CHANGED!":
			deletePost(feed_name, x['unique_id'])


	time_1 = time.time()
	total_time = time_1 - time_0
	times['delete_time'] = total_time	
	print("done with get deletes!")


	return times



def initializeSQL():
	createFeedNameTable()
	createCommentIdTable()


def initializeFeed(feed_name):
	addFeedName(feed_name)
	createThread(feed_name)


def makeTestList(start, size):
	test_list = list()
	x = start
	for n in range(0, size):
		test_list.append(x)
		x = 2 * x
	return test_list


# initial = 1
# n = 1
# test_sizes = makeTestList(initial, n)
# all_times = list()
# print(test_sizes)
# for x in test_sizes:
# 	time_0 = time.time()
# 	times = test_posting(x)
# 	time_1 = time.time()
# 	total_time = time_1 - time_0
# 	times['total'] = total_time
# 	all_times.append(times)
	

# for key in all_times[0]:
# 	s = key + " : "
# 	for i in range(0, n):
# 		s = s + str(all_times[i][key]) + ", "

# 	print(s)


# # resetDatabase()

# db.close()
# post_db.close()

