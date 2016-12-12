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
import users


import psycopg2
import urllib


# for when we upload to heroku
# comment out if testing
urllib.parse.uses_netloc.append("postgres")
os.environ["DATABASE_URL"] = "postgres://spkgochzoicojm:y0MABz523D1H-zMqeZVvplCuC2@ec2-54-163-252-55.compute-1.amazonaws.com:5432/d15b0teu2kkhek"
url = urllib.parse.urlparse(os.environ["DATABASE_URL"])





post_db = psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)

db = post_db.cursor()


# generates a random id
def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
	return ''.join(random.choice(chars) for _ in range(size))


# deletes a table
def deleteTable(table_name):	
	deleteTableCode = "DROP TABLE IF EXISTS " + table_name
	db.execute(deleteTableCode)

# resets db
def resetDatabase():
	
	deleteTable('admin_table')
	deleteTable('report_table')
	deleteTable('BALT')
	deleteTable('c_BALT')
	deleteTable('c_id')
	deleteTable('feed_names')



	initializePosts()

def initializePosts():
	createAdminTable()
	createReportTable()
	createFeedNameTable()
	createCommentIdTable()
	


def createAdminTable():
	table_name = 'admin_table' 
	createAdminTableCode = 'CREATE TABLE IF NOT EXISTS ' + table_name  + '(feed_name TEXT, body TEXT, poster_id TEXT, action TEXT, unique_id TEXT, timeString TEXT, timeStamp FLOAT, isComment BOOLEAN)'
	db.execute(createAdminTableCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS unique_id ON ' + table_name + ' (unique_id)'
	db.execute(addIndexCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS poster_id ON ' + table_name + ' (poster_id)'
	db.execute(addIndexCode)
	post_db.commit()

def updateAdminTable(feed_name, body, poster_id, action, unique_id, timeString, timeStamp, isComment):
	table_name =  'admin_table'
	updateAdminTableCode = "INSERT INTO " + table_name  + "(feed_name, body, poster_id, action, unique_id, timeString, timeStamp, isComment) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)"
	db.execute(db.mogrify(updateAdminTableCode, (feed_name, body, poster_id, action, unique_id, timeString, timeStamp, isComment)))
	post_db.commit() 


def createThread(feed_name):
	posts_id =  feed_name
	createTableCode = 'CREATE TABLE IF NOT EXISTS ' + posts_id + ' (body TEXT, poster_id TEXT, feed_name TEXT, comment_id TEXT, timeString TEXT, timeStamp FLOAT, isTrade BOOLEAN, isPlay BOOLEAN, isChill BOOLEAN, unique_id TEXT, numComments INT)'
	db.execute(createTableCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS poster_id ON ' + posts_id + ' (poster_id)'
	db.execute(addIndexCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS comment_id ON ' + posts_id + ' (comment_id)'
	db.execute(addIndexCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS unique_id ON ' + posts_id + ' (unique_id)'
	db.execute(addIndexCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS timeStamp ON ' + posts_id + ' (timeStamp)'
	db.execute(addIndexCode)

	comments_id = "c_" + feed_name
	createTableCode = 'CREATE TABLE IF NOT EXISTS ' + comments_id + ' (body TEXT, poster_id TEXT, feed_name TEXT, comment_id TEXT, timeString TEXT, timeStamp FLOAT, unique_id TEXT)'
	db.execute(createTableCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS poster_id ON ' + comments_id + ' (poster_id)'
	db.execute(addIndexCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS comment_id ON ' + comments_id + ' (comment_id)'
	db.execute(addIndexCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS timeStamp ON ' + comments_id + ' (timeStamp)'
	addIndexCode = 'CREATE INDEX IF NOT EXISTS unique_id ON ' + comments_id + ' (unique_id)'

	db.execute(addIndexCode)


def createFeedNameTable():
	feed_table = "feed_names"
	createTableCode = 'CREATE TABLE IF NOT EXISTS ' + feed_table + ' (feed_name TEXT)'
	db.execute(createTableCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS feed_name ON ' + feed_table + ' (feed_name)'
	db.execute(addIndexCode)


def createReportTable():
	report_table = "report_table"
	createTableCode = 'CREATE TABLE IF NOT EXISTS ' + report_table + ' (feed_name TEXT, id TEXT, body TEXT, reason TEXT ,isComment BOOLEAN, description TEXT, timeString TEXT, timeStamp FLOAT, reporting_user TEXT, reported_user TEXT)'
	db.execute(createTableCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS id ON ' + report_table + ' (id)'
	db.execute(addIndexCode)

def reportPost(feed_name, comment_id, reason, description, reporting_user, reported_user):
	report_table = "report_table"
	body = getPostById(feed_name, comment_id)['body']
	timeStamp = time.time()
	timeString = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

	db.execute(db.mogrify("INSERT INTO " + report_table + "(feed_name, id, body, reason, isComment, description, timeStamp, timeString, reporting_user, reported_user) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", (feed_name, comment_id, body, reason, False, description, timeStamp, timeString, reporting_user, reported_user)))
	post_db.commit()

	action = "REPORTED POST"
	isComment = False
	updateAdminTable(feed_name, body, reported_user, action, comment_id, timeString, timeStamp, isComment)


def reportComment(feed_name, unique_id, reason, description, reporting_user, reported_user):
	report_table = "report_table"
	body = getCommentById(feed_name, unique_id)['body']
	timeStamp = time.time()
	timeString = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	db.execute(db.mogrify("INSERT INTO " + report_table + "(feed_name, id, body, reason, isComment, description, timeStamp, timeString, reporting_user, reported_user) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)", (feed_name, unique_id, body, reason, True, description, timeStamp, timeString, reporting_user, reported_user)))
	post_db.commit()	
	action = "REPORTED COMMENT"
	isComment = True
	updateAdminTable(feed_name, body, reported_user, action, unique_id, timeString, timeStamp, isComment)

def hash_feed_name(s):	
	# hash_code = 7;
	# for i  in range(0,len(s)):
	# 	hash_code = (hash_code * 31 + ord(s[i])) % 1000000000
	# feed_id = str(hash_code)
	feed_id = str(hash(s) % 1000000000)
	while(cIdTaken(feed_id)):
		feed_id = str(int(feed_id) + 1)	
	return comment_id

def getPostById(feed_name, comment_id):
	db.execute(db.mogrify("SELECT * FROM " + feed_name + " WHERE comment_id = %s", (comment_id,)))
	this_post = db.fetchall()
	output = postListToDict(this_post)
	if len(output) == 0:
		return None
	else:
		return output[0]

def getCommentById(feed_name, unique_id):
	table_name = "c_" + feed_name
	db.execute(db.mogrify("SELECT * FROM " + table_name + " WHERE unique_id = %s", (unique_id,)))
	this_comment = db.fetchall()
	output = commentListToDict(this_comment)

	sys.stdout.flush()
	return output[0]	


def addFeedName(feed_name):
	feed_table = "feed_names"
	db.execute(db.mogrify("INSERT INTO " + feed_table + " (feed_name) VALUES (%s) ", (feed_name,)))
	post_db.commit()


def createCommentIdTable():
	comment_table_name = "c_id"
	createTableCode = 'CREATE TABLE IF NOT EXISTS ' + comment_table_name + ' (comment_id TEXT)'
	db.execute(createTableCode)


def hash_comment_id(s):
	# hash_code = 7;
	# for i  in range(0,len(s)):
	# 	hash_code = (hash_code * 31 + ord(s[i])) % 1000000000
	# comment_id = str(hash_code)

	comment_id = str(hash(s) % 1000000000)
	while(cIdTaken(comment_id)):
		comment_id = str(int(comment_id) + 1)
	
	return comment_id

def feedNameTaken(feed_name):
	feed_table_name = "feed_names"
	fetchMatchingIdCode = "SELECT * FROM " + comment_table_name + " WHERE feed_name = %s"
	db.execute(db.mogrify(fetchMatchingIdCode, (feed_name,)))
	matchList = db.fetchall()
	if len(matchList) > 0:
		return True
	else:
		return False

def cIdTaken(comment_id):
	comment_table_name = "c_id"
	fetchMatchingIdCode = "SELECT * FROM " + comment_table_name + " WHERE comment_id = %s"

	db.execute(db.mogrify(fetchMatchingIdCode, (comment_id,)))
	matchList = db.fetchall()

	if len(matchList) > 0:
		return True
	else:
		return False

def addCommentIdToList(comment_id):
	db.execute("INSERT INTO c_id (comment_id) VALUES (%s)", (comment_id,))
	post_db.commit()

# posts on a thread
def postInThread(feed_name, body, poster_id, isTrade = None, isPlay = None, isChill = None, comment_id = None):
	timeStamp = time.time()
	timeString = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")


	if isTrade == None:
		isTrade = False
	if isPlay == None:
		isPlay = False
	if isChill == None:
		isChill = False

	if comment_id == None:
		comment_id = hash_comment_id(str(timeStamp))

	addCommentIdToList(comment_id)
	unique_id = comment_id
	# start with zero comments
	numComments = 0 
	post_code = db.mogrify("INSERT INTO " + feed_name + " (body, poster_id, feed_name, comment_id, timeString, timeStamp, isTrade, isPlay, isChill, unique_id, numComments) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s, %s)", (body, poster_id, feed_name, comment_id, timeString, timeStamp, isTrade, isPlay, isChill, unique_id, numComments))
	db.execute(post_code)
	post_db.commit()

	action = "MAKE POST"
	isComment = False
	updateAdminTable(feed_name, body, poster_id, action, unique_id, timeString, timeStamp, isComment)


def makeComment(feed_name, comment_id, body, poster_id, unique_id = None):
	timeStamp = time.time()
	timeString = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	comment_id = comment_id

	if unique_id == None:
		unique_id = hash_comment_id(comment_id)
	

	addCommentIdToList(unique_id)

	# update number of comments
	this_post = getPostById(feed,name,comment_id)
	updatedNumComments = this_post['numComments'] + 1
	update_code = "UPDATE " + feed_name  + " SET " + "numComments" + " = %s WHERE unique_id = '" + comment_id + "'"
	db.execute(db.mogrify(update_code, (updatedNumComments,)))
	post_db.commit()

	db.execute(db.mogrify('INSERT INTO c_' + feed_name + ' (body, poster_id, feed_name, comment_id, timeString, timeStamp, unique_id) VALUES (%s,%s,%s,%s,%s,%s,%s)', (body, poster_id, feed_name, comment_id, timeString, timeStamp, unique_id)))
	post_db.commit()
	action = "MAKE COMMENT"
	isComment = True
	updateAdminTable(feed_name, body, poster_id, action, unique_id, timeString, timeStamp, isComment)





# # deletes a post by ID
# def deletePost(thead_id, post_id):

# sorts a list of messages
# the first message will be the earliest message in time
def selectionSort(alist):
	for fillslot in range(len(alist)-1,0,-1):
		positionOfMax = 0
		for location in range(1,fillslot+1):
			if alist[location]['timeStamp'] > alist[positionOfMax]['timeStamp']:
				positionOfMax = location

	temp = alist[fillslot]
	alist[fillslot] = alist[positionOfMax]
	alist[positionOfMax] = temp
	return alist


def getPosts(feed_name, tradeFilter = None, playFilter = None, chillFilter = None):
	
	# if tradeFilter == None:
	# 	tradeFilter = False
	# if playFilter == None:
	# 	playFilter = False
	# if chillFilter == None:
	# 	chillFilter = False

	feed_table_name =  feed_name

	sql_code = "SELECT * FROM " + feed_table_name

	# if tradeFilter or playFilter or chillFilter:
	# 	sql_code = sql_code + " WHERE "
	# if tradeFilter:
	# 	sql_code = sql_code + "isTrade = 1 "
	# 	if playFilter:
	# 		sql_code = sql_code + "OR isPlay = 1 "
	# 	if chillFilter:
	# 		sql_code = sql_code + "OR isChill = 1"
	# elif playFilter:
	# 	sql_code = sql_code + "isPlay = 1 "
	# 	if chillFilter:
	# 		sql_code = sql_code + "OR isChill = 1 "
	# elif chillFilter:
	# 	sql_code = sql_code + "isChill = 1 "


	db.execute(sql_code)	

	posts = db.fetchall()
	postDict = postListToDict(posts)
	return postDict


	

def getComments(feed_name, comment_id = None):
	feed_table_name =  "c_" + feed_name

	sql_code = "SELECT * FROM " + feed_table_name
	if comment_id != None:
		sql_code = sql_code + " WHERE comment_id = (%s)"
		db.execute(db.mogrify(sql_code, (comment_id,)))

	else:
		db.execute(sql_code)	
	# db.execute("SELECT * FROM " + thread_id)
	posts = db.fetchall()
	postDict = commentListToDict(posts)
	return postDict


# add back later

def getAll(feed_name, tradeFilter = None, playFilter = None, chillFilter = None):
	
	all_list = list()

	this_table_posts = getPosts(feed_name, tradeFilter = tradeFilter, playFilter = playFilter, chillFilter = chillFilter)
	for post in this_table_posts:
		all_list.append(post)

	this_table_posts = getComments(feed_name)
	for post in this_table_posts:
		all_list.append(post)

	return all_list



def updateTime(feed_name, unique_id):
	table_name  = feed_name
	timeStamp = time.time()
	timeString = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	update_time_code = "UPDATE " + table_name  + " SET timeString = ?, timeStamp = ? WHERE unique_id = '" + unique_id + "'"
	db.execute(db.mogrify(update_time_code, (timeString, timeStamp)))
	post_db.commit()

# edits post 
# field_name should be a string
def editPost(feed_name, unique_id, field_name, field_data):
	table_name  = feed_name
	timeStamp = time.time()
	timeString = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	update_code = "UPDATE " + table_name  + " SET " + field_name + " = %s WHERE unique_id = '" + unique_id + "'"
	db.execute(db.mogrify(update_code, (field_data,)))
	post_db.commit()

	thisPost = getPostById(feed_name, unique_id)
	action = "EDIT POST"
	isComment = False

	updateAdminTable(thisPost['feed_name'], thisPost['body'], thisPost['poster_id'], action, thisPost['unique_id'], timeString, timeStamp, isComment)


# edits comments 
# field_name should be a string
def editComment(feed_name, unique_id, field_name, field_data):
	table_name  = "c_" + feed_name
	timeStamp = time.time()
	timeString = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	update_code = "UPDATE " + table_name  + " SET " + field_name + " = %s WHERE unique_id = '" + unique_id + "'"
	db.execute(db.mogrify(update_code, (field_data,)))
	post_db.commit()

	thisComment= getCommentById(feed_name, unique_id)
	action = "EDIT COMMENT"
	isComment = True
	updateAdminTable(thisComment['feed_name'], thisComment['body'], thisComment['poster_id'], action , thisComment['unique_id'], timeString, timeStamp, isComment)



def deletePost(feed_name, unique_id):
	timeStamp = time.time()
	timeString = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	thisPost = getPostById(feed_name, unique_id)
	action = "DELETE POST"
	isComment = False
	updateAdminTable(thisPost['feed_name'], thisPost['body'], thisPost['poster_id'], action , thisPost['unique_id'], timeString, timeStamp, isComment)


	table_name = feed_name
	sql = "DELETE FROM " + table_name + " WHERE unique_id = %s"
	db.execute(db.mogrify(sql, (unique_id,)))

	table_name = "c_" + feed_name
	sql = "DELETE FROM " + table_name + " WHERE comment_id = %s"
	db.execute(db.mogrify(sql, (unique_id,)))
	post_db.commit()



def deleteComment(feed_name, unique_id):
	timeStamp = time.time()
	timeString = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
	thisComment = getCommentById(feed_name, unique_id)
	action = "DELETE COMMENT"
	isComment = True
	updateAdminTable(thisComment['feed_name'], thisComment['body'], thisComment['poster_id'], action , thisComment['unique_id'], timeString, timeStamp, isComment )

	# update number of comments
	this_post = getPostById(feed,name,thisComment['comment_id'])
	updatedNumComments = this_post['numComments'] - 1
	update_code = "UPDATE " + feed_name  + " SET " + "numComments" + " = %s WHERE unique_id = '" + thisComment['comment_id'] + "'"
	db.execute(db.mogrify(update_code, (updatedNumComments,)))
	post_db.commit()

	table_name = "c_" + feed_name
	sql = "DELETE FROM " + table_name + " WHERE unique_id = %s"
	db.execute(db.mogrify(sql, (unique_id,)))
	post_db.commit()


def postListToDict(posts):
	postList = list()
	for post in posts:

		thisPost = {}
		thisPost['body'] = post[0]
		thisPost['poster_id'] = post[1]
		thisPost['feed_name'] = post[2]
		thisPost['timeString'] = post[4]
		thisPost['timeStamp'] = post[5]
		thisPost['time'] = date_format(int(thisPost['timeStamp']))
		thisPost['isTrade'] = post[6]
		thisPost['isPlay'] = post[7]
		thisPost['isChill'] = post[8]
		thisPost['comment_id'] = post[3]
		thisPost['isComment'] = False
		thisUser = users.getInfo(thisPost['poster_id'])
		thisPost['first_name'] = thisUser['first_name']
		thisPost['last_name'] = thisUser['last_name']
		thisPost['avatar_url'] = thisUser['avatar_url']
		thisPost['unique_id'] = post[9]
		thisPost['numComments'] = post[10]
		postList.append(thisPost)
	return postList	

def commentListToDict(comments):
	commentList = list()
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
		thisUser = users.getInfo(thisComment['poster_id'])
		thisComment['first_name'] = thisUser['first_name']
		thisComment['last_name'] = thisUser['last_name']
		thisComment['avatar_url'] = thisUser['avatar_url']
		thisComment['time'] = date_format(int(thisComment['timeStamp']))
		commentList.append(thisComment)
	return commentList	


def date_format(time = False):
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


def search(postDict, s = None, poster_id = None, isComment = None):
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
def sortAscending(alist):
   for fillslot in range(len(alist)-1,0,-1):
       positionOfMax = 0
       for location in range(1,fillslot+1):
           if alist[location]['timeStamp'] > alist[positionOfMax]['timeStamp']:
               positionOfMax = location

       temp = alist[fillslot]
       alist[fillslot] = alist[positionOfMax]
       alist[positionOfMax] = temp

# runs mergesort on a list of messages
def sortDescending(alist):
   for fillslot in range(len(alist)-1,0,-1):
       positionOfMax = 0
       for location in range(1,fillslot+1):
           if alist[location]['timeStamp'] < alist[positionOfMax]['timeStamp']:
               positionOfMax = location

       temp = alist[fillslot]
       alist[fillslot] = alist[positionOfMax]
       alist[positionOfMax] = temp


def test(test_size):
	resetDatabase()
	feed_name = "BALT"
	
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
	total_time = time_1 - time_0
	times['get_time'] = total_time
	print("done with get posts!")


	time_0 = time.time()
	for post in all_posts:
		randomInt = random.randint(0,9)
		if randomInt < 3:
			numComments = random.randint(1,5)
			for n in range(0, numComments):
				user_index = random.randint(0,6)
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


# initial = 20
# n = 1
# test_sizes = makeTestList(initial, n)
# all_times = list()
# print(test_sizes)
# for x in test_sizes:
# 	time_0 = time.time()
# 	times = test(x)
# 	time_1 = time.time()
# 	total_time = time_1 - time_0
# 	times['total'] = total_time
# 	all_times.append(times)
	

# for key in all_times[0]:
# 	s = key + " : "
# 	for i in range(0, n):
# 		s = s + str(all_times[i][key]) + ", "

# 	print(s)


# db.close()
# post_db.close()

