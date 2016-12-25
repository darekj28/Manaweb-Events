import urllib
import pytz
import os
from posts import Posts
from users import Users

user_manager = Users()
post_manager = Posts()


user_list = user_manager.getUserList()




userID = 'darekj'
feed_name = "BALT"



for user in user_list:
	print(user_manager.getUserInfoTable()[user])





user_manager.closeConnection()
post_manager.closeConnection()
