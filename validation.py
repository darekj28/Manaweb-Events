# this python file is intended to contain the string validators for names, phone numbers, email, usernames etc
# output from each will be a dicitonary with at least key 'result' which will either be 'failure' or 'success'
# if an error will detail the error 

from users import Users

def validateName(name):
	result = True
	for i in range(0, len(name)):
		if name[i].isdigit():
			result = False

	if name == "":
		result = False

	return result


def validateFullName(first_name, last_name):
	first_name_validation = validateName(first_name)
	last_name_validaiton = validateName(last_name)
	output = {}
	output['result'] = 'failure'
	if first_name_validation and last_name_validaiton:
		output['result'] = 'success'
	elif last_name_validaiton:
		output['error'] = 'first_name_invalid'
	elif first_name_validation:
		output['error'] = 'last_name_invalid'
	else:
		output['error'] = 'both_name_invalid'

	return output




def validatePhoneNumber(phone_number):
	output = {}
	output['result']  = 'success'
	return output


def validatePassword(password, password_confirm):
	output = {}
	if password != password_confirm:
		output['result'] = 'failure'
		output['error'] = 'password_mismatch'
		return output
	return 0

def validateEmail(email):
	output = {}
	output['result']  = 'success'
	return output

def validateUsername(username):
	output = {}
	output['result']  = 'success'
	return output

def isSuccess(output_dict):
	if output_dict['result'] == 'success':
		return True
	else:
		return False

