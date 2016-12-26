# this python file is intended to contain the string validators for names, phone numbers, email, usernames etc
# output from each will be a dicitonary with at least key 'result' which will either be 'failure' or 'success'
# if an error will detail the error 

from users import Users
import re

banned_username_words = ['admin', 'manaweb']


def validateLogin(login_id, password):
	email_regex = re.compile("^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
	loginIdIsEmail = email_regex.match(login_id)
	user_manager = Users()
	# if the login id is an email
	if loginIdIsEmail:
		user_info = user_manager.getInfoFromEmail(login_id)
	
	# otherwise the login is a userID
	else:
		user_info = user_manager.getInfo(login_id)

	user_manager.closeConnection()
	
	# user doesn't exists
	if user_info == None:
		output['result'] = 'failure'
		output['error'] = "This login id doesn't exists"

	elif user_info['password'] != password:
		ouput['result'] = 'failure'
		ouput['error'] = 'login credentials incorrect'


	else:
		output['result'] = 'success'
		output['username'] = user_info['userID']

	return output


def validateName(name):
	length = len(name)
	
	output = {}
	output['result'] = 'success'
	# we invalidate a name if it contains non letters
	if not name.isalpha():
		output['result'] =  'failure'
		output['error'] = 'Names can only be letters'

	# invalidate if the name is 0 letters
	elif length == 0:
		output['result'] =  'failure'
		output['error'] = 'Names cannot be empty'

	# invalidate if more than 12 letters
	elif length > 19:
		output['result'] =  'failure'
		output['error'] = 'Names must be less than 20 letters'
	return output

def validatePhoneNumber(phone_number):
	output = {}
	output['result']  = 'success'
	if len(phone_number) != 10:
		output['result'] = 'failure'
		output['error'] = "phone number invalid legnth"

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
		output['error'] = 'invalid email address'

	user_manager = Users()
	isEmailTaken = user_manager.isEmailTaken(email)
	user_manager.closeConnection()
	if isEmailTaken:
		output['result'] = 'failure'
		output['error'] = 'This email is already in use'

	return output

def validateUsername(username):
	output = {}
	output['result']  = 'success'


	length = len(username)
	if length < 2:
		output['result'] = 'failure'
		output['error'] = 'Username must be at least 2 characters'

	if length > 15:
		output['result'] = 'faulure'
		output['error'] = 'Username cannot be 15 or more characters'

	for char in username:
		if not char.isalnum() and char != '_':
			output['result'] = 'failure'
			output['error'] = 'Username can only have alphanumeric and underscores'

	lower_username = username.lower()
	for word in banned_username_words:
		if lower_username.find(word) != -1:
			output['result'] = 'failure'
			output['error'] = word + " cannot be part of a username"

	user_manager = Users()
	isUsernameTaken = user_manager.isUsernameTaken(username.lower())
	user_manager.closeConnection()
	if isUsernameTaken:
		output['result'] = 'failure'
		output['error'] = 'This username is already in use'

	return output

def isSuccess(output_dict):
	if output_dict['result'] == 'success':
		return True
	else:
		return False

