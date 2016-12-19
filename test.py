import urllib
import pytz
import os
from posts import Posts
from users import Users

user_manager = Users()
post_manager = Posts()


user_list = user_manager.getUserList()


feed_name_list = post_manager.getFeedNames()

for feed_name in feed_name_list:
	post_manager.deleteTable(feed_name + "_seen_posts")
	post_manager.createSeenPostsTable(feed_name)

for userID in user_list:
	post_manager.addUserToLastSeenTable(userID)

post_manager.addUserToLastSeenTable("briank")

user_manager.closeConnection()
post_manager.closeConnection()
