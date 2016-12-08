from flask import Blueprint, jsonify, request, session, render_template
import users

# from py2neo import authenticate, Graph, Node
# authenticate("localhost:7474", "neo4j", "powerplay")
# graph = Graph()

update_settings = Blueprint('update_settings', __name__)
FORMATS = ['commander', 'cube', 'draft', 'legacy', 'modern', 'pauper', 'sealed' , 'standard', 
'two_headed_giant',  'vintage']

@update_settings.route('/getPreviousSettings', methods=['GET'])
def getPreviousSettings():
	thisUser = users.getInfo(session['userID'])
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
	thisUser = users.getInfo(session['userID'])
	users.updateInfo(session['userID'], 'first_name', request.form['first_name'])
	users.updateInfo(session['userID'], 'last_name', request.form['last_name'])
	users.updateInfo(session['userID'], 'password', request.form['password'])
	users.updateInfo(session['userID'], 'birthMonth', request.form['birthMonth'])
	users.updateInfo(session['userID'], 'birthDay', request.form['birthDay'])
	users.updateInfo(session['userID'], 'birthYear', request.form['birthYear'])
	users.updateInfo(session['userID'], 'phone_number', request.form['phone_number'])
	users.updateInfo(session['userID'], 'avatar_name', request.form['avatar'] )
	avatar_url = './static/avatars/' + request.form['avatar']
	users.updateInfo(session['userID'], 'avatar_url', avatar_url)

	return render_template('settingsChanged.html')

	

