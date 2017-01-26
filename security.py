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
from passlib.hash import argon2
import requests
import re
from users import Users
	

class Security:
	# automatically opens the connection
	def __init__(self):				
		self.USER_TABLE = "user_info"
		self.LOGIN_ATTEMPT_TABLE = "login_attempt_table"
		self.RECOVERY_HISTORY_TABLE = "recovery_history_table"
		self.FREEGEOPIP_URL = "http://freegeoip.net/json"
		self.INVALID_LOGIN_ATTEMPT_TABLE = "invalid_login_attempt_table"
		urllib.parse.uses_netloc.append("postgres")
		os.environ["DATABASE_URL"] = "postgres://spkgochzoicojm:y0MABz523D1H-zMqeZVvplCuC2@ec2-54-163-252-55.compute-1.amazonaws.com:5432/d15b0teu2kkhek"
		url = urllib.parse.urlparse(os.environ["DATABASE_URL"])
		self.security_db =  psycopg2.connect(
		    database=url.path[1:],
		    user=url.username,
		    password=url.password,
		    host=url.hostname,
		    port=url.port
		)
		self.security_db.autocommit = True
		self.db = self.security_db.cursor()

	def closeConnection(self):
		self.db.close()
		self.security_db.close()

	def getTimeString(self):
		return datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

	def createLoginAttemptTable(self):
		sql = "CREATE TABLE IF NOT EXISTS " + self.LOGIN_ATTEMPT_TABLE + " (login_id TEXT, isSuccessLogin BOOLEAN, ip TEXT, country_code TEXT, \
		city TEXT, region_code TEXT, zip_code TEXT, timeString TEXT, timeStamp FLOAT, fb_login BOOLEAN)"
		self.db.execute(self.db.mogrify(sql))
		addIndexCode = 'CREATE INDEX IF NOT EXISTS login_id ON ' + self.LOGIN_ATTEMPT_TABLE + ' (login_id)'
		self.db.execute(addIndexCode)

	def recordLoginAttempt(self, login_id, isSuccess, ip, fb_login):
		timeStamp = time.time()
		timeString = self.getTimeString()
		location_info = self.get_geolocation_for_ip(ip)
		country_code = location_info['country_code']
		city = location_info['city']
		region_code = location_info['region_code']
		zip_code = location_info['zip_code']
		sql = "INSERT INTO " + self.LOGIN_ATTEMPT_TABLE + " (login_id, isSuccessLogin, ip, country_code, city, region_code, \
		zip_code, timeString, timeStamp, fb_login) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
		self.db.execute(self.db.mogrify(sql, (login_id, isSuccess, ip, country_code, city, region_code,
		zip_code, timeString, timeStamp, fb_login)))

	# if the login_id matches to a user, this will record their login attempt
	def createInvalidLoginAttemptTable(self):
		sql  = "CREATE TABLE IF NOT EXISTS " + self.INVALID_LOGIN_ATTEMPT_TABLE + " (login_id TEXT, userID TEXT,\
		count INTEGER, timeString TEXT, timeStamp FLOAT, isLocked BOOLEAN)"
		self.db.execute(self.db.mogrify(sql))
		addIndexCode = 'CREATE INDEX IF NOT EXISTS login_id ON ' + self.INVALID_LOGIN_ATTEMPT_TABLE + ' (login_id)'
		self.db.execute(addIndexCode)
		addIndexCode = 'CREATE INDEX IF NOT EXISTS userID ON ' + self.INVALID_LOGIN_ATTEMPT_TABLE + ' (userID)'
		self.db.execute(addIndexCode)

	def recordInvalidLoginAttempt(self, login_id, userID, isSuccess, fb_login = None):
		self.createInvalidLoginAttemptTable()
		if fb_login == None:
			fb_login = False
		timeStamp = time.time()
		timeString = self.getTimeString()
		# add the user into the table if they do not exist
		sql = "SELECT * FROM " + self.INVALID_LOGIN_ATTEMPT_TABLE + " WHERE userID = %s"
		self.db.execute(self.db.mogrify(sql, (userID,)))
		query = self.db.fetchall()
		# if the user does not exist in the table, insert them
		if len(query) == 0:
			isLocked = False
			sql = "INSERT INTO " + self.INVALID_LOGIN_ATTEMPT_TABLE + " (login_id, userID, count, timeString, \
			 timeStamp, isLocked) VALUES (%s, %s,%s,%s,%s,%s)"
			if (isSuccess):
				count = 0
			else:
				count = 1
			self.db.execute(self.db.mogrify(sql, (login_id, userID, count, timeString, timeStamp, isLocked)))
		# in this case, the user is already in the table
		else:
			old_count = query[0][2]
			isLocked = False
			if (isSuccess):
				new_count = 0
			else:
				new_count = old_count + 1
			if new_count >= 10:
				isLocked = True
			sql = "UPDATE " + self.INVALID_LOGIN_ATTEMPT_TABLE + " SET count = %s, timeString = %s, timeStamp = %s, isLocked = %s WHERE userID = %s"
			self.db.execute(self.db.mogrify(sql, (new_count, timeStamp, timeStamp, isLocked, userID)))

	def getInvalidLoginAttempts(self, login_id):
		user_manager = Users()
		if '@' in login_id:
			user_info = user_manager.getInfoFromEmail(login_id)
		else:
			user_info = user_manager.getInfo(login_id)
		if user_info != None:
			userID = user_info['userID']
			sql = "SELECT * FROM " + self.INVALID_LOGIN_ATTEMPT_TABLE + " WHERE userID = %s"
			self.db.execute(self.db.mogrify(sql, (userID,)))
			query = self.db.fetchall()
			return query[0][2]

	def isUserLocked(self, login_id):
		user_manager = Users()
		if '@' in login_id:
			user_info = user_manager.getInfoFromEmail(login_id)
		else:
			user_info = user_manager.getInfo(login_id)
		user_manager.closeConnection()
		if user_info != None:
			userID = user_info['userID']
			sql = "SELECT * FROM " + self.INVALID_LOGIN_ATTEMPT_TABLE + " WHERE userID = %s"
			self.db.execute(self.db.mogrify(sql, (userID,)))
			query = self.db.fetchall()
			if len(query) == 0:
				isLocked = False
				sql = "INSERT INTO " + self.INVALID_LOGIN_ATTEMPT_TABLE + " (login_id, userID, count,\
				isLocked) VALUES (%s, %s,%s, %s)"
				count = 0
				self.db.execute(self.db.mogrify(sql, (login_id, userID, count, isLocked)))
			return query[0][5]
		else:
			return False

	def unlockAccount(self, userID):
		sql = "UPDATE " + self.INVALID_LOGIN_ATTEMPT_TABLE + " SET isLocked = %s WHERE userID = %s"
		self.db.execute(self.db.mogrify(sql, (False, userID)))

	# given an ip address returns their json file with the following parameters
	# ip, country_code, country_name, region_code, region_name, city, zipcode, lataitude, longitude, metro_code, area_code
	"""
	SAMPLE_RESPONSE = {
	    "ip":"108.46.131.77",
	    "country_code":"US",
	    "country_name":"United States",
	    "region_code":"NY",
	    "region_name":"New York",
	    "city":"Brooklyn",
	    "zip_code":"11249",
	    "time_zone":"America/New_York",
	    "latitude":40.645,
	    "longitude":-73.945,
	    "metro_code":501
	}
	"""
	def get_geolocation_for_ip(self, ip):
		url = '{}/{}'.format(self.FREEGEOPIP_URL, ip)
		response = requests.get(url)
		response.raise_for_status()
		return response.json()


	def recoverAccount(self, recovery_input):
		# if email
		# recoverAccountWithEmail(recovery_input)
		# first check if it is an email
		email_regex = re.compile("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
		loginIdIsEmail = email_regex.match(recovery_input)
		if loginIdIsEmail:
			output = self.recoverAccountWithEmail(recovery_input)
			return output
		# if recovery_input has an alphabetical character then it cannot be a phone number
		hasAlpha = False
		for char in recovery_input:
			if char.isalpha():
				hasAlpha = True
		if hasAlpha:
			output = self.recoverAccountWithUsername(recovery_input)
			return output
		# otherwise we check the phone numbers
		else:
			raw_phone_number = self.formatRawPhoneNumber(recovery_input)
			output = self.recoverAccountWithText(recovery_input)
			return output

	def recoverAccountWithEmail(self, email):
		email = email.lower()
		user_manager = Users()
		this_user = user_manager.getInfoFromEmail(email)
		user_manager.closeConnection()
		output = {}
		if this_user == None:
			output['result'] = 'failure'
			output['error'] = 'This email is not registered with any user'
		else:
			output['result'] = 'success'
			output['username'] = this_user['userID']
			output['email'] = email
			output['phone_number'] = self.formatPhoneNumberWithDashes(this_user['phone_number'])
			output['method'] = 'email'
		return output

	def recoverAccountWithText(self, phone_number):
		user_manager = Users()
		formatted_phone_number = self.formatPhoneNumberWithDashes(phone_number)
		this_user = user_manager.getInfoFromPhoneNumber(formatted_phone_number)
		user_manager.closeConnection()
		output = {}
		if this_user == None:
			output['result'] = 'failure'
			output['error'] = 'This phone number is not registered with any user'
		else:
			output['result'] = 'success'
			output['username'] = this_user['userID']
			output['email'] = this_user['email']
			output['phone_number'] = self.formatPhoneNumberWithDashes(phone_number)
			output['method'] = 'phone_number'
		return output

	# this is to be used if they forgot their email or username
	def recoverAccountWithUsername(self, username):
		username = username.lower()
		user_manager = Users()
		this_user = user_manager.getInfo(username)
		user_manager.closeConnection()
		output = {}
		if this_user == None:
			output['result'] = 'failure'
			output['error'] = 'Username does not exists'
		else:
			output['result'] = 'success'
			output['username'] = username
			output['email'] = this_user['email']
			output['phone_number'] = self.formatPhoneNumberWithDashes(this_user['phone_number'])
			output['method'] = 'username'
		return output

	def createRecoveryHistoryTable(self):
		sql = "CREATE TABLE IF NOT EXISTS " + self.RECOVERY_HISTORY_TABLE + " (recovery_input TEXT, recovery_method TEXT, isValudInput BOOLEAN, ip TEXT \
		country_code TEXT, city TEXT, region_code TEXT, zip_code TEXT, timeString TEXT, timeStamp FLOAT)"
		self.db.execute(self.db.mogrify(sql))
		addIndexCode = 'CREATE INDEX IF NOT EXISTS login_id ON ' + self.LOGIN_ATTEMPT_TABLE + ' (recovery_input)'
		self.db.execute(addIndexCode)

	# this method will run after the general recoverAccount method
	# recovery method is one of email, username, or text
	def recordRecoveryAttempt(self, recovery_input, recovery_method, ip):
		timeStamp = time.time()
		timeString = self.getTimeString()
		location_info = self.get_geolocation_for_ip(ip)
		country_code = location_info['country_code']
		city = location_info['city']
		region_code = location_info['region_code']
		zip_code = location_info['zip_code']
		sql = "INSERT INTO " + self.LOGIN_ATTEMPT_TABLE + " (recovery_input, recovery_method, isValidInput, ip, country_code, \
		city, region_code zip_code, timeString, timeStamp) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
		self.db.execute(self.db.mogrify(sql, (recovery_input, recovery_method, isValidInput, ip, country_code, city, region_code,
		zip_code, timeString, timeStamp)))

	# input : any string with 10 digits 
	# output: (123) 456-7890
	def formatPhoneNumberWithDashes(self, input_phone_number):
		raw_phone_number = self.formatRawPhoneNumber(input_phone_number)
		formatted_phone_number = "(" + raw_phone_number[0:3] + ") " + raw_phone_number[3:6] + "-" + raw_phone_number[6:10]
		return formatted_phone_number

	# input : (123) 456-7890, 123-456-7890
	# output  : 1234567890
	def formatRawPhoneNumber(self, phoneNumberWithDashes):
		raw_phone_number = ""
		for char in phoneNumberWithDashes:
			if char.isdigit():
				raw_phone_number = raw_phone_number + char

		if len(raw_phone_number) == 11:
			raw_phone_number = raw_phone_number[1:]
			
		return raw_phone_number





# def test():
# 	security_manager = Security()
# 	print(security_manager.recoverAccount('darekj@gmail.com'))
# 	print(security_manager.recoverAccount('darekj'))
# 	print(security_manager.recoverAccount('555-555-5555'))
# 	security_manager.closeConnection()

# test()
