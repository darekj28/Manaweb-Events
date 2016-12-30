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
# print(user_manager.getFacebookUsers())
user_manager.deleteFacebookUsers()



user_manager.closeConnection()
post_manager.closeConnection()
