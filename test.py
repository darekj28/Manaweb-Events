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







# post_manager.createLastPostTable()
# post_manager.removeFeed(feed_name)
# post_manager.addFeedName(feed_name)
print(post_manager.getLastPost(feed_name))




user_manager.closeConnection()
post_manager.closeConnection()
