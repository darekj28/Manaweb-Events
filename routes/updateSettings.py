from flask import Blueprint, jsonify, request, session, render_template
from users import Users

# from py2neo import authenticate, Graph, Node
# authenticate("localhost:7474", "neo4j", "powerplay")
# graph = Graph()

update_settings = Blueprint('update_settings', __name__)
FORMATS = ['commander', 'cube', 'draft', 'legacy', 'modern', 'pauper', 'sealed' , 'standard', 
'two_headed_giant',  'vintage']

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

	user_manager.updateInfo(session['userID'], 'first_name', request.form['first_name'])
	user_manager.updateInfo(session['userID'], 'last_name', request.form['last_name'])
	user_manager.updateInfo(session['userID'], 'password', request.form['password'])
	user_manager.updateInfo(session['userID'], 'birthMonth', request.form['birthMonth'])
	user_manager.updateInfo(session['userID'], 'birthDay', request.form['birthDay'])
	user_manager.updateInfo(session['userID'], 'birthYear', request.form['birthYear'])
	user_manager.updateInfo(session['userID'], 'phone_number', request.form['phone_number'])
	avatar_name = request.form['avatar'].split('/')[3].split('.')[0]
	user_manager.updateInfo(session['userID'], 'avatar_name', avatar_name)
	avatar_url =  request.form['avatar']
	user_manager.updateInfo(session['userID'], 'avatar_url', avatar_url)
	user_manager.closeConnection()

	return render_template('settingsChanged.html')

	

