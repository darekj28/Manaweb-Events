import urllib
import pytz
import os
from posts import Posts
from users import Users

user_manager = Users()
post_manager = Posts()


user_list = user_manager.getUserList()


post_manager.deleteTable("seen_posts_table")
post_manager.createSeenPostsTable()
for userID in user_list:
	post_manager.addUserToLastSeenTable(userID)


user_manager.closeConnection()
post_manager.closeConnection()
