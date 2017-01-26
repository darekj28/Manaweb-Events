from flask import Blueprint, request, render_template, session, redirect, url_for, jsonify
from py2neo import authenticate, Graph, Node, Relationship
authenticate("localhost:7474", "neo4j", "powerplay")

import email_confirm
import geo
import os
import smtplib
import sqlite3
import random
import sms
from users import Users
from posts import Posts

create_profile = Blueprint('create_profile', __name__)
user_db = sqlite3.connect('users/user_table.db', check_same_thread = False)
udb = user_db.cursor()
avatars = ["ajani", "chandra", "elspeth", "gideon", "jace", "liliana", "nahiri", "nicol", "nissa", "ugin"]
@create_profile.route('/createProfile', methods = ['POST'])
def createProfile():
	if request.method == 'POST':
		if request.json['email_or_phone'] == "email" :
			email = request.json['email']
			phone_number = ""
			confirmationPin = sms.sendConfirmationEmail(email)
		elif request.json['email_or_phone'] == "phone_number" :
			phone_number = request.json['phone_number']
			email = ""
			confirmationPin = sms.sendTextConfirmationPin(phone_number)
		# read the form data and save it
		first_name 		= request.json['first_name']
		last_name 		= request.json['last_name']
		userID 			= request.json['username']
		password 		= request.json['password']
		birthDay 		= ""
		birthMonth 		= ""
		birthYear 		= ""
		avatar_name 	= random.choice(avatars)
		avatar_url 		= '/static/avatars/' + avatar_name + '.png'	
		isActive = True	
		confirmed = False
		user_manager = Users()
		user_manager.addUser(userID, first_name = first_name, last_name = last_name, password = password, email = email,  isActive = isActive,
			avatar_url = avatar_url, avatar_name = avatar_name, confirmed=confirmed, confirmationPin = confirmationPin, tradeFilter = None, playFilter = None, chillFilter = None,
			isAdmin = False, phone_number = phone_number, birthMonth = birthMonth, birthDay = birthDay, birthYear = birthYear) 

		user_manager.closeConnection()

		post_manager = Posts()
		post_manager.addUserToLastSeenTables(userID)
		post_manager.closeConnection()
		res = {}
		res['result'] = "success"
		return jsonify(res)
	else:
		res = {}
		res['result'] = "failure"
		return jsonify(res)

