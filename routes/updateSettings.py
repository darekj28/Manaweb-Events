from flask import Blueprint, jsonify, request, redirect, url_for, session
from users import Users

update_settings = Blueprint('update_settings', __name__) 

@update_settings.route('/getPreviousSettings', methods=['POST'])
def getPreviousSettings():
	user_manager = Users()
	userID = request.json['currentUser']['userID']
	thisUser = user_manager.getInfo(userID)
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
			'phone_number'		: thisUser['phone_number'],
			'email'				: thisUser['email']
		})

@update_settings.route('/updateSettings', methods=['POST'])
def updateSettings():
	user_manager = Users()
	userID = request.json['currentUser']['userID']
	user_manager.updateInfo(userID, 'first_name'				, 	request.json['first_name'])
	user_manager.updateInfo(userID, 'last_name'					, 	request.json['last_name'])
	user_manager.updateInfo(userID, 'email'						, 	request.json['email'])
	user_manager.updateInfo(userID, 'password'					, 	request.json['password'])
	user_manager.updateInfo(userID, 'birthMonth'				, 	request.json['month_of_birth'])
	user_manager.updateInfo(userID, 'birthDay'					, 	request.json['day_of_birth'])
	user_manager.updateInfo(userID, 'birthYear'					, 	request.json['year_of_birth'])
	user_manager.updateInfo(userID, 'phone_number'				, 	request.json['phone_number'])
	user_manager.updateInfo(userID, 'avatar_name'				, 	request.json['avatar'])
	user_manager.updateInfo(userID, 'avatar_url'				, 	'/static/avatars/' + request.json['avatar'] + '.png')
	user_manager.closeConnection()

	return redirect(url_for('index'))

	

