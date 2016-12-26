import sqlite3

# used for time stamps 
import time
import datetime
import pytz
from pytz import timezone

import hashlib

import string
import random
import os
import sys


import psycopg2
import urllib


			
	

class Users:
	# automatically opens the connection
	def __init__(self):
		self.properties = ['userID', 'first_name', 'password', 'email', 'isActive', 'avatar_url', 'avatar_name', 'confirmationPin', 'tradeFilter', 'playFilter', 'chillFilter',
					'isAdmin', 'phone_number', 'birthMonth', 'birthDay', 'birthYear', 'gender', 'confirmed']

		# add test_prexi = "test_" to each for testing 					
		self.USER_TABLE = "user_info"
		self.USER_ACTION_TABLE = "user_actions" 
		self.TEST_USER_TABLE = "test_user_info"

		# this is for when we load to heroku
		# comment this out when testing locally
		urllib.parse.uses_netloc.append("postgres")
		os.environ["DATABASE_URL"] = "postgres://spkgochzoicojm:y0MABz523D1H-zMqeZVvplCuC2@ec2-54-163-252-55.compute-1.amazonaws.com:5432/d15b0teu2kkhek"

		url = urllib.parse.urlparse(os.environ["DATABASE_URL"])
		self.user_db =  psycopg2.connect(
		    database=url.path[1:],
		    user=url.username,
		    password=url.password,
		    host=url.hostname,
		    port=url.port
		)
		self.udb = self.user_db.cursor()


	def closeConnection(self):
		self.udb.close()
		self.user_db.close()


	def getTimeString(self):
		return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

	# initializes user info table
	def createUserInfoTable(self):
		table_name = self.USER_TABLE
		createTableCode = 'CREATE TABLE IF NOT EXISTS ' + table_name + ' (userID TEXT, first_name TEXT, last_name TEXT, password TEXT, email TEXT,  \
				isActive BOOLEAN, avatar_url TEXT, avatar_name TEXT, confirmationPin TEXT, playFilter BOOLEAN, \
				 tradeFilter BOOLEAN, chillFilter BOOLEAN, isAdmin BOOLEAN, phone_number TEXT, birthMonth TEXT, birthDay TEXT, birthYear TEXT, gender TEXT, confirmed BOOLEAN, timeString TEXT, timeStamp FLOAT )'
		self.udb.execute(createTableCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS userID ON ' + table_name + ' (userID)'
		self.udb.execute(addIndexCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS email ON ' + table_name + ' (email)'
		self.udb.execute(addIndexCode)

		action_table_name = self.USER_ACTION_TABLE
		createActionTableCode = 'CREATE TABLE IF NOT EXISTS ' + action_table_name + ' (userID TEXT, first_name TEXT, last_name TEXT, password TEXT, email TEXT,  \
				isActive BOOLEAN, avatar_url TEXT, avatar_name TEXT, confirmationPin TEXT, playFilter BOOLEAN, \
				 tradeFilter BOOLEAN, chillFilter BOOLEAN, isAdmin BOOLEAN, phone_number TEXT, birthMonth TEXT, birthDay TEXT, birthYear TEXT, gender TEXT, confirmed BOOLEAN, timeString TEXT, timeStamp FLOAT, action TEXT)'
		self.udb.execute(createActionTableCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS userID ON ' + action_table_name + ' (userID)'
		self.udb.execute(addIndexCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS email ON ' + action_table_name + ' (email)'
		self.udb.execute(addIndexCode)

	# resets db
	def resetDatabase(self):

		self.deleteTable(self.USER_TABLE)
		self.deleteTable(self.USER_ACTION_TABLE)

		self.createUserInfoTable()


	def deleteTable(self, table_name):	
		deleteTableCode = "DROP TABLE IF EXISTS " + table_name
		self.udb.execute(deleteTableCode)


	def addUser(self, userID, first_name, last_name, password, email, isActive, avatar_url,
				 avatar_name, confirmationPin, tradeFilter = None, playFilter = None, chillFilter = None,
				  isAdmin = None, phone_number = None, birthMonth = None
				 ,birthDay = None, birthYear = None, gender = None, confirmed = None):
		
		table_name = self.USER_TABLE

		if isAdmin == None:
			isAdmin = False

		if tradeFilter == None:
			tradeFilter = False
		if chillFilter == None:
			chillFilter = False
		if playFilter == None:
			playFilter = False

		if phone_number == None:
			phone_number = ""
		if birthDay == None:
			birthDay = ""
		if birthMonth == None:
			birthMonth = ""
		if birthYear == None:
			birthYear = ""
		if gender == None:
			gender = ""

		# default to true can switch later
		if confirmed == None:
			confirmed = True


		timeStamp = time.time()
		timeString = self.getTimeString()


		input_properties = {}
		input_properties['userID'] = userID
		input_properties['first_name'] = first_name
		input_properties['last_name'] = last_name
		input_properties['password'] = password
		input_properties['email'] = email
		input_properties['isActive'] = isActive
		input_properties['avatar_url'] = avatar_url
		input_properties['avatar_name'] = avatar_name
		input_properties['confirmationPin'] = confirmationPin
		input_properties['tradeFilter'] = tradeFilter
		input_properties['playFilter'] = playFilter
		input_properties['chillFilter'] = chillFilter
		input_properties['isAdmin'] = isAdmin
		input_properties['phone_number'] = phone_number
		input_properties['birthMonth'] = birthMonth
		input_properties['birthDay'] = birthDay
		input_properties['birthYear'] = birthYear
		input_properties['gender'] = gender
		input_properties['confirmed'] = confirmed


		# if user email or userID doesn't exist create new one
		if self.getInfo(userID) == None and self.getInfoFromEmail(email) == None:
			self.udb.execute(self.udb.mogrify("INSERT INTO " + table_name + " (userID, first_name, last_name, password, email, isActive, avatar_url,\
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp) \
				  VALUES (%s,%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
				(userID.lower(), first_name, last_name, password, email, isActive, avatar_url,
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp)))

			action = "ACCOUNT CREATED"
			self.udb.execute(self.udb.mogrify("INSERT INTO " + "user_actions" + " (userID, first_name, last_name, password, email, isActive, avatar_url,\
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp, action) \
				  VALUES (%s,%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
				(userID.lower(), first_name, last_name, password, email, isActive, avatar_url,
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp, action)))

		# otherwise simply update information
		else: 
			for prop in self.properties:
				if prop != 'userID':
					self.updateInfo(userID, prop, input_properties[prop])

			self.updateInfo(userID, 'timeString', timeString)
			self.updateInfo(userID, 'timeStamp', timeStamp)

			action = "ACCOUNT SETTINGS CHANGED"
			update_code = self.udb.mogrify("INSERT INTO " + "user_actions" + " (userID, first_name, last_name, password, email, isActive, avatar_url,\
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp, action) \
				  VALUES (%s,%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
				(userID.lower(), first_name, last_name, password, email, isActive, avatar_url,
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp, action))
			self.udb.execute(update_code)

		self.user_db.commit()

	def addTestUser(self, userID, first_name, last_name, password, email, isActive, avatar_url,
				 avatar_name, confirmationPin, tradeFilter = None, playFilter = None, chillFilter = None,
				  isAdmin = None, phone_number = None, birthMonth = None
				 ,birthDay = None, birthYear = None, gender = None, confirmed = None):
		
		table_name = self.TEST_USER_TABLE

		if isAdmin == None:
			isAdmin = False

		if tradeFilter == None:
			tradeFilter = False
		if chillFilter == None:
			chillFilter = False
		if playFilter == None:
			playFilter = False

		if phone_number == None:
			phone_number = ""
		if birthDay == None:
			birthDay = ""
		if birthMonth == None:
			birthMonth = ""
		if birthYear == None:
			birthYear = ""
		if gender == None:
			gender = ""

		# default to true can switch later
		if confirmed == None:
			confirmed = True


		timeStamp = time.time()
		timeString = self.getTimeString()


		input_properties = {}
		input_properties['userID'] = userID
		input_properties['first_name'] = first_name
		input_properties['last_name'] = last_name
		input_properties['password'] = password
		input_properties['email'] = email
		input_properties['isActive'] = isActive
		input_properties['avatar_url'] = avatar_url
		input_properties['avatar_name'] = avatar_name
		input_properties['confirmationPin'] = confirmationPin
		input_properties['tradeFilter'] = tradeFilter
		input_properties['playFilter'] = playFilter
		input_properties['chillFilter'] = chillFilter
		input_properties['isAdmin'] = isAdmin
		input_properties['phone_number'] = phone_number
		input_properties['birthMonth'] = birthMonth
		input_properties['birthDay'] = birthDay
		input_properties['birthYear'] = birthYear
		input_properties['gender'] = gender
		input_properties['confirmed'] = confirmed


		# if user email or userID doesn't exist create new one
		if self.getInfo(userID) == None and self.getInfoFromEmail(email) == None:
			self.udb.execute(self.udb.mogrify("INSERT INTO " + table_name + " (userID, first_name, last_name, password, email, isActive, avatar_url,\
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp) \
				  VALUES (%s,%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
				(userID.lower(), first_name, last_name, password, email, isActive, avatar_url,
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp)))

			action = "ACCOUNT CREATED"
			self.udb.execute(self.udb.mogrify("INSERT INTO " + "test_user_actions" + " (userID, first_name, last_name, password, email, isActive, avatar_url,\
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp, action) \
				  VALUES (%s,%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
				(userID.lower(), first_name, last_name, password, email, isActive, avatar_url,
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp, action)))

		# otherwise simply update information
		else: 
			for prop in self.properties:
				if prop != 'userID':
					self.updateInfo(userID, prop, input_properties[prop])

			self.updateInfo(userID, 'timeString', timeString)
			self.updateInfo(userID, 'timeStamp', timeStamp)

			action = "ACCOUNT SETTINGS CHANGED"
			update_code = self.udb.mogrify("INSERT INTO " + "test_user_actions" + " (userID, first_name, last_name, password, email, isActive, avatar_url,\
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp, action) \
				  VALUES (%s,%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
				(userID.lower(), first_name, last_name, password, email, isActive, avatar_url,
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp, action))
			self.udb.execute(update_code)

		self.user_db.commit()

		
	def updateInfo(self, userID, field_name, field_data):
		table_name  = self.USER_TABLE
		self.udb.execute(self.udb.mogrify("UPDATE " + table_name  + " SET " + field_name + " = %s WHERE userID = '" + userID + "'", (field_data,)))
		action = "ACCOUNT " + field_name + " UPDATED"
		timeStamp = time.time()
		timeString = self.getTimeString()

		if field_name.lower() != 'timestring' and field_name.lower() != 'userid' and field_name.lower() != 'timestamp':
			self.udb.execute(self.udb.mogrify("INSERT INTO " + self.USER_ACTION_TABLE + " (userID, " + field_name + ", timeString, timeStamp, action) VALUES (%s, %s, %s, %s, %s)", (userID.lower(), field_data, timeString, timeStamp, action)))
		self.user_db.commit()


	def getInfo(self, userID):
		search_id = userID.lower()
		table_name = self.USER_TABLE
		self.udb.execute(self.udb.mogrify("SELECT * FROM " + table_name + " WHERE userID = %s", (search_id,)))
		size_test = self.udb.fetchall()
		if len(size_test) == 0:
			return None
		query = size_test[0]
		return self.queryToDict(query)

	def getUserInfoTable(self):
		table_name = self.USER_TABLE
		output_table = {}
		users_list = self.getUserList()
		for user in users_list:
			this_user_info = self.getInfo(user)
			output_table[user] = this_user_info
		return output_table

	def deleteUser(self, userID):
		table_name = self.USER_TABLE
		udb.execute("DELETE FROM " + table_name + " WHERE userID = %s", (userID,))
		action = "USER " + userID + " DELETED"
		timeStamp = time.time()
		timeString = self.getTimeString()
		self.udb.execute(self.udb.mogrify("INSERT INTO " + self.USER_ACTION_TABLE + " (userID, timeString, timeStamp, action) VALUES (%s, %s, %s, %s)", (userID, timeString, timeStamp, action)))

		self.user_db.commit()


	# returns a list of all users
	def getUserList(self):
		sql = "SELECT userID FROM " + self.USER_TABLE
		self.udb.execute(sql)
		query = self.udb.fetchall()
		user_list = list()
		for user in query:
			user_list.append(user[0])
		return user_list


	def queryToDict(self, query):
		user_info = {}
		user_info['userID'] = query[0]
		user_info['first_name'] = query[1]
		user_info['last_name'] = query[2]
		user_info['password'] = query[3]
		user_info['email'] = query[4]
		user_info['isActive'] = query[5]
		user_info['avatar_url'] = query[6]
		user_info['avatar_name'] = query[7]
		user_info['confirmationPin'] = query[8]
		user_info['playFilter'] = query[9]
		user_info['tradeFilter'] = query[10]
		user_info['chillFilter'] = query[11]
		user_info['isAdmin'] = query[12]
		user_info['phone_number'] = query[13]
		user_info['birthMonth'] = query[14]
		user_info['birthDay'] = query[15]
		user_info['birthYear'] = query[16]
		user_info['gender'] = query[17]
		user_info['confirmed'] = query[18]
		user_info['timeString'] = query[19]
		user_info['timeStamp'] = query[20]
		return user_info

	def getInfoFromEmail(self, email):
		table_name = self.USER_TABLE
		self.udb.execute("SELECT * FROM " + table_name + " WHERE email = %s", (email,))
		size_test = self.udb.fetchall()
		if len(size_test) == 0:
			return None	
		query = size_test[0]
		return self.queryToDict(query)

	def isEmailTaken(self, email):
		email_user = self.getInfoFromEmail(email)
		if email_user == None:
			return False
		else:
			return True

	def isUsernameTaken(self, username):
		user = self.getInfo(username)
		if user == None:
			return False
		else:
			return True


	def usernameInUser(self, username):






def test():

	first_name = ['Darek', 'Eli', 'Brian', 'Luis', 'Paul', 'Mashi', 'Yuuya', 'Shouta', 'Gabby']
	last_name = ['Johnson', 'Chang', 'Kibler', 'Scott-Vargas', 'Cheon','Scanlan', 'Watanabe', 'Yasooka', 'Spartz']
	userID = ['darekj', 'elic', 'briank', 'luisv', 'paulc', 'mashis', 'yuuyaw', 'shoutay', 'gabbys']
	gender = ['Male','Male','Male','Male','Male','Male','Male','Male', 'Female']
	birthYear = ['1994', '1994', '1984', '1882', '1986', '1984', '1990', '1990', '1990']
	birthMonth = ['8','3','2','10', '9', '5', '11', '12', '2']
	birthDay = ['28','13','11','18','29','8','4',' 10','28']
	password = ['pass1','pass1','pass1','pass1','pass1','pass1','pass1', 'pass1', 'pass1']
	home_zip = ['19131', '19131', '19131', '19131', '19131', '19131', '19131', '19131', '19131']
	minAge = [10,10,10,10,10,10,10,10,10]
	maxAge = [100,100,100,100,100,100,100,100,100]
	desired_zip = ['19131', '19131', '19131', '19131', '19131', '19131', '19131', '19131', '19131']
	genderPreference = ['BOTH','BOTH','BOTH','BOTH','BOTH','BOTH','BOTH','BOTH', 'BOTH']
	maxDistance = [20,20,20,20,20,20,20,20,20]
	bio = ['I am currently an assistant trader at Susquehanna International Group. My favorite formats are standard and sealed and my favorite color combination is UR. In 2006 I got got 4th place at Minnesota state championships playing Dragonstorm',
	'Hi, I\'m Eli! I am a casual cello player, so sometimes my friends like to call me Celli! I just started playing Magic recently and I\'m looking forward to playing a lot!',
	'I\'m Brian, but also known as the \'Dragon Master\'. My favorite decks are green aggro decks',
	'I was fortuante enough to be inducted into the Pro Tour hall of fame, allowing me to pursue my dream of posting new content for young Magic players',
	'My name is, Paul Cheon, or HAUMPH if you like. I love UB control, and looking to top 8 my first PT.',
	'I\'m Mashi, a GP judge and co host of Channel Fireball\'s Magic TV. I love Magic and my favorite card is Pillage (unfortunately too powerful for modern of standard',
	'My name is Yuuya Watanabe. I won the world championship in 2012 playing Jund. Last year I was inducted into the hall of fame and I am very proud. Still looking to win my first Pro Tour though!',
	'My name is Shouta Yasooka, although some people just call me \'The Master\'. I always surprise the crowd with my \'crazy\' decks that I bring to tournaments, and sometimes it works out :)',
	'I\'m one of the few female casters for Magic the Gathering. I love to play too!'
	]
	password = "pass1"
	isActive = True
	phone_number = "555-555-5555"

	user_manager = Users()
	user_manager.resetDatabase()



	for i in range(0,9):
		email = userID[i] + '@gmail.com'
		confirmationPin = 'confirmationPin'

		avatar_url = './static/avatars/gideon.png'
		slash_splits = avatar_url.split('/')
		avatar_name = slash_splits[len(slash_splits)-1].split('.')[0]

		isAdmin = False
		if userID[i] == 'darekj' or userID[i] == 'elic':
			isAdmin = True

		user_manager.addUser(userID[i], first_name = first_name[i], last_name = last_name[i], password = password, email = email,  isActive = isActive,
			avatar_url = avatar_url, avatar_name = avatar_name, confirmationPin = confirmationPin, tradeFilter = None, playFilter = None, chillFilter = None,
			isAdmin = isAdmin, phone_number = phone_number, birthMonth = birthMonth[i], birthDay = birthDay[i], birthYear = birthYear[i],
			gender = gender[i]) 
		
	


		
	# for user in userID:
	# 	print(user_manager.getInfo(user))

	feed_name = "BALT"

	user_manager.updateInfo('darekj', 'last_name', 'jeter')
	user_manager.updateInfo('darekj', 'chillFilter', True)

	print(user_manager.getInfo('mrt'))
	user_manager.closeConnection()
	
# test()




