import urllib
import pytz
import os
from posts import Posts
from users import Users
from security import Security
from tasks import test
import sqlite3 
import validation
import time
import random
import string




def id_generator(size=6, chars=string.ascii_uppercase + string.digits):
	return ''.join(random.choice(chars) for _ in range(size))

def createNewThread(feed_name):
	post_manager = Posts()
	post_manager.createThread(feed_name)
	post_manager.createSeenPostsTable(feed_name)
	post_manager.closeConnection()

# def deleteTestThread():

def clearThread(feed_name):
	post_manager = Posts()
	post_manager.deleteTable(feed_name)
	post_manager.createSeenPostsTable(feed_name + "_seen_posts")
	post_manager.removeFeed(feed_name)
	post_manager.closeConnection()


def makeRandomPost(feed_name):
	time_0 = time.time()
	user_manager = Users()
	user_list = user_manager.getUserList()
	isTrade = (random.randint(0,1) == 1)
	isPlay = (random.randint(0,1) == 1)
	isChill = (random.randint(0,1) == 1)
	body = id_generator()
	user_index = random.randint(0,len(user_list)-1)
	isTrade = (random.randint(0,1) == 1)
	isPlay = (random.randint(0,1) == 1)
	isChill = (random.randint(0,1) == 1)
	post_manager = Posts()
	poster_id = user_list[user_index]
	post_manager.postInThread(feed_name, body, poster_id, isTrade, isPlay, isChill, comment_id = None)
	post_manager.closeConnection()
	user_manager.closeConnection()
	time_1 = time.time()
	total_time = time_1 - time_0
	return total_time

def test_makePosts(feed_name, numPosts):
	clearThread(feed_name)
	createNewThread(feed_name)
	time_0 = time.time()
	for i in range(1,numPosts):
		this_time = makeRandomPost(feed_name)
		print("run " + str(i) + " : " + str(this_time) + " seconds")
	time_1 = time.time()
	total_time = time_1 - time_0
	return total_time

def test_getPosts(feed_name):
	time_0 = time.time()
	post_manager = Posts()
	post_list = post_manager.getPosts(feed_name)
	time_1 = time.time()
	total_time = time_1 - time_0
	print('size : ' + str(len(post_list)))
	print('get posts time : ' + str(total_time))

feed_name = "SPEEDTEST"
numPosts = 400
result = test_makePosts(feed_name, numPosts)
test_getPosts(feed_name)
print("total time to make posts : " + str(result))


