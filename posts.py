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

import psycopg2
import urllib

urllib.parse.uses_netloc.append("postgres")
url = urllib.parse.urlparse(os.environ["DATABASE_URL"])
post_db = conn = psycopg2.connect(
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
	global db
	global post_db
	# db.execute("SELECT name FROM sqlite_master WHERE type='table';")
	# for table in db.fetchall():
	# 	deleteTable(table[0])
	createHashTable()


def generateRandomNameIdPair():
	thread_name = ""
	for n in range(0,9):
		thread_name = thread_name + str(random.randint(0,10))

	thread_id = thread_name
	return (thread_name, thread_id)

# creates a table in SQL to store a thread
# makes the table name the id of the thread
# ultimately there will threads within threads for commenting on other posts
# every post will have an id
def createThread(thread_name = None, thread_id = None):
	if thread_name == None and thread_id == None:
		thread_pair = generateRandomName()
		createHashTable()
		addToHashTable(thread_pair[0], thread_pair[1])

	elif thread_id == None:
		createHashTable()
		addToHashTable(thread_name)

	elif thread_name == None:
		createHashTable()
		thread_name = thread_id
		addToHashTable(thread_name = thread_name, thread_id = thread_id)

	else:
		createHashTable()
		addToHashTable(thread_name = thread_name, thread_id = thread_id)


	thread_id = getIdFromName(thread_name)
	
	createTableCode = 'CREATE TABLE IF NOT EXISTS ' + thread_id + ' (body TEXT, poster_id TEXT, thread_id TEXT, timeString TEXT, timeStamp REAL, isTrade BOOLEAN, isPlay BOOLEAN, isChill BOOLEAN, comment_id TEXT)'
	db.execute(createTableCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS thread_id ON ' + thread_id + ' (thread_id)'
	db.execute(addIndexCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS timeStamp ON ' + thread_id + ' (timeStamp)'
	db.execute(addIndexCode)



# posts on a thread
def postInThread(thread_id, body, poster_id, isTrade = None, isPlay = None, isChill = None):
	timeStamp = time.time()
	timeString = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
	# if the thread doesn't exist yet, create it
	if getNameFromId(thread_id) == None:
		thread_name = str(timeStamp)
		createThread(thread_id = thread_id)

	if isTrade == None:
		isTrade = False
	if isPlay == None:
		isPlay = False
	if isChill == None:
		isChill = False

	comment_id = hash_name(str(timeStamp))
	#createThread(thread_name = comment_id, thread_id = comment_id)
	db.execute('INSERT INTO ' + thread_id + ' (body, poster_id, thread_id, timeString, timeStamp, isTrade, isPlay, isChill, comment_id) VALUES (?,?,?,?,?,?,?,?,?)', (body, poster_id, thread_id, timeString, timeStamp, isTrade, isPlay, isChill, comment_id))
	post_db.commit()


def postComment(comment_id, body, poster_id, isTrade = None, isPlay = None, isChill = None):
	timeStamp = time.time()
	timeString = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
	# if the thread doesn't exist yet, create it
	if getNameFromId(thread_id) == None:
		thread_name = str(timeStamp)
		createThread(thread_id = thread_id)

	if isTrade == None:
		isTrade = False
	if isPlay == None:
		isPlay = False
	if isChill == None:
		isChill = False

	comment_id = 0
	#createThread(thread_name = comment_id, thread_id = comment_id)
	db.execute('INSERT INTO ' + thread_id + ' (body, poster_id, thread_id, timeString, timeStamp, isTrade, isPlay, isChill, comment_id) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)', (body, poster_id, thread_id, timeString, timeStamp, isTrade, isPlay, isChill, comment_id))
	post_db.commit()


def hash_name(thread_name):
	thread_id = str(hash(thread_name) % 1000000000)
	while(len(getNameFromIdList(thread_id)) > 0):
		thread_id = str(int(thread_id) + 1)	
	return "id_" + thread_id


def createHashTable():
	hash_table_name = 'hash_table'
	createTableCode = 'CREATE TABLE IF NOT EXISTS ' + hash_table_name + ' (thread_id TEXT, thread_name TEXT, timeString TEXT, timeStamp REAL)'
	db.execute(createTableCode)
	addIndexCode = "CREATE INDEX IF NOT EXISTS thread_id ON " + hash_table_name + " (thread_id)"
	db.execute(addIndexCode)
	addIndexCode = "CREATE INDEX IF NOT EXISTS thread_name ON " + hash_table_name + " (thread_name)"
	db.execute(addIndexCode)
	post_db.commit()



def addToHashTable(thread_name = None, thread_id = None):

	# if the thread id is already in the table
	if thread_id != None:
		if getNameFromId(thread_id) != None:
			return None

	# if the name is already in the table
	if thread_name != None:
		if getIdFromName(thread_name) != None:
			return None


	hash_table_name = 'hash_table'
	if thread_id == None and thread_name == None:
		return None
	if thread_id == None:
		thread_id = hash_name(thread_name)
	if thread_name == None:
		thread_name = thread_id



	timeStamp = time.time()
	timeString = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")

	
	db.execute('INSERT INTO ' + hash_table_name + ' (thread_id, thread_name, timeString, timeStamp) VALUES (%s,%s,%s,%s)', (thread_id, thread_name, timeString, timeStamp))
	post_db.commit()


	
def getIdFromNameList(thread_name):
	hash_table_name = 'hash_table'
	db.execute("SELECT * FROM " + hash_table_name + " WHERE thread_name = '%s'" % thread_name)
	thread_name_matches = db.fetchall()

	thread_id_matches = list()
	for x in thread_name_matches:
		thread_id_matches.append(x[0])

	return thread_id_matches

# search hash table 
def getNameFromIdList(thread_id):
	hash_table_name = 'hash_table'
	db.execute("SELECT * FROM " + hash_table_name + " WHERE thread_id = '%s'" % thread_id)
	thread_id_matches = db.fetchall()

	thread_name_matches = list()
	# returns the table_key of the first match
	for x in thread_id_matches:
		thread_name_matches.append(x[1])
	return thread_name_matches


def getNameFromId(thread_id):
	x = getNameFromIdList(thread_id)
	if len(x) > 0:
		return x[0]
	else: 
		return None


def getIdFromName(thread_name):
	x =  getIdFromNameList(thread_name)
	if len(x) > 0:
		return x[0]
	else:
		return None


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


def getPosts(thread_id, tradeFilter = None, playFilter = None, chillFilter = None):
	
	empty_list = list()
	if getNameFromId(thread_id) == None:
		return empty_list

	hash_table_name = 'hash_table'
	if tradeFilter == None:
		tradeFilter = False
	if playFilter == None:
		playFilter = False
	if chillFilter == None:
		chillFilter = False



	sql_code = "SELECT * FROM " + thread_id

	if tradeFilter or playFilter or chillFilter:
		sql_code = sql_code + " WHERE "
	if tradeFilter:
		sql_code = sql_code + "isTrade = 1 "
		if playFilter:
			sql_code = sql_code + "OR isPlay = 1 "
			if chillFilter:
				sql_code = sql_code + "OR isChill = 1"
	elif playFilter:
		sql_code = sql_code + "isPlay = 1 "
		if chillFilter:
			sql_code = sql_code + "OR isChill = 1 "
	elif chillFilter:
		sql_code = sql_code + "isChill = 1 "

	db.execute(sql_code)	
	# db.execute("SELECT * FROM " + thread_id)

	posts = db.fetchall()
	postDict = postListToDict(posts)
	return postDict


# def getAllPosts(tradeFilter = None, playFilter = None, chillFilter = None):
# 	db.execute("SELECT name FROM sqlite_master WHERE type='table';")
# 	all_list = list()
# 	for table in db.fetchall():
# 		this_table_posts = getPosts(table[0], tradeFilter = tradeFilter, playFilter = playFilter, chillFilter = chillFilter)
# 		for post in this_table_posts:
# 			all_list.append(post)

# 	return all_list



def postListToDict(posts):
	postList = list()
	for post in posts:
		thisPost = {}
		thisPost['body'] = post[0]
		thisPost['poster_id'] = post[1]
		thisPost['thread_id'] = post[2]
		thisPost['timeString'] = post[3]
		thisPost['timeStamp'] = post[4]
		thisPost['isTrade'] = post[5]
		thisPost['isPlay'] = post[6]
		thisPost['isChill'] = post[7]
		thisPost['comment_id'] = post[8]
		postList.append(thisPost)
	return postList	

def searchPosts(postDict, s = None, poster_id = None, isComment = None):

	removeList = list()
	if s != None:
		for post in postDict:
			if post['body'].find(s) == -1:
				removeList.append(post)
		for post in removeList:
			postDict.remove(post)

	removeList = list()
	if poster_id != None:
		for post in postDict:
			if post['poster_id'] != poster_id:
				removeList.append(post)
		for post in removeList:
			postDict.remove(post)





	
	return postDict
		
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
	thread_name = "SCG_Baltimore"
	
	createThread(thread_name)

	thread_id = getIdFromName(thread_name)
	testUsers = ['A', 'B', 'C', 'D', 'E', 'F', 'G']


	for n in range(0,test_size):

		body = id_generator()

		user_index = random.randint (0,6)
		
		isTrade = (random.randint(0,1) == 1)
		isPlay = (random.randint(0,1) == 1)
		isChill = (random.randint(0,1) == 1)
		postInThread(thread_id, body, testUsers[user_index], isTrade, isPlay, isChill)


	
	# all_posts = getPosts(thread_id)

	# for post in all_posts:
	# 	print(post['poster_id'] + " -> " + post['body'] + " : " + 
	# 		str(post['isTrade']) + ", " + str(post['isPlay']) + ", " + str(post['isChill']))

	s = "A"
	userID = "B"

	# search_posts = searchPosts(all_posts, s, userID)


	# for post in search_posts:
	# 	print(post['poster_id'] + " -> " + post['body'] + " : " + 
	# 		str(post['isTrade']) + ", " + str(post['isPlay']) + ", " + str(post['isChill']))


def makeTestList(start, size):
	test_list = list()
	x = start
	for n in range(0, size):
		test_list.append(x)
		x = 2 * x
	return test_list

test_sizes = makeTestList(800, 1)
print(test_sizes)
times = list()
for x in test_sizes:
	time_0 = time.time()
	test(x)
	time_1 = time.time()
	total_time = time_1 - time_0
	times.append(total_time)
	print("size " + str(x) + " took " + str(total_time))
	sys.stdout.flush()

for i in range(0,len(test_sizes)):
	print("size " + str(test_sizes[i]) + " took " + str(times[i]))






