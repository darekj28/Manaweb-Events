import urllib
import pytz
import os
from posts import Posts
from users import Users
from security import Security
from tasks import test
import sqlite3 
import validation

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
security_manager = Security()
# user_manager.deleteUser('drd')

# fb_users = user_manager.getFacebookUsers()
# user_list = user_manager.getUserList()



# post_manager.deleteUserPosts('brovogre')
user_manager.deleteUser('brobro')
# security_manager.createRecovery()
# post_manager.deleteNotifications()
# print(user_manager.getInfoFromEmail('Darekj@bro.bro'))

feed_name = "BALT"
# post_manager.recalculateLastPostTable(feed_name)
# post_manager.recalculateUnseenPosts(feed_name)
# post_manager.deleteUserPosts("mongomongomongo")
# user_manager.deleteUser("bro1234")

	# post_manager.deleteColumn(table_name, "pushNotificationSent")
	# post_manager.addColumn(table_name, "pushNotificationSent", "BOOLEAN", True)





# for fb_user in fb_users:
# 	post_manager.deleteUserPosts(fb_user)
# 	user_manager.deleteUser(fb_user)



user_manager.closeConnection()
post_manager.closeConnection()
security_manager.closeConnection()