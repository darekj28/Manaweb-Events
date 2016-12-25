from flask import Blueprint, request, session, render_template
# from py2neo import authenticate, Graph, Node
import os 
import sqlite3
from users import Users


# authenticate("localhost:7474", "neo4j", "powerplay")
# graph = Graph()

original_settings = Blueprint('original_settings', __name__)
# FORMATS = ['commander', 'cube', 'draft', 'legacy', 'modern', 'pauper', 'sealed' , 'standard', 
# 'two_headed_giant',  'vintage']
EMPTY_STRING = ""

@original_settings.route('/settings', methods = ['GET', 'POST'])
def settings():
	if (request.method == 'GET'):
		avatar_url = './static/avatars'
		avatar_list = list()
		fileList = os.listdir(avatar_url)
		for fileName in fileList:
			if len(fileName.split('.')[1]) == 3:
				this_url = avatar_url + '/' + fileName
				x = (fileName.split('.')[0].title(), this_url)
				avatar_list.append(x)


		return render_template('settings.html', avatar_list = avatar_list)

	elif request.method == 'POST':
		# read the form data and save it
		first_name = request.form['firstName']
		last_name = request.form['lastName']
		
		birthDay = request.form['birthDay']
		birthMonth = request.form['birthMonth']
		birthYear = request.form['birthYear']

		gender = request.form['gender']
		password = request.form['password']


		avatar_url = request.form['avatar']
		slash_splits = avatar_url.split('/')
		avatar_name = slash_splits[len(slash_splits)-1].split('.')[0]

		user_manager = Users()


		if (first_name != EMPTY_STRING):
			user_manager.updateInfo(session['userID'], 'first_name', first_name)
		if (lastName != EMPTY_STRING):
			user_manager.updateInfo(session['userID'], 'last_name', last_name)
		if (birthDay != EMPTY_STRING):
			user_manager.updateInfo(session['userID'], 'birthDay', birthDay)
		if (birthMonth!= EMPTY_STRING):
			user_manager.updateInfo(session['userID'], 'birthMonth', birthMonth)
		if (birthYear != EMPTY_STRING):
			user_manager.updateInfo(session['userID'], 'birthYear', birthYear)
		if (gender != EMPTY_STRING):
			user_manager.updateInfo(session['userID'], 'gender', gender)
		if (password != EMPTY_STRING):
			user_manager.updateInfo(session['userID'], 'password', password)

		if (avatar_url != EMPTY_STRING):
			user_manager.updateInfo(session['userID'], 'avatar_url', avatar_url)
			user_manager.updateInfo(session['userID'], 'avatar_name', avatar_name)	

		user_manager.closeConnection()

		return render_template('settingsChanged.html')
	else: 
		return "<h2> Something's gone wrong! </h2>"