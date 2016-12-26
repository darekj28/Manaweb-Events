from flask import Blueprint, request, render_template, session, redirect, url_for
from py2neo import authenticate, Graph, Node, Relationship
authenticate("localhost:7474", "neo4j", "powerplay")
# graph = Graph()

import email_confirm
import geo
import os
import smtplib
import sqlite3
from users import Users
from posts import Posts

create_profile = Blueprint('create_profile', __name__)


user_db = sqlite3.connect('users/user_table.db', check_same_thread = False)
udb = user_db.cursor()

@create_profile.route('/createProfile', methods = ['GET', 'POST'])
def createProfile():
	if request.method == 'GET':
		# get list of avatar photo URLs
		avatar_url = './static/avatars'
		avatar_list = list()
		fileList = os.listdir(avatar_url)
		for fileName in fileList:
			if len(fileName.split('.')[1]) == 3:
				this_url = avatar_url + '/' + fileName
				x = (fileName.split('.')[0].title(), this_url)
				avatar_list.append(x)


		return render_template('createProfile.html', avatar_list = avatar_list)
	
	elif request.method == 'POST':
		# read the form data and save it
		first_name = request.form['first_name'].title()
		last_name = request.form['last_name'].title()
		userID = request.form['userID']
		password = request.form['password']
		email = request.form['email']
		birthDay = request.form['birthDay']
		birthMonth = request.form['birthMonth']
		birthYear = request.form['birthYear']
		gender = request.form.get('gender')

		avatar_url = request.form['avatar'][1:]
		slash_splits = avatar_url.split('/')
		avatar_name = slash_splits[len(slash_splits)-1].split('.')[0]
		phone_number = request.form['phone_number']
		isActive = True

		confirmationPin = email_confirm.hashUserID(userID)
		# confirmed = False


		confirmed = True



		
		user_manager = Users()
		user_manager.addUser(userID, first_name = first_name, last_name = last_name, password = password, email = email,  isActive = isActive,
			avatar_url = avatar_url, avatar_name = avatar_name, confirmationPin = confirmationPin, tradeFilter = None, playFilter = None, chillFilter = None,
			isAdmin = False, phone_number = phone_number, birthMonth = birthMonth, birthDay = birthDay, birthYear = birthYear,
			gender = gender) 

		user_manager.closeConnection()

		post_manager = Posts()
		post_manager.addUserToLastSeenTables(userID)
		post_manager.closeConnection()
	
		# email_confirm.sendConfirmationEmail(newUser)
		

		
		# log the user in 
		session['logged_in'] = True
		session['first_name'] = first_name
		session['userID'] = userID

		userFileDir = '/static/img/' + session['userID']
		# if directory exists, clear it
		# if os.path.isdir(userFileDir):
		# 	fileList = os.listdir(userFileDir)
		# 	for fileName in fileList:
		# 		os.remove(userFileDir + "/" + fileName)



		# # otherwise create e new one	
		# else: 
		# 	os.mkdir(userFileDir)
		
		# newUser = graph.find_one("User", "userID", session['userID'])

		return redirect(url_for('index'))
	else:
		return "<h2> Invalid submission! </h2>"

