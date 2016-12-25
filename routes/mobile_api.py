from flask import Blueprint, jsonify, request, session, render_template, redirect, url_for, Response
from users import Users
from posts import Posts
import time
import email_confirm
import sms
import validation
# from py2neo import authenticate, Graph, Node
# authenticate("localhost:7474", "neo4j", "powerplay")
# graph = Graph()

mobile_api = Blueprint('mobile_api', __name__)
DEFAULT_FEED = "BALT"


@mobile_api.route('/mobileCreateProfile', methods = ['POST'])
def mobileCreateProfile():
	
	first_name = request.json['first_name'].title()
	last_name = request.json['last_name'].title()
	userID = request.json['userID']
	password = request.json['password']
	email = request.json['email']
	birthDay = request.json['birth_day']
	birthMonth = request.json['birth_month']
	birthYear = request.json['birth_year']
	gender = request.json.get('gender')


	# avatar_url = request.form['avatar'][1:]

	# if int(birthYear) > 2004:
	# 	return jsonify({'response': "too young for you bro..."})



	avatar_name = request.json.get('avatar')
	avatar_url = "directory:/" + avatar_name

	# phone_number = request.form['phone_number']
	phone_number = "555-555-5555"
	isActive = True
	confirmationPin = email_confirm.hashUserID(userID)
	# confirmed = False

	confirmed = True		
	user_manager = Users()
	user_manager.addTestUser(userID, first_name = first_name, last_name = last_name, password = password, email = email,  isActive = isActive,
		avatar_url = avatar_url, avatar_name = avatar_name, confirmationPin = confirmationPin, tradeFilter = None, playFilter = None, chillFilter = None,
		isAdmin = False, phone_number = phone_number, birthMonth = birthMonth, birthDay = birthDay, birthYear = birthYear,
		gender = gender) 

	user_manager.closeConnection()

	return jsonify({'response' : 'account made baby!'})
	# return jsonify({'response': "success!" })

	# post_manager = Posts()
	# post_manager.addUserToLastSeenTables(userID)
	# post_manager.closeConnection()



@mobile_api.route('/mobileTextConfirmation', methods = ['POST'])
def mobileTextConfirmation():
	phone_number = reqeust.json['phone_number']
	confirmationPin = sms.sendTextConfirmationPin(phone_number)
	return jsonify({'confirmationPin' : confirmationPin})


@mobile_api.route('/mobileNameValidation', methods = ['POST'])
def mobileNameValidation():
	first_name = request.json['first_name']
	last_name = request.json['last_name']
	validator_output = validation.validateFullName(first_name, last_name)
	return jsonify(validator_output)

@mobile_api.route('/mobilePhoneNumberValidation', methods = ['POST'])
def mobilePhoneNumberValidation():
	phone_number = request.json['phone_number']
	validator_output = validation.validatePhoneNumber(phone_number)
	return jsonify(validator_output)

@mobile_api.route('/mobilePasswordValidation', methods = ['POST'])
def mobilePasswordValidation():
	password = request.json['password']
	password_confirm = request.json['password_confirm']
	validator_output = validation.validatePassword(password, password_confirm)
	return jsonify(validator_output)

@mobile_api.route('/mobileEmailValidation', methods = ['POST'])
def mobileEmailValidation():
	email = request.json['email']
	validator_output = validation.validateEmail(email)
	return jsonify(validator_output)

@mobile_api.route('/mobileUsernameValidation', methods =['POST'])
def mobileUsernameValidation():
	username = request.json['username']
	validator_output = validation.validateUsername(username)
	return jsonify(validator_output)


@mobile_api.route('/testMobileApi', methods = ['POST'])
def testMobileApi():
	data = {'output' : request.json.get('test')}
	return jsonify(data)


