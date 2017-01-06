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


print(validation.validateEmailOrPhone("darekj@gmail.com"))
print(validation.validateEmailOrPhone("michaelyang@princeton.edu"))
print(validation.validateEmailOrPhone("1234567890"))
print(validation.validateEmailOrPhone("123-456-7890"))
print(validation.validateEmailOrPhone("+1(123) 456- 7890"))
print(validation.validateEmailOrPhone("+1(223) 456- 7890"))
print(validation.validateEmailOrPhone("+1   (612) 456- 7890"))



# post_manager.deleteUserPosts('lily')
# user_manager.deleteUser('lily')
# security_manager.createRecovery()
# post_manager.deleteNotifications()
# for fb_user in fb_users:
# 	post_manager.deleteUserPosts(fb_user)
# 	user_manager.deleteUser(fb_user)
# feed_name = "BALT"
# post_manager.recalculateLastPostTable(feed_name)
# post_manager.recalculateUnseenPosts(feed_name)


user_manager.closeConnection()
post_manager.closeConnection()
security_manager.closeConnection()