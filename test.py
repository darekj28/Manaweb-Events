import urllib
import pytz
import os
from posts import Posts
from users import Users
from tasks import test
import sqlite3 

from app_factory import create_app
from celery_factory import create_celery

app = create_app()
celery = create_celery(app)

# @celery.task
# def test(a,b):
# 	return a + b


# task = test.delay(4,5)
# print(task)

user_manager = Users()
post_manager = Posts()

# user_manager.deleteUser('drd')

fb_users = user_manager.getFacebookUsers()
user_list = user_manager.getUserList()



# post_manager.deleteUserPosts('lily')
# user_manager.deleteUser('lily')
# for fb_user in fb_users:
# 	post_manager.deleteUserPosts(fb_user)
# 	user_manager.deleteUser(fb_user)
# feed_name = "BALT"
# post_manager.recalculateLastPostTable(feed_name)
# post_manager.recalculateUnseenPosts(feed_name)

# post_manager.updateNotificationsTablesForNumActions('notification_table')
# try_again = False
# for userID in user_list:
# 	table_name = "n_" + userID
# 	print(table_name)
# 	if try_again == True:
# 		post_manager.updateNotificationsTablesForNumActions(table_name)
# 	if userID == "a3":
# 		try_again = True

user_manager.closeConnection()
post_manager.closeConnection()
