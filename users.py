



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

urllib.parse.uses_netloc.append("postgres")
url = urllib.parse.urlparse(os.environ["DATABASE_URL"])

user_db =  psycopg2.connect(
    database=url.path[1:],
    user=url.username,
    password=url.password,
    host=url.hostname,
    port=url.port
)

udb = user_db.cursor()


# initializes user info table
def createUserInfoTable():
	table_name = "user_info"
	createTableCode = 'CREATE TABLE IF NOT EXISTS ' + table_name + ' (userID TEXT, first_name TEXT, last_name TEXT, password TEXT, email TEXT,  \
			isActive BOOLEAN, avatar_url TEXT, avatar_name TEXT, confirmationPin TEXT, playFilter BOOLEAN, \
			 tradeFilter BOOLEAN, chillFilter BOOLEAN, isAdmin BOOLEAN, phone_number TEXT, birthMonth TEXT, birthDay TEXT, birthYear TEXT, gender TEXT, confirmed BOOLEAN)'
	udb.execute(createTableCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS userID ON ' + table_name + ' (userID)'
	udb.execute(addIndexCode)
	addIndexCode = 'CREATE INDEX IF NOT EXISTS email ON ' + table_name + ' (email)'
	udb.execute(addIndexCode)


# resets db
def resetDatabase():
	
	udb.execute("DROP SCHEMA PUBLIC CASCADE; CREATE SCHEMA PUBLIC;")


	createUserInfoTable()


def deleteTable(table_name):	
	deleteTableCode = "DROP TABLE IF EXISTS " + table_name
	udb.execute(deleteTableCode)





def addUser(userID, first_name, last_name, password, email, isActive, avatar_url,
			 avatar_name, confirmationPin, tradeFilter = None, playFilter = None, chillFilter = None,
			  isAdmin = None, phone_number = None, birthMonth = None
			 ,birthDay = None, birthYear = None, gender = None, confirmed = None):
	table_name = "user_info"

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



	udb.execute("INSERT INTO " + table_name + " (userID, first_name, last_name, password, email, isActive, avatar_url,\
			 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isAdmin, phone_number, birthMonth, birthDay, birthYear, gender, confirmed) \
			  VALUES (%s,%s,%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
			(userID.lower(), first_name, last_name, password, email, isActive, avatar_url,
			 avatar_name, confirmationPin, playFilter, tradeFilter, chillFilter, isActive, phone_number, birthMonth, birthDay, birthYear, gender, confirmed))

	user_db.commit()

	
def updateInfo(userID, field_name, field_data):
	table_name  = "user_info"

	print(update_code)
	udb.execute("UPDATE " + table_name  + " SET " + field_name + " = %s WHERE userID = '" + userID + "'", (field_data,))
	user_db.commit()


def getInfo(userID):
	search_id = userID.lower()
	table_name = "user_info"
	udb.execute("SELECT * FROM " + table_name + " WHERE userID = %s", (search_id,))
	size_test = udb.fetchall()
	if len(size_test) == 0:
		return None
	query = size_test[0]
	return queryToDict(query)

def deleteUser(userID):
	table_name = "user_info"
	udb.execute("DELETE FROM " + table_name + " WHERE userID = %s", (userID,))
	user_db.commit()


def queryToDict(query):
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
	return user_info

def getInfoFromEmail(email):
	table_name = "user_info"
	udb.execute("SELECT * FROM " + table_name + " WHERE email = %s", (email,))
	size_test = udb.fetchall()
	if len(size_test) == 0:
		return None	
	query = size_test[0]
	return queryToDict(query)

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

	resetDatabase()

	for i in range(0,9):
		email = userID[i] + '@gmail.com'
		confirmationPin = 'confirmationPin'

		avatar_url = './static/avatars/gideon.png'
		slash_splits = avatar_url.split('/')
		avatar_name = slash_splits[len(slash_splits)-1].split('.')[0]


		addUser(userID[i], first_name = first_name[i], last_name = last_name[i], password = password, email = email,  isActive = isActive,
			avatar_url = avatar_url, avatar_name = avatar_name, confirmationPin = confirmationPin, tradeFilter = None, playFilter = None, chillFilter = None,
			isAdmin = False, phone_number = phone_number, birthMonth = birthMonth[i], birthDay = birthDay[i], birthYear = birthYear[i],
			gender = gender[i]) 
		



		# userFileDir = './static/img/' + userID[i]
		# # if directory exists, clear it
		# if os.path.isdir(userFileDir):
		# 	fileList = os.listdir(userFileDir)
		# 	for fileName in fileList:
		# 		os.remove(userFileDir + "/" + fileName)		
		# # otherwise create e new one	
		# else: 
		# 	os.mkdir(userFileDir)

		
	# for user in userID:
	# 	print(getInfo(user))

	# feed_name = "BALT"

	# updateInfo('darekj', 'last_name', 'jeter')
	# updateInfo('darekj', 'chillFilter', True)

	# print(getInfo('mrt'))
	
test()




