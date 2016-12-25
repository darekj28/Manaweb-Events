from flask import Blueprint, jsonify, request, redirect, url_for, session
from users import Users

update_settings = Blueprint('update_settings', __name__) 

@update_settings.route('/getPreviousSettings', methods=['GET'])
def getPreviousSettings():
	user_manager = Users()
	thisUser = user_manager.getInfo(session['userID'])
	user_manager.closeConnection()
	return jsonify({
			'first_name' 		: thisUser['first_name'],
			'last_name' 		: thisUser['last_name'],
			'password' 			: thisUser['password'],
			'birthMonth' 		: thisUser['birthMonth'],
			'birthDay' 			: thisUser['birthDay'],
			'birthYear' 		: thisUser['birthYear'],
			'avatar_name'		: thisUser['avatar_name'],
			'avatar_url' 		: thisUser['avatar_url'],
			'phone_number'		: thisUser['phone_number']
		})

@update_settings.route('/updateSettings', methods=['POST'])
def updateSettings():
	user_manager = Users()
	thisUser = user_manager.getInfo(session['userID'])
	print('hellooooo')
	user_manager.updateInfo(session['userID'], 'first_name'	, 	request.json['first_name'])
	user_manager.updateInfo(session['userID'], 'last_name'	, 	request.json['last_name'])
	user_manager.updateInfo(session['userID'], 'password'	, 	request.json['password'])
	user_manager.updateInfo(session['userID'], 'birthMonth'	, 	request.json['month_of_birth'])
	user_manager.updateInfo(session['userID'], 'birthDay'	, 	request.json['day_of_birth'])
	user_manager.updateInfo(session['userID'], 'birthYear'	, 	request.json['year_of_birth'])
	user_manager.updateInfo(session['userID'], 'phone_number', 	request.json['phone_number'])
	user_manager.updateInfo(session['userID'], 'avatar_name', 	request.json['avatar'])
	user_manager.updateInfo(session['userID'], 'avatar_url'	, 	'/static/avatars/' + request.json['avatar'] + '.png')
	user_manager.closeConnection()

	return redirect(url_for('index'))

	

