from flask import Blueprint, jsonify, request, session, render_template, redirect, url_for, Response
from users import Users
from posts import Posts
import time
import email_confirm
import sms
import validation

# from tasks import asyncGetPosts
# from tasks import test




mobile_api = Blueprint('mobile_api', __name__)
DEFAULT_FEED = "BALT"



@mobile_api.route('/mobileCreateProfile', methods = ['POST'])
def mobileCreateProfile():
	
	first_name = request.json['first_name'].title()
	last_name = request.json['last_name'].title()
	userID = request.json['username']
	password = request.json['password']
	email = request.json['email']
	phone_number = request.json['phone_number']
	# birthDay = request.json['birth_day']
	# birthMonth = request.json['birth_month']
	# birthYear = request.json['birth_year']
	# gender = request.json.get('gender')
	birthYear = "1994"
	birthDay = "1"
	birthMonth = "1"
	gender = "Other"
	avatar_name = "Jace"
	avatar_url = '/static/avatars/' + avatar_name + '.png'
	
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

	return jsonify({'result' : 'success'})
	# return jsonify({'response': "success!" })

	# post_manager = Posts()
	# post_manager.addUserToLastSeenTables(userID)
	# post_manager.closeConnection()

@mobile_api.route('/mobileLogin', methods =['POST'])
def mobileLogin():
	login_id = request.json['login_id']
	password = request.json['password']
	validator_output = validation.validateLogin(login_id, password)
	return jsonify(validator_output)



@mobile_api.route('/mobileTextConfirmation', methods = ['POST'])
def mobileTextConfirmation():
	phone_number = request.json['phone_number']
	confirmationPin = sms.sendTextConfirmationPin(phone_number)
	return jsonify({'confirmationPin' : confirmationPin})


@mobile_api.route('/mobileNameValidation', methods = ['POST'])
def mobileNameValidation():
	name = request.json['name']
	validator_output = validation.validateName(name)
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

@mobile_api.route('/mobileGetCurrentUserInfo', methods = ['POST'])
def getCurrentUserInfo():
	thisUserID = request.json['userID']
	user_manager = Users()
	thisUser = user_manager.getInfo(thisUserID)
	user_manager.closeConnection()
	return jsonify({'thisUser' : thisUser})

@mobile_api.route('/mobileGetPosts', methods = ['POST'])
def mobileGetPosts():
	# feed_name = request.form['feed_name']
	feed_name = "BALT"
	post_manager = Posts()
	post_list = post_manager.getPosts(feed_name)
	post_manager.sortAscending(post_list)
	post_manager.closeConnection()
	return jsonify({'result' : 'success', 'post_list' : post_list})


@mobile_api.route('/status/<task_id>')
def taskStatus(task_id):
    task = test.AsyncResult(task_id)
    if task.state == 'PENDING':
        # job did not start yet
        response = {
            'state': task.state,
            'status': 'Pending...'
        }
    elif task.state != 'FAILURE':
        response = {
            'state': task.state,
            'current': task.info.get('answer', 0),
        }
        if 'result' in task.info:
            response['result'] = task.info['result']
    else:
        # something went wrong in the background job
        response = {
            'state': task.state,
            'current': 1,
            'total': 1,
            'status': str(task.info),  # this is the exception raised
        }
    return jsonify(response)



