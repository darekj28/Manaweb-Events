from flask import Blueprint, jsonify, request, session, render_template, redirect, url_for
from users import Users
from posts import Posts
from security import Security
import validation
import time
import email_confirm
import random
from passlib.hash import argon2
import sms
# from py2neo import authenticate, Graph, Node
# authenticate("localhost:7474", "neo4j", "powerplay")
# graph = Graph()

browser_api = Blueprint('browser_api', __name__)
DEFAULT_FEED = "BALT"
avatars = ["ajani", "chandra", "elspeth", "gideon", "jace", "liliana", "nahiri", "nicol", "nissa", "ugin"]

@browser_api.route('/confirmAccount', methods = ['POST'])
def confirmAccount():
	userID = request.json['userID']
	user_manager = Users()
	user_manager.updateInfo(userID, 'confirmed', True)
	user_manager.closeConnection()
	return jsonify({'result' : 'success'})

@browser_api.route('/createProfile', methods = ['POST'])
def createProfile():
	if request.json['email_or_phone'] == "email" :
		email = request.json['email']
		phone_number = ""
		confirmationPin = email_confirm.sendConfirmationEmail(email)
	elif request.json['email_or_phone'] == "phone_number" :
		phone_number = request.json['phone_number']
		email = ""
		output = sms.sendTextConfirmationPin(phone_number)
		if output.get('error') != None :
			return jsonify({ "result" : 'phone_exception'})
		confirmationPin = output.get("pin")
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

@browser_api.route('/getPreviousSettings', methods=['POST'])
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

@browser_api.route('/updateSettings', methods=['POST'])
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
	return jsonify({'result' : 'success'})

@browser_api.route('/updatePassword', methods = ['POST'])
def updatePassword():
	username = request.json['username']
	new_password = request.json['password']
	user_manager = Users()
	user_manager.updateInfo(username, 'password', new_password)
	user_manager.closeConnection()
	security_manager = Security()
	security_manager.unlockAccount(username)
	security_manager.closeConnection()
	output = {}
	output['result'] = 'success'
	return jsonify(output)

@browser_api.route('/verifyEmailOrPhone', methods = ['POST'])
def verifyEmailOrPhone():
	emailOrPhone = request.json['emailOrPhone']
	output = validation.validateEmailOrPhone(emailOrPhone)
	return output

@browser_api.route('/sendEmailConfirmation', methods = ['POST'])
def sendEmailConfirmation():
	email = request.json['email']
	confirmationCode = email_confirm.sendConfirmationEmail(email)
	return jsonify({'result' : 'success', 'confirmationCode' : confirmationCode})

@browser_api.route('/resendConfirmation', methods = ['POST'])
def resendConfirmation():
	userID = request.json['userID']
	phone_number = request.json['phone_number']
	email = request.json['email']
	confirmationPin = request.json['confirmationPin']
	output = {}
	output['confirmationPin'] = confirmationPin
	if email == '':
		sms.sendTextConfirmationPin(phone_number, confirmationPin)
		output['target'] = phone_number
	else:
		email_confirm.sendConfirmationEmail(email, confirmationPin)
		output['target'] = email
	return jsonify(output)

@browser_api.route('/sendTextConfirmation', methods = ['POST'])
def sendTextConfirmation():
	phone_number = request.json['phone_number']
	output = sms.sendTextConfirmationPin(phone_number)
	if (output.get('error') != None) 
		return jsonify({'result' : 'failure', 'reason' : output.get('error')})
	return jsonify({'result' : 'success', 'confirmationCode' : output.get('pin')})

@browser_api.route('/recoverAccount', methods = ['POST'])
def recoverAccount():
	recovery_input = request.json['recovery_input']
	security_manager = Security()
	output = security_manager.recoverAccount(recovery_input)
	security_manager.closeConnection()
	return jsonify(output)

@browser_api.route('/isFacebookUser', methods = ['POST'])
def isFacebookUser():
	fb_id = request.json['fb_id']
	user_manager = Users()
	output = user_manager.isFacebookUser(fb_id)
	user_manager.closeConnection()
	return jsonify(output)

@browser_api.route('/recordFacebookLogin', methods =['POST'])
def recordFacebookLogin():
	username = request.json['username']
	ip = request.json['ip']
	# security_manager = Security()
	# security_manager.recordLoginAttempt(username, True, ip, True)
	# security_manager.closeConnection()
	return jsonify({'result': 'success'})

@browser_api.route('/facebookCreateAccount', methods = ['POST'])
def facebookCreateAccount():
	first_name = request.json['first_name'].title()
	last_name = request.json['last_name'].title()
	userID = request.json['username']
	password = "FB_DEFAULT_PASSWORD"
	email = request.json['email']
	fb_id = request.json['fb_id']
	phone_number = ""
	birthYear = ""
	birthDay = ""
	birthMonth = ""
	gender = ""
	avatar_name = random.choice(avatars)
	avatar_url = '/static/avatars/' + avatar_name + '.png'
	
	isActive = True
	confirmationPin = "placeholder pin"
	# confirmed = False
	confirmed = True		
	user_manager = Users()
	user_manager.addUser(userID, first_name = first_name, last_name = last_name, password = password, email = email,  isActive = isActive,
		avatar_url = avatar_url, avatar_name = avatar_name, confirmed=confirmed, confirmationPin = confirmationPin, tradeFilter = None, playFilter = None, chillFilter = None,
		isAdmin = False, phone_number = phone_number, birthMonth = birthMonth, birthDay = birthDay, birthYear = birthYear,
		gender = gender, fb_id = fb_id) 

	user_manager.closeConnection()
	return jsonify({'result' : 'success', 'username': userID})

@browser_api.route('/verifyAndLogin', methods=['POST'])
def verifyAndLogin() :
	login_id = request.json['user']
	password = request.json['password']
	# ip = request.json['ip']
	res = validation.validateLogin(login_id, password)
	fb_login = False
	if res['result'] == 'success':
		userID = res['username']
		security_manager = Security()
		isSuccess = True
		security_manager.recordInvalidLoginAttempt(login_id, userID, isSuccess)
		security_manager.closeConnection()
		return jsonify({ 'error' : False })
	elif res['username'] != None: 
		isSuccess = False
		userID = res['username']
		security_manager = Security()
		security_manager.recordInvalidLoginAttempt(login_id, userID, isSuccess)
		security_manager.closeConnection()
		return jsonify({ 'error' : res['error'] })
	else:
		return jsonify({ 'error' : res['error'] })

@browser_api.route('/getNumInvalidLoginAttempts', methods = ['POST'])
def getInvalidLoginAttempts():
	user_manager = Users()
	security_manager = Security()
	login_id = request.json['login_id']
	if '@' in login_id:
		user_info = user_manager.getInfoFromEmail(login_id)
	else:
		user_info = user_manager.getInfo(login_id)
	if user_info == None:
		return jsonify({'invalid_logins' : -1})
	userID = user_info['userID']
	numInvalidLoginAttempts = security_manager.getInvalidLoginAttempts(userID)
	return jsonify({'invalid_logins' : numInvalidLoginAttempts})

@browser_api.route('/isUserLocked', methods = ['POST'])
def isUserLocked():
	login_id = request.json['user']
	security_manager = Security()
	isUserLocked = security_manager.isUserLocked(login_id)
	security_manager.closeConnection()
	return jsonify(isUserLocked)

@browser_api.route('/registerUsername', methods=['POST'])
def registerUsername() :
	username = request.json['username']
	res = validation.validateUsername(username)
	if res['result'] == 'success' :
		return jsonify({'result': 'success', 'error' : False })
	else: 
		return jsonify({ 'error' : res['error'] })

@browser_api.route('/registerEmailOrPhone', methods=['POST'])
def registerEmailOrPhone() :
	email_or_phone = request.json['email_or_phone']
	res = validation.validateEmailOrPhone(email_or_phone)
	if res['result'] == 'success' :
		return jsonify({ 'method' : res['method'], 'error' : False })
	else : 
		return jsonify({ 'method' : res['method'], 'error' : res['error'] })

@browser_api.route('/verifyOldPassword', methods=['POST'])
def verifyOldPassword() :
	password = request.json['password']
	user = request.json['currentUser']
	if argon2.verify(password, user['password']) :
		return jsonify({ 'error' : False })
	else: 
		return jsonify({ 'error' : "Error" })

@browser_api.route('/getFeedNames', methods = ['POST'])
def getFeedNames():
	post_manager = Posts()
	feed_name_list = post_manager.getFeedNames()
	post_manager.closeConnection()
	return jsonify({'feed_name_list': feed_name_list})

@browser_api.route('/getNotifications', methods=['POST'])
def getNotifications():
	userID = request.form.get("currentUser[userID]")
	post_manager = Posts()
	notification_list = post_manager.getShortListNotifications(userID)
	post_manager.sortAscending(notification_list)
	post_manager.closeConnection()
	return jsonify({ 'notification_list' : notification_list })	

@browser_api.route('/getNotificationCount', methods=['POST'])
def getNotificationCount():
	userID = request.form.get("currentUser[userID]")
	post_manager = Posts()
	count = post_manager.getNotificationCount(userID)
	post_manager.closeConnection()
	return jsonify({ 'count' : count })

@browser_api.route('/getNumUnseenPosts', methods = ['POST'])
def getNumUnseenPosts():
	userID = request.form.get("currentUser[userID]")
	if userID != None:
		feed_name = request.form['feed_name']
		# userID = session['userID']
		post_manager = Posts()
		numUnseenPosts = post_manager.getNumUnseenPosts(feed_name, userID)
		post_manager.closeConnection()
		return jsonify({'numUnseenPosts': numUnseenPosts})
	else:
		return jsonify({'numUnseenPosts': -1})

@browser_api.route('/seeNotifications', methods=['POST'])
def seeNotifications():
	userID = request.form.get("currentUser[userID]")
	post_manager = Posts()
	post_manager.markNotificationAsSeen(userID)
	post_manager.closeConnection()
	return jsonify({'success' : True})
	
@browser_api.route('/markPostFeedAsSeen', methods = ['POST'])
def markPostFeedAsSeen():
	userID = request.form.get("currentUser[userID]")
	if userID != None:
		feed_name = request.form['feed_name']
		post_manager = Posts()
		post_manager.markPostFeedAsSeen(feed_name, userID)
		post_manager.closeConnection()
		return jsonify({'success': True})
	else: 
		return jsonify({'success': False})

# gets the posts for the current feed (defaulted to BALT for now)
@browser_api.route('/getPosts', methods = ['POST'])
def getPosts():
	# feed_name = request.form['feed_name']
	feed_name = "BALT"
	post_manager = Posts()
	# time1 = time.time()
	post_list = post_manager.getPosts(feed_name)
	# time2 = time.time()
	post_manager.sortAscending(post_list)
	# time3 = time.time()
	# getPostTime = time2 - time1
	# sortTime = time3 - time2
	# print('getPosts time : '  + str(getPostTime))
	# print('sort time : '  + str(sortTime))
	post_manager.closeConnection()
	return jsonify({ 'post_list' : post_list })	

@browser_api.route('/getPostById', methods = ['POST'])
def getPostById():
	feed_name = DEFAULT_FEED
	comment_id = request.form['comment_id']
	post_manager = Posts()
	this_post = post_manager.getPostById(feed_name, comment_id)
	post_manager.closeConnection()
	return jsonify({'this_post' : this_post})

@browser_api.route('/getCommentById', methods = ['POST'])
def getCommentById():
	feed_name = DEFAULT_FEED
	comment_id = request.form['unique_id']
	post_manager = Posts()
	this_comment = post_manager.getCommentById(feed_name, unique_id)
	post_manager.closeConnection()
	return jsonify({'this_comment' : this_comment})	

@browser_api.route('/getComments', methods = ['POST'])
def getComments():
	feed_name = DEFAULT_FEED
	comment_id = request.form['comment_id']
	post_manager = Posts()
	comment_list = post_manager.getComments(feed_name, comment_id)
	post_manager.sortAscending(comment_list)
	post_manager.closeConnection()

	return jsonify({ 'comment_list' : comment_list })	

@browser_api.route('/getInfoFromUserId', methods=['POST'])
def getInfoFromUserId():
	userID = request.json['userId']
	return jsonify({'first_name' : getFirstName(userID),
					'last_name'  : getLastName(userID),
					'avatar_url' : getAvatarUrl(userID)})

@browser_api.route('/editComment', methods = ['POST'])
def editComment():
	feed_name = DEFAULT_FEED
	unique_id = request.json['unique_id']
	field_name = request.json['field_name']
	field_data = request.json['field_data']
	post_manager = Posts()
	post_manager.editComment(feed_name, unique_id, field_name, field_data)
	post_manager.closeConnection()
	return redirect(url_for('index'))
	
@browser_api.route('/editPost', methods = ['POST'])
def editPost():
	feed_name = DEFAULT_FEED
	unique_id = request.json['unique_id']
	field_name = request.json['field_name']
	field_data = request.json['field_data']
	post_manager = Posts()
	post_manager.editPost(feed_name, unique_id, field_name, field_data)
	post_manager.closeConnection()
	return redirect(url_for('index'))
	
# get current user info
@browser_api.route('/getCurrentUserInfo', methods = ['POST'])
def getCurrentUserInfo():
	thisUserID = request.form.get("userID")
	# thisUserID = session.get('userID')
	thisUser = getUserInfo(thisUserID)
	return jsonify({'thisUser' : thisUser})

@browser_api.route("/setFeedFilter", methods = ['POST'])
def setFeedFilter():
	if request.method == 'POST':
		userID = request.form['currentUser']['userID']
		thisUser = getUserInfo(userID)
		tradeFilter = True
		playFilter = True
		chillFilter = True
		if request.form.get('tradeFilter') == None:
			tradeFilter = False
		if request.form.get('playFilter') == None:
			playFilter = False
		if request.form.get('chillFilter') == None:
			chillFilter = False
		user_manager = Users()
		user_manager.updateInfo(userID, 'tradeFilter', tradeFilter)	
		user_manager.updateInfo(userID, 'playFilter', playFilter)	
		user_manager.updateInfo(userID, 'chillFilter', chillFilter)
		user_manager.closeConnnection()	
		return redirect(url_for("index"))

	else:
		return "<h2> Invalid request on sendMessage, only post method please </h2>"

@browser_api.route("/makePost", methods = ['POST'])
def makePost():
	if request.method == 'POST':
		postContent = request.json['postContent']
		isTrade		= request.json['isTrade']
		isPlay 		= request.json['isPlay']
		isChill		= request.json['isChill']
		# comment_id  = request.json['comment_id']
		comment_id = None
		feed_name = DEFAULT_FEED		
		post_manager = Posts()
		poster_id = request.json['currentUser']['userID']
		post_manager.postInThread(feed_name, body = postContent, poster_id = poster_id, 
				isTrade = isTrade, isPlay = isPlay, isChill = isChill, comment_id = comment_id)
		
		post_manager.closeConnection()
		return redirect(url_for("index"))
	else:
		return "<h2> Invalid request on sendPost, only post method please </h2>"


@browser_api.route('/generateUniqueId' , methods = ['POST'])
def generateUniqueId():
	timeStamp = time.time() 
	post_manager = Posts()
	unique_id = post_manager.hash_comment_id(str(timeStamp))
	post_manager.closeConnection()
	return jsonify ({ 'unique_id' : unique_id})	

@browser_api.route("/makeComment", methods = ['POST'])
def makeComment():
	if request.method == 'POST':

		feed_name = DEFAULT_FEED

		comment_id = request.json['comment_id']
		commentContent = request.json['commentContent']
		# unique_id = request.json['unique_id']
		unique_id = None
		
		post_manager = Posts()
		userID = request.json['currentUser']['userID']
		post_manager.makeComment(feed_name, comment_id, commentContent, userID, unique_id = unique_id)
		post_manager.closeConnection()	

		return redirect(url_for("index"))
	else:
		return "<h2> Invalid request on sendMessage, only post method please </h2>"


@browser_api.route('/deletePost', methods = ['POST'])
def deletePost():
	# feed_name = request.form.get('feed_name')
	feed_name = DEFAULT_FEED
	unique_id = request.json.get('unique_id')
	if unique_id != None:
		post_manager = Posts()
		post_manager.deletePost(feed_name, unique_id)
		post_manager.closeConnection()

	return redirect(url_for('index'))


@browser_api.route('/deleteComment', methods = ['POST'])
def deleteComment():
	feed_name = DEFAULT_FEED
	# feed_name = request.form.get('feed_name')
	unique_id = request.json.get('unique_id')
	post_manager = Posts()
	post_manager.deleteComment(feed_name, unique_id)
	post_manager.closeConnection()
	return redirect(url_for('index'))

@browser_api.route('/reportPost', methods = ['POST'])
def reportPost():
	# feed_name = request.json['feed_name']
	feed_name = DEFAULT_FEED
	unique_id = request.json['unique_id']
	reason = request.json["reason"]
	description = reason
	reporting_user = request.json['currentUser']['userID']
	# reporting_user = session['userID']
	reported_user = request.json['reported_user']

	
	post_manager = Posts()
	post_manager.reportPost(feed_name, unique_id, reason, description, reporting_user, reported_user)
	post_manager.closeConnection()

	return redirect(url_for('index'))
	# return redirect(url_for("index"))

@browser_api.route('/reportComment', methods = ['POST'])
def reportComment():
	# feed_name = request.json['feed_name']
	feed_name = DEFAULT_FEED

	unique_id = request.json['unique_id']
	reason = request.json["reason"]
	description = reason
	reporting_user = request.json['currentUser']['userID']
	# reporting_user = session['userID']
	reported_user = request.json['reported_user']


	post_manager = Posts()
	posts_manager.reportComment(feed_name, unique_id, reason, description, reporting_user, reported_user)
	post_manager.closeConnection()

	return redirect(url_for("index"))



@browser_api.route('/verifyUser', methods=['POST'])
def verifyUser():
	thisUser = getUserInfo(request.form['username'])
	return jsonify({ 'result' : (thisUser is None) })		

@browser_api.route('/verifyEmailIfChanged', methods=['POST'])
def verifyEmailIfChanged():
	email = request.json['email']
	currentUser = request.json['currentUser']
	if (currentUser['email'] == email):
		return jsonify({ 'error' : False })
	output = validation.validateEmail(email)
	return jsonify(output)


@browser_api.route('/createFeed', methods = ['POST'])
def createFeed():
	post_manager = Posts()
	feed_name = request.form['feed_name']
	feed_name_confirmation = request.form['feed_name']
	if feed_name == feed_name_confirmation:
		post_manager.createThread(feed_name.upper())
	post_manager.closeConnection()
	return redirect(url_for('adminTools'))

def getUserInfo(user_id):
	user_manager = Users()
	this_user = user_manager.getInfo(user_id)
	user_manager.closeConnection()
	return this_user




