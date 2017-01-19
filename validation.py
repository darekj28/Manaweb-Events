# this python file is intended to contain the string validators for names, phone numbers, email, usernames etc
# output from each will be a dicitonary with at least key 'result' which will either be 'failure' or 'success'
# if an error will detail the error 

from users import Users
import re
from passlib.hash import argon2

banned_username_words = ['admin', 'manaweb']


def validateLogin(login_id, password):
	user_manager = Users()
	output = user_manager.verifyLogin(login_id, password)
	user_manager.closeConnection()
	return output

def validateName(name):
	length = len(name)
	output = {}
	output['result'] = 'success'


	# invalidate if the name is 0 letters
	if length == 0:
		output['result'] =  'failure'
		output['error'] = 'Names cannot be empty'


	# we invalidate a name if it contains non letters
	elif not name.isalpha():
		output['result'] =  'failure'
		output['error'] = 'Names can only be letters'

	
	# invalidate if more than 12 letters
	elif length > 19:
		output['result'] =  'failure'
		output['error'] = 'Names must be less than 20 letters'
	return output

def validatePhoneNumber(phone_number):
	output = {}
	output['result']  = 'success'
	isSuccess = True
	raw_phone_number = ""
	for char in phone_number:
		if char.isdigit():
			raw_phone_number = raw_phone_number + char
		else:
			isSuccess = False
	if len(raw_phone_number) == 10:
		if raw_phone_number[0] == "1" or raw_phone_number[3] == "1":
			isSuccess = False
		if raw_phone_number[1] == "1" and raw_phone_number[2] == "1":
			isSuccess = False
	elif len(raw_phone_number) == 11:
		if raw_phone_number[0] != "1":
			isSuccess = False
		if raw_phone_number[1] == "1" or raw_phone_number[4] == "1":
			isSuccess = False
		if raw_phone_number[3] == "1" and raw_phone_number[3] == "1":
			isSuccess = False
	elif len(raw_phone_number) != 10 and len(raw_phone_number) != 11:
		isSuccess = False

	if isSuccess == False:
		output['result'] = 'failure'
		output['error'] = 'Invalid phone number.'

	user_manager = Users()
	this_user = user_manager.getInfoFromPhoneNumber(raw_phone_number)
	user_manager.closeConnection()
	if this_user != None:
		output['result'] = 'failure'
		output['error'] = 'This phone number is already registered.'
	return output


def validateEmailOrPhone(input_string):
	# first check if it's a phone number 
	if '@' in input_string:
		output = validateEmail(input_string)
		output['method'] = 'email'
	else:
		output = validatePhoneNumber(input_string)
		output['method'] = "phone_number"

	return output

def validatePassword(password, password_confirm):
	output = {}
	output['result'] = 'success'
	length = len(password)
	# passwords must match to accept
	if password != password_confirm:
		output['result'] = 'failure'
		output['error'] = 'Passwords do not match'

	# commented out for now since for testing it's annoying
	# if the length is less than 10 reject
	# elif length < 10:
	# 	output['result'] = 'failure'
	# 	output['error'] = 'Passwords must be at least 10 characters'
	
	# if there are no uppercase characters we reject
	elif password.lower() == password:
		output['result'] = 'failure'
		output['error'] = 'Passwords must contain at least one uppercase character'
	else:
		digitCheck = False
		for char in password:
			if char.isdigit():
				digitCheck = True
		if digitCheck == False:
			output['result'] = 'failure'
			output['error'] = 'Passwords must contain at least one digit'
	return output

def validateEmail(email):
	output = {}
	output['result']  = 'success'

	email_regex = re.compile("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
	isMatch = email_regex.match(email)
	if not isMatch:
		output['result'] = 'failure'
		output['error'] = 'Invalid email address.'

	user_manager = Users()
	isEmailTaken = user_manager.isEmailTaken(email)
	user_manager.closeConnection()
	if isEmailTaken:
		output['result'] = 'failure'
		output['error'] = 'This email is already in use.'
	return output

def validateUsername(username):
	output = {}
	output['result']  = 'success'
	length = len(username)
	if length < 2:
		output['result'] = 'failure'
		output['error'] = 'Username must be at least 2 characters.'
	if length > 15:
		output['result'] = 'failure'
		output['error'] = 'Username cannot be 15 or more characters.'
	for char in username:
		if not char.isalnum() and char != '_':
			output['result'] = 'failure'
			output['error'] = 'Username can only have alphanumeric characters or underscores.'

	hasAlpha = False
	for char in username:
		if char.isalpha():
			hasAlpha = True

	if hasAlpha == False:
		output['result'] = 'failure'
		output['error'] = "Username must have at least 1 alphabetical character"

	lower_username = username.lower()
	for word in banned_username_words:
		if lower_username.find(word) != -1:
			output['result'] = 'failure'
			output['error'] = "Inappropriate."
	user_manager = Users()
	isUsernameTaken = user_manager.isUsernameTaken(username.lower())
	user_manager.closeConnection()
	if isUsernameTaken:
		output['result'] = 'failure'
		output['error'] = 'This username is already in use.'
	return output

def isSuccess(output_dict):
	if output_dict['result'] == 'success':
		return True
	else:
		return False

