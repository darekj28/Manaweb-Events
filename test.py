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




post_manager.deleteUserPosts('brovogre')
for fb_user in fb_users:
	post_manager.deleteUserPosts(fb_user)
	user_manager.deleteUser(fb_user)



user_manager.closeConnection()
post_manager.closeConnection()
