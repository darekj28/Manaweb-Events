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
import re

import psycopg2
import urllib
from passlib.hash import argon2


			
	

class Users:
	# automatically opens the connection
	def __init__(self):
		self.properties = ['userID', 'first_name', 'password', 'email', 'isActive', 'avatar_url', 'avatar_name', 'confirmationPin', 'tradeFilter', 'playFilter', 'chillFilter',
					'isAdmin', 'phone_number', 'birthMonth', 'birthDay', 'birthYear', 'gender', 'confirmed']

		# add test_prexi = "test_" to each for testing 					
		self.USER_TABLE = "user_info"
		self.USER_ACTION_TABLE = "user_actions" 
		self.TEST_USER_TABLE = "test_user_info"
		self.RECOVERY_TABLE = "recovery_table"

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
		self.user_db.autocommit = True
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
				 ,birthDay = None, birthYear = None, gender = None, confirmed = None, fb_id = None):
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
		if fb_id == None:
			fb_id = ""
		timeStamp = time.time()
		timeString = self.getTimeString()
		input_properties = {}
		input_properties['userID'] = userID
		input_properties['first_name'] = first_name
		input_properties['last_name'] = last_name
		if fb_id == "" or fb_id == None:
			hash_password = argon2.using(rounds=4).hash(password)
		else:
			hash_password = "FB_DEFAULT_PASSWORD"
		input_properties['password'] = hash_password
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
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp, fb_id) \
				  VALUES (%s,%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
				(userID.lower(), first_name, last_name, hash_password, email, isActive, avatar_url,
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp, fb_id)))
			action = "ACCOUNT CREATED"
			if (fb_id == ""):
				action = action + " WITH FACEBOOK"
			self.udb.execute(self.udb.mogrify("INSERT INTO " + "user_actions" + " (userID, first_name, last_name, password, email, isActive, avatar_url,\
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp, action) \
				  VALUES (%s,%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
				(userID.lower(), first_name, last_name, hash_password, email, isActive, avatar_url,
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp, action)))

		# otherwise simply update information
		else: 
			for prop in self.properties:
				if prop == 'password':
					hash_password = argon2.using(rounds=4).hash(password)
					self.updateInfo(userID, prop, hash_password)
				elif prop != 'userID' and prop != 'password':
					self.updateInfo(userID, prop, input_properties[prop])


			self.updateInfo(userID, 'password', hash_password)
			self.updateInfo(userID, 'timeString', timeString)
			self.updateInfo(userID, 'timeStamp', timeStamp)

			action = "ACCOUNT SETTINGS CHANGED"
			update_code = self.udb.mogrify("INSERT INTO " + "user_actions" + " (userID, first_name, last_name, password, email, isActive, avatar_url,\
				 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed, timeString, timeStamp, action) \
				  VALUES (%s,%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
				(userID.lower(), first_name, last_name, hash_password, email, isActive, avatar_url,
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
				if prop == 'password':
					hash_password = argon2.using(rounds=4).hash(password)
					self.updateInfo(userID, prop, hash_password)
				elif prop != 'userID' and prop != 'password':
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

		if field_name == 'password':
			field_data = argon2.using(rounds=4).hash(field_data)

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
		self.udb.execute("DELETE FROM " + table_name + " WHERE userID = %s", (userID,))
		action = "USER " + userID + " DELETED"
		timeStamp = time.time()
		timeString = self.getTimeString()
		self.udb.execute(self.udb.mogrify("INSERT INTO " + self.USER_ACTION_TABLE + " (userID, timeString, timeStamp, action) VALUES (%s, %s, %s, %s)", (userID, timeString, timeStamp, action)))

		
		


	# returns a list of all users
	def getUserList(self):
		sql = "SELECT userID FROM " + self.USER_TABLE
		self.udb.execute(sql)
		query = self.udb.fetchall()
		user_list = list()
		for user in query:
			userID = user[0]
			if userID != "" and userID != None:
				user_list.append(userID)
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
		user_info['fb_id'] = query[21]
		return user_info

	# input : (123) 456-7890, 123-456-7890
	# output  : 1234567890
	def formatRawPhoneNumber(self, phoneNumberWithDashes):
		raw_phone_number = ""
		for char in phoneNumberWithDashes:
			if char.isdigit():
				raw_phone_number = raw_phone_number + char
		return raw_phone_number

	def getInfoFromPhoneNumber(self, phone_number):
		user_table = self.getUserInfoTable()
		raw_phone_number = self.formatRawPhoneNumber(phone_number)

		matched_user = {}

		for user in user_table.keys():
			search_user = user_table[user]
			search_user_phone_number = self.formatRawPhoneNumber(search_user['phone_number'])
			if search_user_phone_number == raw_phone_number:
				matched_user = search_user

		if matched_user == {}:
			return None

		else:
			return matched_user

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

	def addUserInfoColumn(self, colName, colType):
		sql = "ALTER TABLE user_info ADD " + colName + " " + colType
		self.udb.execute(sql)

	def getUserInfoFromFacebookId(self, fb_id):
		sql = "SELECT * FROM user_info WHERE fb_id = %s"
		self.udb.execute(self.udb.mogrify(sql, (fb_id,)))
		query = self.udb.fetchall()

		numMatchingUsers = len(query)
		if numMatchingUsers > 0:
			return self.queryToDict(query[0])
		else:
			return None

	def getFacebookUsers(self):
		sql = "SELECT * FROM user_info"
		self.udb.execute(sql)
		query = self.udb.fetchall()
		fb_user_list = list()
		for item in query:
			userInfo = self.queryToDict(item)
			fb_id = userInfo['fb_id']
			if fb_id != "" and fb_id != None and userInfo['userID'] != "":
				fb_user_list.append(userInfo['userID'])

		return fb_user_list

	def deleteFacebookUsers(self):
		fb_users = self.getFacebookUsers()
		for user in fb_users:
			self.deleteUser(user)

	def verifyLogin(self, login_id, password):
		output = {}
		email_regex = re.compile("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
		loginIdIsEmail = email_regex.match(login_id)
		user_manager = Users()
		lower_login_id = login_id.lower()
		# if the login id is an email
		if loginIdIsEmail:
			user_info = user_manager.getInfoFromEmail(lower_login_id)
		# otherwise the login is a userID
		else:
			user_info = user_manager.getInfo(lower_login_id)
		# user doesn't exists
		if user_info == None:
			output['result'] = 'failure'
			output['error'] = "This username doesn't exist."
		else:
			user_manager.closeConnection()
			password_match = argon2.verify(password, user_info['password'])
			if password_match:
				output['result'] = 'success'
				output['username'] = user_info['userID']
			else:
				output['result'] = 'failure'
				output['error'] = 'Login credentials incorrect.'
		return output

	def isFacebookUser(self, fb_id):
		fbUser = self.getUserInfoFromFacebookId(fb_id)
		output = {}
		if fbUser == None:
			output['result'] = 'failure'
			output['userID'] = ""
		else:
			output['result'] = 'success'
			output['fbUser'] = fbUser
		return output 



	





