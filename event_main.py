from flask import Flask, render_template, request, url_for, redirect, session, flash, jsonify, send_from_directory
from flask_wtf import Form
from werkzeug import secure_filename
from wtforms import StringField, PasswordField, TextField, SelectField, SelectMultipleField
from wtforms.validators import DataRequired



# from py2neo import authenticate, Graph, Node, Relationship


# used for the date.today() in calculating age
from datetime import date

# used for time stamps 
import time
import datetime
import pytz
from pytz import timezone


import smtplib
import shutil
import os
import urllib
import json
from contextlib import closing
import random


import requests
import sqlite3

import sys
import re

from users import Users
from posts import Posts


from routes.createProfile import create_profile
from routes.settings import original_settings
from routes.updateSettings import update_settings
from routes.mobile_api import mobile_api
from routes.browser_api import browser_api

# Darek Made .py files
# import geo
# import email_confirm
# import zipcode
# import msg
# import lgs_info

# must first authenticate into our datebase 
# uses authenticate("URL", "username", "Password")
# then inialzie graph
		
# authenticate("localhost:7474", "neo4j", "powerplay")
# graph = Graph()






# initialize app
app = Flask(__name__)

# NOTE !!!!  this should definitely be randomly generated and look like some crazy impossible to guess hash
# but for now we'll keep is simple and easy to remember
app.secret_key = "powerplay"



app.register_blueprint(create_profile)
app.register_blueprint(original_settings)
app.register_blueprint(update_settings)
app.register_blueprint(mobile_api)
app.register_blueprint(browser_api)


# geolocation stuff
FREEGEOPIP_URL = "http://freegeoip.net/json"
# FORMATS = ['commander', 'cube', 'draft', 'legacy', 'modern', 'pauper', 'sealed' , 'standard', 
# 'two_headed_giant',  'vintage']
# UPDATABLE_FIELDS = ['firstName', 'lastName', 'password', 'birthMonth', 'birthDay',
				# 'birthYear','genderPreference','minAge','maxAge', 'bio']

EMPTY_STRING = ""


@app.before_request
def before_request():
	if request.method == 'GET':	
		if (request.endpoint == 'clearAdmin'):
			clearAdmin()	
		if (session.get('isAdmin') == None):
			if (request.endpoint != 'adminLogin'):
				return render_template('adminLogin.html')


		if (request.endpoint == 'reset'):
			return render_template('reset.html')
		
		# checks if it is a request for something in the static folder
		elif (request.endpoint != None):
			isStatic = False
			urlString = request.endpoint.split('/')[0]
			if (urlString != 'static'):
				if ('logged_in' not in session):
					if request.endpoint != 'create_profile.createProfile':
						return render_template('login.html')
				if (not session.get('logged_in')):
					if request.endpoint != 'create_profile.createProfile':
						return render_template('login.html')

				# first make sure someone is logged in
				if (session.get('userID') != None):
					thisUser = getUserInfo(session['userID'])
					if (thisUser != None) :
						# then check if their account was deactivated
						if (request.endpoint != 'reactivateAccount'):
							if (thisUser.get('active') == False):
								return redirect(url_for('reactivateAccount'))

						# now check if their account has been confirmed
						if thisUser['confirmed'] == False:
							if request.endpoint.split('/')[0] == 'logout':
								return logout()
							if request.endpoint.split('/')[0] != 'confirmation':
								return render_template('confirmation.html')




@app.route('/adminLogin', methods = ['GET', 'POST'])
def adminLogin():
	if request.method == 'GET':
		return render_template('adminLogin.html')
	elif request.method == 'POST':
		if (request.form['userName'] == 'admin' and request.form['password'] == 'powerplay'):
			session['isAdmin'] = True
			return redirect(url_for('index'))
		else:
			return "<h1> Nice try! </h1>"

@app.route("/", methods = ['GET'])
def index():
	if request.method == 'GET':
		thisUser = getUserInfo(session['userID'])
		# this is currently hard coded
		post_manager = Posts()

		# sets the default to BALT if empty
		feed_name = request.args.get("feed")

		if feed_name == None:
			feed_name = "BALT"
		
		feed_name = feed_name.upper()

		if not post_manager.isFeed(feed_name):
			return redirect(url_for('index'))
		
		
		post_manager.createThread(feed_name = feed_name)
		postList = post_manager.getPosts(feed_name, tradeFilter = thisUser['tradeFilter'], playFilter = thisUser['playFilter'] , chillFilter = thisUser['chillFilter'])

		commentDict = {}
		for item in postList:
			x = post_manager.getComments(feed_name, item['comment_id'])
			post_manager.sortAscending(x)
			commentDict[item['comment_id']] = x

		post_manager.sortDescending(postList)
		post_manager.closeConnection()
		return render_template("index.html", thisUser = thisUser, postList = postList, commentDict = commentDict, feed_name = feed_name)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")

@app.route("/comment", methods = ['GET'])
def comment():
	if request.method == 'GET':
		
		post_manager = Posts()
		feed_name = request.args.get("feed")

		if feed_name == None:
			feed_name = "BALT"

		feed_name = feed_name.upper()

		if not post_manager.isFeed(feed_name):
			return redirect(url_for('index'))

		thisUser = getUserInfo(session['userID'])
		comment_id = request.args.get('id')
		if comment_id == None:
			return redirect(url_for('index'))
		

		isRealPost = post_manager.getPostById(feed_name, comment_id)
		if isRealPost == None:
			return redirect(url_for('index'))

		# comment_list = post_manager.getComments(feed_name, comment_id)
		post_manager.closeConnection()

		return render_template('index.html', thisUser = thisUser)



@app.route("/adminTools", methods = ['GET'])
def adminTools():
	thisUser = getUserInfo(session['userID'])
	if thisUser['isAdmin']:
		return render_template("adminTools.html")
	else:
		redirect (url_for("index"))


def getStringSearchUrl(s):
	url = url_for('search') + '?s=' + s
	return url

def getIdUrl(poster_id):
	url = url_for('search') + '?id=' + poster_id
	return url




@app.route('/logout')
def logout():
	session.pop("logged_in", None)
	session.pop('first_name', None)
	session.pop('userID', None)
	return redirect(url_for('index'))

@app.route('/login', methods = ['GET', 'POST'])
def login():
	if request.method == 'GET':
		return render_template("index.html")

	elif request.method == 'POST':
		# if the username is not in the database return an error

		userID = request.form['login_id']
		thisUser = getUserInfo(userID)
		# checks if the userID exists
		if thisUser is None:
			
			# if not, then check if the user tried to login with email
			email = request.form['login_id']
			user_manager = Users()
			thisUser = user_manager.getInfoFromEmail(email)
			user_manager.closeConnection()

			if thisUser is None:
				error = "Login ID does not exist. Please try again."
				return render_template("login.html", error = error)

			# try logging in with email
			elif thisUser['password'] != request.form['password']:
				error = "Invalid password. Please try again."
				return render_template("login.html", error = error)
			else:
				session['logged_in'] = True
				session['first_name'] = thisUser['first_name']
				session['userID'] = thisUser['userID']
				return redirect(url_for("index"))

		# try logging in with userID
		elif thisUser['password'] != request.form['password']:
				error = "Invalid password. Please try again."
				return render_template("login.html", error = error)		

		# otherwise log in the user successfully
		else:
			session['logged_in'] = True
			session['first_name'] = thisUser['first_name']
			session['userID'] = thisUser['userID']
			return redirect(url_for("index"))

	else:
		return "<h2> Invalid request </h2>"



@app.route('/confirmation', methods = ['GET'])
@app.route('/confirmation/<pin>', methods = ['GET'])
def confirmation(pin = None):
	if (session.get('userID') is None):
		return redirect(url_for('login'))

	else:
		thisUser = getUserInfo(session['userID])'])
		if thisUser is None:
			return logout()
		elif thisUser['confirmed'] == True:
			return redirect(url_for('index'))
		elif pin is None:
			return render_template('confirmation.html')
		else:
			if (pin == thisUser['confirmationPin']):
				user_manager = Users()
				user_manager.updateInfo(session['userID'], 'confirmed', True)
				user_manager = closeConnection()
				return redirect(url_for('index'))
			else:
				return render_template('confirmation.html')





@app.route('/reset', methods = ['GET', 'POST'])
def reset():
	if request.method == 'GET':
		return render_template("reset.html")
	elif request.method == 'POST':
		userName = request.form['userName']
		password = request.form['password']
		# if the password is correct then clear the graph
		if password == "resetserver":
			## clear the database

			## clear all the photos 
			# fileDir = './static/img'
			# fileList = os.listdir(fileDir)
			# for fileName in fileList:
			# 	if os.path.isdir(fileDir + '/' + fileName):
			# 		shutil.rmtree(fileDir + '/' + fileName)
			
			post_manager = Posts()
			post_manager.resetDatabase()
			post_manager.closeConnection()
			user_manager = Users()
			user_manager.resetDatabase()
			user_manager.closeConnection()
			logout()
			makeTestAccounts()


			return "<h1> Database successfully cleared  </h1> <a href = '/'> Click this to return home </a>"	

		else: 
			return "<h1> Nice try! </h1>"
	else:
		return "<h2> Something's gone wrong! </h2>"	
		

# validate account returns true if account is confirmed, activated and exists
def isActiveUser(userID):
	user = getUserInfo(userID)
	if user == None:
		return False
	if user['confirmed'] != True:
		return False
	if user['isActive'] != True:
		return False
	return True

# file that makes new accounts 
def makeTestAccounts():
	first_name = ['Darek', 'Eli', 'Brian', 'Luis', 'Paul', 'Mashi', 'Yuuya', 'Shouta', 'Gabby', 'Kenny']
	last_name = ['Johnson', 'Chang', 'Kibler', 'Scott-Vargas', 'Cheon','Scanlan', 'Watanabe', 'Yasooka', 'Spartz', 'Wong']
	userID = ['darekj', 'elic', 'briank', 'luisv', 'paulc', 'mashis', 'yuuyaw', 'shoutay', 'gabbys', 'kennyw']
	gender = ['Male','Male','Male','Male','Male','Male','Male','Male', 'Female', 'Male']
	birthYear = ['1994', '1994', '1984', '1882', '1986', '1984', '1990', '1990', '1990', '1994']
	birthMonth = ['8','3','2','10', '9', '5', '11', '12', '2', '3']
	birthDay = ['28','13','11','18','29','8','4',' 10','28', '14']
	password = ['pass1','pass1','pass1','pass1','pass1','pass1','pass1', 'pass1', 'pass1', 'pass1']
	home_zip = ['19131', '19131', '19131', '19131', '19131', '19131', '19131', '19131', '19131', '19131']





	bio = ['I am currently an assistant trader at Susquehanna International Group. My favorite formats are standard and sealed and my favorite color combination is UR. In 2006 I got got 4th place at Minnesota state championships playing Dragonstorm',
	'Hi, I\'m Eli! I am a casual cello player, so sometimes my friends like to call me Celli! I just started playing Magic recently and I\'m looking forward to playing a lot!',
	'I\'m Brian, but also known as the \'Dragon Master\'. My favorite decks are green aggro decks',
	'I was fortuante enough to be inducted into the Pro Tour hall of fame, allowing me to pursue my dream of posting new content for young Magic players',
	'My name is, Paul Cheon, or HAUMPH if you like. I love UB control, and looking to top 8 my first PT.',
	'I\'m Mashi, a GP judge and co host of Channel Fireball\'s Magic TV. I love Magic and my favorite card is Pillage (unfortunately too powerful for modern of standard',
	'My name is Yuuya Watanabe. I won the world championship in 2012 playing Jund. Last year I was inducted into the hall of fame and I am very proud. Still looking to win my first Pro Tour though!',
	'My name is Shouta Yasooka, although some people just call me \'The Master\'. I always surprise the crowd with my \'crazy\' decks that I bring to tournaments, and sometimes it works out :)',
	'I\'m one of the few female casters for Magic the Gathering. I love to play too!',
	'MANGO MANGO MANGO MANGO'
	]
	password = "pass1"
	isActive = True
	phone_number = "555-555-5555"

	

	for i in range(0,9):
		email = userID[i] + '@gmail.com'
		confirmationPin = 'confirmationPin'

		avatar_url = './static/avatars/gideon.png'
		slash_splits = avatar_url.split('/')
		avatar_name = slash_splits[len(slash_splits)-1].split('.')[0]

		isAdmin = False
		if userID[i] == 'darekj':
			isAdmin = True

		user_manager = Users()
		user_manager.addUser(userID[i], first_name = first_name[i], last_name = last_name[i], password = password, email = email,  isActive = isActive,
			avatar_url = avatar_url, avatar_name = avatar_name, confirmationPin = confirmationPin, tradeFilter = None, playFilter = None, chillFilter = None,
			isAdmin = isAdmin, phone_number = phone_number, birthMonth = birthMonth[i], birthDay = birthDay[i], birthYear = birthYear[i],
			gender = gender[i]) 
		user_manager.closeConnection()



		userFileDir = './static/img/' + userID[i]
		# if directory exists, clear it
		if os.path.isdir(userFileDir):
			fileList = os.listdir(userFileDir)
			for fileName in fileList:
				os.remove(userFileDir + "/" + fileName)		
		# otherwise create e new one	
		else: 
			os.mkdir(userFileDir)

		


	feed_name = "BALT"
	post_manager = Posts()
	post_manager.initializeSQL()
	post_manager.initializeFeed(feed_name)
	post_manager.closeConnection()

@app.route('/makeProfile', methods = ['POST'])
def makeProfile():
	userID = request.json['userID']
	first_name = request.json['first_name']
	last_name = request.json['last_name']
	email = request.json['email']
	password = request.json['password']
	
	# these are defaults for now
	avatar_url = './static/avatars/gideon.png'
	slash_splits = avatar_url.split('/')
	avatar_name = slash_splits[len(slash_splits)-1].split('.')[0]
	phone_number = "555-555-5555"
	birthMonth = '5'
	birthYear =  '1995'
	birthDay = '5'
	gender = 'Male'

	user_manager = Users()
	user_manager.addUser(userID[i], first_name = first_name, last_name = last_name, password = password, email = email,  isActive = True,
			avatar_url = avatar_url, avatar_name = avatar_name, confirmationPin = confirmationPin, tradeFilter = None, playFilter = None, chillFilter = None,
			isAdmin = False, phone_number = phone_number, birthMonth = birthMonth, birthDay = birthDay, birthYear = birthYear,
			gender = gender) 
	user_manager.closeConnection()


# given a user, returns their age
# might need ot adjust for timezones later
def getAge(userID):
	user = getUserInfo(userID)
	birthYear = int(user['birthYear'])
	birthMonth = int(user['birthMonth'])
	birthDay = int(user['birthDay'])

	today = date.today()
	return today.year - birthYear - ((today.month, today.day) < (birthMonth, birthDay))


def getUserInfo(user_id):
	user_manager = Users()
	this_user = user_manager.getInfo(user_id)
	user_manager.closeConnection()
	return this_user

def getFirstName(user_id):
	user_manager = Users()
	first_name =  user_manager.getInfo(user_id)['first_name']
	user_manager.closeConnection()
	return first_name

def getLastName(user_id):
	user_manager = Users()
	last_name =  user_manager.getInfo(user_id)['last_name']
	user_manager.closeConnection()
	return last_name


def getAvatarUrl(user_id):
	user_manager = Users()
	avatar_url =  user_manager.getInfo(user_id)['avatar_url']
	user_manager.closeConnection()
	return avatar_url

def date_format(time=False):
	post_manager = Posts()
	data_format = post_manager.date_format(time = False)
	post_manager.closeConnection()



app.jinja_env.globals.update(getAge=getAge)
app.jinja_env.globals.update(getIdUrl=getIdUrl)

app.jinja_env.globals.update(getStringSearchUrl=getStringSearchUrl)
app.jinja_env.globals.update(getFirstName=getFirstName)
app.jinja_env.globals.update(getLastName=getLastName)
app.jinja_env.globals.update(getAvatarUrl=getAvatarUrl)



if __name__ == '__main__':
    app.debug = True
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
