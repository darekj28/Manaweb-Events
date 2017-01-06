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
		self.SEEN_POSTS_SUFFIX = "_seen_posts"
		self.COMMENT_ID_PREFIX = "c_"
		self.LAST_POST_TABLE = "last_post_table"

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


	def getTimeString(self, timeStamp):
		res = time.strftime("%I:%M%p - %B %d, %Y", time.gmtime(timeStamp))
		return res.lstrip("0")
	# generates a random id
	def id_generator(self, size=6, chars=string.ascii_uppercase + string.digits):
		return ''.join(random.choice(chars) for _ in range(size))


	def createSeenPostsTable(self, feed_name):
		sql = "CREATE TABLE IF NOT EXISTS " + feed_name + self.SEEN_POSTS_SUFFIX + " (userID TEXT PRIMARY KEY, last_seen_post TEXT, numUnseen INTEGER, timeStamp FLOAT, timeString TEXT)"
		self.db.execute(sql)
		
		addIndexCode = 'CREATE INDEX IF NOT EXISTS userID ON ' + feed_name + self.SEEN_POSTS_SUFFIX + ' (userID)'
		self.db.execute(addIndexCode)


	def removeFeed(self, feed_name):
		sql = "DELETE FROM " + self.FEED_NAMES +  " WHERE feed_name = %s"
		self.db.execute(self.db.mogrify(sql, (feed_name,)))


	def initializeSeenPostsTable(self):
		
		feed_names_list = self.getFeedNames()

		
		for feed_name in feed_names_list:
			self.createSeenPostsTable(feed_name)
			table_name = feed_name + self.SEEN_POSTS_SUFFIX
			

		user_manager = Users()
		user_list = user_manager.getUserList()
		user_manager.closeConnection()

		for user in user_list:
			self.addUserToLastSeenTables(user)
				

	# adds a post to the last seen posts table
	# updates everyone's post 
	def updateSeenTableWithNewPost(self, feed_name, comment_id):

		table_name = feed_name + self.SEEN_POSTS_SUFFIX

		# update every user as this is the most recent
		# update the number of unseen posts
		sql = "SELECT * FROM " + table_name
		self.db.execute(sql)
		query = self.db.fetchall() 
		numUnseenDict = {}
		for item in query:
			numUnseenDict[item[0]] = item[2]

		this_post = self.getPostById(feed_name, comment_id)
		sql = "UPDATE " + table_name + " SET numUnseen = %s, timeStamp = %s, timeString = %s WHERE userID = %s"
		for user in numUnseenDict.keys():
			# only increment if this is not the op
			if user != this_post['poster_id']:
				self.db.execute(self.db.mogrify(sql, (numUnseenDict[user] + 1, this_post['timeStamp'], this_post['timeString'], user)))





	def getNumUnseenPosts(self, feed_name, userID):
		table_name = feed_name + self.SEEN_POSTS_SUFFIX
		sql = "SELECT numUnseen FROM " + table_name + " WHERE userID = %s"
		self.db.execute(self.db.mogrify(sql, (userID,)))
		query = self.db.fetchall()

		if len(query) == 0:
			self.addUserToLastSeenTables(userID)
			return 0
		return query[0][0]


	def markPostFeedAsSeen(self, feed_name, userID):

		table_name = feed_name + self.SEEN_POSTS_SUFFIX
		sql = "SELECT numUnseen FROM " + table_name + " WHERE userID = %s"
		self.db.execute(self.db.mogrify(sql, (userID,)))
		query = self.db.fetchall()
		if len(query) == 0:
			self.addUserToLastSeenTables(userID)

		table_name = feed_name + self.SEEN_POSTS_SUFFIX
		timeStamp = time.time()
		timeString = self.getTimeString(timeStamp)
		sql = "UPDATE " + table_name + " SET last_seen_post = %s, numUnseen = %s, timeStamp = %s, timeString = %s WHERE userID = %s"
		last_seen_post = self.getPostById(feed_name, self.getLastPost(feed_name))
		self.db.execute(self.db.mogrify(sql, (last_seen_post['comment_id'], 0, last_seen_post['timeStamp'], last_seen_post['timeString'], userID)))


	# maybe make another table that stores this information
	# returns the comment_id of the most recent post
	def getLastPost(self, feed_name):
		sql = "SELECT comment_id FROM " + self.LAST_POST_TABLE + " WHERE feed_name = %s" 
		self.db.execute(self.db.mogrify(sql, (feed_name,)))
		query = self.db.fetchall()
		return query[0][0]


	def createLastPostTable(self):

		sql = "CREATE TABLE IF NOT EXISTS " + self.LAST_POST_TABLE + " (feed_name TEXT PRIMARY KEY, comment_id TEXT)"
		self.db.execute(sql)

		addIndexCode = 'CREATE INDEX IF NOT EXISTS feed_name ON ' + self.LAST_POST_TABLE + ' (feed_name)'
		self.db.execute(addIndexCode)


	def recalculateLastPostTable(self, feed_name):
		allPosts = self.getPosts(feed_name)
		self.sortDescending(allPosts)
		lastPostId = allPosts[0]['comment_id']
		self.updateLastPostTable(feed_name, lastPostId)
		


	def updateLastPostTable(self, feed_name, comment_id):
		sql = "UPDATE " + self.LAST_POST_TABLE + " SET comment_id = %s WHERE feed_name =  %s"
		self.db.execute(self.db.mogrify(sql, (comment_id, feed_name)))


	# run this every time a user creates an account
	def addUserToLastSeenTables(self, userID):
		# defaults starts their number of unseen posts as number of posts in the feed (can adjust this later)
		
		feed_names_list = self.getFeedNames()
		user_manager = Users()
		user_list = user_manager.getUserList()
		user_manager.closeConnection()

		
		if userID in user_list:
			for feed_name in feed_names_list:
				allPosts = self.getPosts(feed_name)
				initialNumUnseenPosts = len(allPosts)
				firstPost = allPosts[0]
				sql = "INSERT INTO " + feed_name + self.SEEN_POSTS_SUFFIX + " (userID, numUnseen, last_seen_post) VALUES (%s, %s, %s) ON CONFLICT (userID) DO UPDATE SET userID = %s"
				self.db.execute(self.db.mogrify(sql, (userID, initialNumUnseenPosts, firstPost['comment_id'], userID)))
				self.post_db.commit()

	



	# this will manually recalculate the number of unseen posts 
	# should be performed when there is a deletion of a post 
	def recalculateUnseenPosts(self, feed_name):
		table_name = feed_name + self.SEEN_POSTS_SUFFIX
		user_manager = Users()
		user_list = user_manager.getUserList()
		user_manager.closeConnection()

		post_list = self.getPosts(feed_name)

		for userID in user_list: 
			lastPost = self.getLastSeenPost(feed_name, userID)

			lastPostInfo = self.getPostById(feed_name, lastPost['comment_id'])

			# gets the previous post if the current one is gone
			for post in post_list: 
				if lastPostInfo == None and lastPost['timeStamp'] > post['timeStamp']:
					lastPostInfo = post

			count = 0
			
			for post in post_list:
				if post['timeStamp'] > lastPostInfo['timeStamp'] and post['poster_id'] != userID:
					count = count + 1

			sql = "UPDATE " + table_name + " SET numUnseen = %s, timeStamp = %s, timeString = %s WHERE userID = %s"
			self.db.execute(self.db.mogrify(sql, (count, lastPostInfo['timeStamp'], lastPostInfo['timeString'], userID)))


	

	def getLastSeenPost(self, feed_name, userID):
		table_name = feed_name + self.SEEN_POSTS_SUFFIX
		sql = "SELECT * FROM " + table_name + " WHERE userID = %s"
		self.db.execute(self.db.mogrify(sql, (userID,)))

		query = self.db.fetchone()
		if query == None:
			return self.getPostById(feed_name, self.getLastPost(feed_name))
		output = {}
		output['userID'] = query[0]
		output['comment_id'] = query[1]
		output['numUnseen'] = query[2]
		output['timeStamp'] = query[3]

		return output




	def getFeedNames(self):
		sql = "SELECT feed_name FROM " + self.FEED_NAMES
		self.db.execute(sql)
		query = self.db.fetchall()
		feed_names_list = list()
		for name in query:
			if name[0] not in feed_names_list:
				feed_names_list.append(name[0])

		return feed_names_list

	def getNumPosts(self, feed_name):
		sql = "SELECT * FROM " + feed_name
		self.db.execute(sql)
		query = self.db.fetchall()
		return len(query)	

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
		timeString = self.getTimeString(timeStamp)
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
		createNotificationTableCode = 'CREATE TABLE IF NOT EXISTS ' + self.NOTIFICATION_TABLE + ' (feed_name TEXT, comment_id TEXT, receiver_id TEXT, sender_id TEXT, action TEXT, seen BOOLEAN, notification_id TEXT, timeStamp FLOAT, timeString TEXT, numUnseenActions INTEGER)'
		self.db.execute(createNotificationTableCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS comment_id ON ' + self.NOTIFICATION_TABLE + ' (comment_id)'
		self.db.execute(addIndexCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS receiver_id ON ' + self.NOTIFICATION_TABLE + ' (receiver_id)'
		self.db.execute(addIndexCode)
		createNotificationIdTableCode = "CREATE TABLE IF NOT EXISTS " + self.NOTIFICAITON_ID_TABLE + " (notification_id TEXT)"
		self.db.execute(createNotificationIdTableCode)
		addIndexCode = "CREATE INDEX IF NOT EXISTS notification_id ON " + self.NOTIFICAITON_ID_TABLE + "(notification_id)"
		self.db.execute(addIndexCode)

	def sendNotification(self, feed_name, comment_id, receiver_id, sender_id, original_post) :
		user_manager = Users()
		sender_name = user_manager.getInfo(sender_id)['first_name']
		op_name = user_manager.getInfo(original_post['poster_id'])['first_name']
		numOtherPeople = self.getNumberOfOtherPeople(comment_id, sender_id, receiver_id)
		numNotificationsFromComment = self.getNumberOfNotificationsFromComment(comment_id, receiver_id)
		isOP = original_post['poster_id'] == receiver_id
		timeStamp = time.time()
		timeString = self.getTimeString(timeStamp)
		notification_id = self.hash_notification_id(timeString)
		self.insertNotificationIntoMain(feed_name, notification_id, timeString, timeStamp, comment_id, receiver_id, sender_id)
		if numNotificationsFromComment == 0 :
			self.addToShortList(feed_name, comment_id, receiver_id, sender_id, notification_id, timeString, timeStamp, isOP, numOtherPeople, sender_name, op_name)
		else :
			self.updateShortList(comment_id, receiver_id, sender_id, timeString, timeStamp, numOtherPeople, sender_name)
	
	def insertNotificationIntoMain(self, feed_name, notification_id, timeString, timeStamp, comment_id, receiver_id, sender_id) :
		self.createNotificationTable()
		self.addNotificationId(notification_id)
		addNotificationCode = "INSERT INTO " + self.NOTIFICATION_TABLE + " (feed_name, comment_id, receiver_id, sender_id, notification_id, timeStamp, timeString) VALUES (%s,%s,%s, %s, %s, %s, %s)"
		self.db.execute(self.db.mogrify(addNotificationCode, (feed_name, comment_id, receiver_id, sender_id, notification_id, timeStamp, timeString)))
		self.post_db.commit()
	
	def getNumberOfOtherPeople(self, comment_id, sender_id, receiver_id) : 
		sql = "SELECT * FROM " + self.NOTIFICATION_TABLE + " WHERE comment_id = %s AND receiver_id = %s"
		self.db.execute(self.db.mogrify(sql, (comment_id, receiver_id)))
		query = self.db.fetchall()
		notification_list = self.notificationListToDict(query)
		other_people = list()
		for note in notification_list :
			if note['sender_id'] not in other_people and note['sender_id'] != sender_id:
				other_people.append(note['sender_id'])
		return len(other_people)

	def getNumberOfNotificationsFromComment(self, comment_id, receiver_id) :
		self.createShortList(receiver_id)
		sql = "SELECT * FROM " + self.USER_NOTIFICATION_PREFIX + receiver_id + " WHERE comment_id = %s"
		self.db.execute(self.db.mogrify(sql, (comment_id,)))
		query = self.db.fetchall()
		return len(query) 

	def createShortList(self, receiver_id):
		table_name = self.USER_NOTIFICATION_PREFIX + receiver_id
		sql = 'CREATE TABLE IF NOT EXISTS ' + table_name + ' (feed_name TEXT, comment_id TEXT, receiver_id TEXT, sender_id TEXT, action TEXT, seen BOOLEAN, notification_id TEXT, timeStamp FLOAT, timeString TEXT, numUnseenActions INTEGER)'
		self.db.execute(sql)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS comment_id ON ' + self.NOTIFICATION_TABLE + ' (comment_id)'
		self.db.execute(addIndexCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS receiver_id ON ' + self.NOTIFICATION_TABLE + ' (receiver_id)'
		self.db.execute(addIndexCode)


	def addToShortList(self, feed_name, comment_id, receiver_id, sender_id, notification_id, timeString, timeStamp, isOP, numOtherPeople, sender_name, op_name):
		# create the short_list table for this user
		self.createShortList(receiver_id)
		seen = False
		table_name = self.USER_NOTIFICATION_PREFIX + receiver_id
		sql = "INSERT INTO " + table_name + " (feed_name, comment_id, sender_id, seen, notification_id, timeStamp, timeString, isOP, numOtherPeople, sender_name, op_name) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
		self.db.execute(self.db.mogrify(sql, (feed_name, comment_id, sender_id, seen, notification_id, timeStamp, timeString, isOP, numOtherPeople, sender_name, op_name)))
		self.post_db.commit()

		# then if we are at more than the threshold, remove the oldest one
		sql = "SELECT * FROM " + table_name
		self.db.execute(sql)
		query = self.db.fetchall()
		notification_list = self.shortNotificationListToDict(query)
		threshold = 100
		if len(notification_list) > threshold:
			self.sortAscending(notification_list)
			self.removeFromShortList(feed_name, receiver_id, notification_list[0]['notification_id'])
	
	def updateShortList(self, comment_id, receiver_id, sender_id, timeString, timeStamp, numOtherPeople, sender_name):
		self.createShortList(receiver_id)
		seen = False
		sql = "UPDATE " + self.USER_NOTIFICATION_PREFIX + receiver_id + " SET sender_id = %s, timeString = %s, timeStamp = %s, seen = %s, numOtherPeople = %s, sender_name = %s\
		WHERE comment_id = %s"
		self.db.execute(self.db.mogrify(sql, (sender_id, timeString, timeStamp, seen, numOtherPeople, sender_name, comment_id)))
		self.post_db.commit()

	def removeFromShortList(self, receiver_id, notification_id):
		self.createShortList(receiver_id)
		table_name = self.USER_NOTIFICATION_PREFIX + receiver_id
		sql = "DELETE FROM " + table_name + " WHERE notification_id = %s"
		self.db.execute(self.db.mogrify(sql, (notification_id,)))
		self.post_db.commit()
		sql = "DELETE FROM " + self.NOTIFICATION_TABLE + " WHERE notification_id = %s"
		self.db.execute(self.db.mogrify(sql, (notification_id,)))
		self.post_db.commit()

	def getShortListNotifications(self,userID):
		self.createShortList(userID)
		table_name = self.USER_NOTIFICATION_PREFIX + userID
		sql = "SELECT * FROM " + table_name
		self.db.execute(self.db.mogrify(sql))
		query = self.db.fetchall()
		notification_list = self.shortNotificationListToDict(query)
		return notification_list


	def getNotifications(self, userID):
		sql = "SELECT * FROM " + self.NOTIFICATION_TABLE + " WHERE receiver_id = %s"
		self.db.execute(self.db.mogrify(sql, (userID,)))
		query = self.db.fetchall()
		notification_list = self.notificationListToDict(query)
		return notification_list

	def getNotificationCount(self, userID) :
		sql = "SELECT * FROM " + self.USER_NOTIFICATION_PREFIX + userID + " WHERE seen = %s"
		seen = False
		self.db.execute(self.db.mogrify(sql, (seen,)))
		query = self.db.fetchall()
		return len(query)

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
			this_note['numUnseenActions'] = note[9]
			n_list.append(this_note)
		return n_list

	def shortNotificationListToDict(self, query): # check this
		n_list = list()
		for note in query:
			this_note = {'feed_name' 		: note[0],
						 'comment_id'		: note[1],
						 'receiver_id'		: note[2],
						 'sender_id'		: note[3],
						 # 'action'			: note[4]
						 'seen'				: note[5],
						 'notification_id' 	: note[6],
						 'timeStamp'		: note[7],
						 'timeString'		: self.getTimeString(note[7]),
						 #'numUnseenActions' : note[9]
						 'sender_name'		: note[10],
						 'op_name'			: note[11],
						 'numOtherPeople'	: note[12],
						 'isOP'				: note[13]
						 }
			n_list.append(this_note)
		return n_list

	def markNotificationAsSeen(self, userID):
		sql = "UPDATE " + self.USER_NOTIFICATION_PREFIX + userID + " SET seen = %s"
		seen = True
		self.db.execute(self.db.mogrify(sql, (seen,)))
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
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + self.FEED_NAMES + ' (feed_name TEXT PRIMARY KEY)'
		self.db.execute(createTableCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS feed_name ON ' + self.FEED_NAMES + ' (feed_name)'
		self.db.execute(addIndexCode)


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
		timeString = self.getTimeString(timeStamp)

		self.db.execute(self.db.mogrify("INSERT INTO " + self.REPORT_TABLE + "(feed_name, id, body, reason, isComment, description, timeStamp, timeString, reporting_user, reported_user) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", (feed_name, comment_id, body, reason, False, description, timeStamp, timeString, reporting_user, reported_user)))
		self.post_db.commit()

		action = "REPORTED POST"
		isComment = False
		self.updateAdminTable(feed_name, body, reported_user, action, comment_id, timeString, timeStamp, isComment)


	def reportComment(self, feed_name, unique_id, reason, description, reporting_user, reported_user):
		body = self.getCommentById(feed_name, unique_id)['body']
		timeStamp = time.time()
		timeString = self.getTimeString(timeStamp)
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
		user_manager = Users()

		user_info_table = user_manager.getUserInfoTable()
		output = self.postListToDict(this_post, user_info_table)
		user_manager.closeConnection()
		if len(output) == 0:
			return None
		else:
			return output[0]

	def getCommentById(self, feed_name, unique_id):
		table_name = "c_" + feed_name
		self.db.execute(self.db.mogrify("SELECT * FROM " + table_name + " WHERE unique_id = %s", (unique_id,)))
		this_comment = self.db.fetchall()

		user_manager = Users()
		user_info_table = user_manager.getUserInfoTable()
		output = self.commentListToDict(this_comment, user_info_table)
		user_manager.closeConnection()

		sys.stdout.flush()
		if len (output) == 0:
			return None
		return output[0]	


	def addFeedName(self, feed_name):
		self.db.execute(self.db.mogrify("INSERT INTO " + self.FEED_NAMES + " (feed_name) VALUES (%s) ON CONFLICT (feed_name) DO UPDATE SET feed_name = %s", (feed_name, feed_name)))
		self.post_db.commit()

		sql  = "INSERT INTO " + self.LAST_POST_TABLE  + " (feed_name) VALUES (%s) ON CONFLICT (feed_name) DO UPDATE SET feed_name = %s"
		self.db.execute(self.db.mogrify(sql, (feed_name, feed_name)))

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
		timeString = self.getTimeString(timeStamp)


		if isTrade == None:
			isTrade = False
		if isPlay == None:
			isPlay = False
		if isChill == None:
			isChill = False

		if comment_id == None:
			comment_id = self.hash_comment_id(str(timeStamp))

		self.addCommentIdToList(comment_id)
		unique_id = comment_id
		# start with zero comments
		numComments = 0 

		# following by default
		following = True

		# not just_following (ghost follower)
		ghost_following = False

		poster_id = poster_id.lower()

		post_code = self.db.mogrify("INSERT INTO " + feed_name + " (body, poster_id, feed_name, comment_id, timeString, timeStamp, isTrade, isPlay, isChill, unique_id, numComments, following, ghost_following) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s, %s, %s, %s)", (body, poster_id, feed_name, comment_id, timeString, timeStamp, isTrade, isPlay, isChill, unique_id, numComments, following, ghost_following))
		self.db.execute(post_code)
		self.post_db.commit()

		action = "MAKE POST"
		isComment = False
		self.updateAdminTable(feed_name, body, poster_id, action, unique_id, timeString, timeStamp, isComment)

		# add to posts seen table
		self.updateSeenTableWithNewPost(feed_name, comment_id)
		self.updateLastPostTable(feed_name, comment_id)

	def makeComment(self, feed_name, comment_id, body, poster_id, unique_id = None):
		timeStamp = time.time()
		timeString = self.getTimeString(timeStamp)
		comment_id = comment_id

		if unique_id == None:
			unique_id = self.hash_comment_id(comment_id)
		
		self.addCommentIdToList(unique_id)

		poster_id = poster_id.lower()
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
		# user_manager = Users()
		for userID in participating_users:
			if userID != poster_id:
				self.sendNotification(feed_name, comment_id, userID, poster_id, this_post)



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
		user_manager = Users()
		user_info_table = user_manager.getUserInfoTable()
		user_manager.closeConnection()
		postDict = self.postListToDict(posts, user_info_table)
		
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
		comments = self.db.fetchall()
		user_manager = Users()
		user_info_table = user_manager.getUserInfoTable()
		commentDict = self.commentListToDict(comments, user_info_table)
		user_manager.closeConnection()
		return commentDict


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
		timeString = self.getTimeString(timeStamp)
		update_time_code = "UPDATE " + table_name  + " SET timeString = ?, timeStamp = ? WHERE unique_id = '" + unique_id + "'"
		self.db.execute(self.db.mogrify(update_time_code, (timeString, timeStamp)))
		self.post_db.commit()

	# edits post 
	# field_name should be a string
	def editPost(self, feed_name, unique_id, field_name, field_data):
		table_name  = feed_name
		timeStamp = time.time()
		timeString = self.getTimeString(timeStamp)
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
		timeString = self.getTimeString(timeStamp)
		update_code = "UPDATE " + table_name  + " SET " + field_name + " = %s WHERE unique_id = '" + unique_id + "'"
		self.db.execute(self.db.mogrify(update_code, (field_data,)))
		self.post_db.commit()

		thisComment= self.getCommentById(feed_name, unique_id)
		action = "EDIT COMMENT"
		isComment = True
		self.updateAdminTable(thisComment['feed_name'], thisComment['body'], thisComment['poster_id'], action , thisComment['unique_id'], timeString, timeStamp, isComment)



	def deletePost(self, feed_name, unique_id):
		timeStamp = time.time()
		timeString = self.getTimeString(timeStamp)
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


		self.recalculateLastPostTable(feed_name)

		self.recalculateUnseenPosts(feed_name)

	def deleteComment(self, feed_name, unique_id):
		timeStamp = time.time()
		timeString = self.getTimeString(timeStamp)
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




	def postListToDict(self, posts, user_info_table):
		postList = list()
		for post in posts:
			thisPost = {}
			thisPost['body'] = post[0]
			thisPost['poster_id'] = post[1]
			thisPost['feed_name'] = post[2]
			thisPost['timeString'] = self.getTimeString(post[5])
			thisPost['timeStamp'] = post[5]
			thisPost['time'] = self.date_format(int(thisPost['timeStamp']))
			thisPost['isTrade'] = post[6]
			thisPost['isPlay'] = post[7]
			thisPost['isChill'] = post[8]
			thisPost['comment_id'] = post[3]
			thisPost['isComment'] = False
			thisUser = user_info_table[thisPost['poster_id']]
			thisPost['first_name'] = thisUser['first_name']
			thisPost['last_name'] = thisUser['last_name']
			thisPost['avatar_url'] = thisUser['avatar_url']
			thisPost['avatar'] = thisUser['avatar_name']
			thisPost['unique_id'] = post[9]
			thisPost['numComments'] = post[10]
			postList.append(thisPost)	
		return postList	

	def commentListToDict(self, comments, user_info_table):
		commentList = list()

		for comment in comments:
			thisComment = {}
			thisComment['body'] = comment[0]
			thisComment['poster_id'] = comment[1]
			thisComment['feed_name'] = comment[2]
			thisComment['timeString'] = self.getTimeString(post[5])
			thisComment['timeStamp'] = comment[5]
			thisComment['comment_id'] = comment[3]
			thisComment['unique_id'] = comment[6]
			thisComment['isComment'] = True
			thisUser = user_info_table[thisComment['poster_id']]
			thisComment['first_name'] = thisUser['first_name']
			thisComment['last_name'] = thisUser['last_name']
			thisComment['avatar_url'] = thisUser['avatar_url']
			thisComment['avatar'] = thisUser['avatar_name']
			thisComment['time'] = self.date_format(int(thisComment['timeStamp']))
			commentList.append(thisComment)
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


	def makePosterIdLowerCase(self):

		sql = "UPDATE " + self.EVENT_TABLE + " SET poster_id = %s WHERE poster_id = %s"
		poster_id = 'Darekj'
		lower_id = 'darekj'
		self.db.execute(self.db.mogrify(sql, (lower_id, poster_id)))

	def deleteUserPosts(self, userID):
		feed_names = self.getFeedNames()
		for feed_name in feed_names:
			allPosts = self.getPosts(feed_name)
			for post in allPosts:
				if post['poster_id'] == userID:
					self.deletePost(feed_name, post['comment_id'])


	# def updateNotificationsTablesFornumUnseenActions(self, table_name):
	# 	sql = "ALTER TABLE " + table_name + " ADD numUnseenActions INTEGER DEFAULT 1"
	# 	self.db.execute(self.db.mogrify(sql))

	def deleteNotifications(self):
		user_manager = Users()
		user_list = user_manager.getUserList()
		user_manager.closeConnection()

		# delete from short lists
		for user in user_list:
			self.createShortList(user)
			sql  = "DELETE FROM " + self.USER_NOTIFICATION_PREFIX + user
			self.db.execute(sql)

	def addColumn(self, table_name, column_name, column_type):
		sql = "ALTER TABLE " + table_name + " ADD " + column_name + " " +  column_type
		self.db.execute(self.db.mogrify(sql))


