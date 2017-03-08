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

table_names = post_manager.getTableNames()
print(table_names)
print(len(table_names))
for table in table_names:
	post_manager.deleteTable(table)


user_manager.closeConnection()
post_manager.closeConnection()
security_manager.closeConnection()