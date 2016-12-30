from flask import Blueprint, jsonify, request, session, render_template, redirect, url_for
from users import Users
from posts import Posts
import validation
import time
import email_confirm
from passlib.hash import argon2
# from py2neo import authenticate, Graph, Node
# authenticate("localhost:7474", "neo4j", "powerplay")
# graph = Graph()

browser_api = Blueprint('browser_api', __name__)
DEFAULT_FEED = "BALT"


@browser_api.route('/isFacebookUser', methods = ['POST'])
def isFacebookUser():
	fb_id = request.json['fb_id']
	user_manager = Users()
	fbUser = user_manager.getUserInfoFromFacebookId(fb_id)
	user_manager.closeConnection()
	output = {}
	if fbUser == None:
		output['result'] = 'failure'
		output['userID'] = ""
	else:
		output['result'] = 'success'
		output['fbUser'] = fbUser
		session['logged_in'] = True
		session['userID'] = fbUser['userID']

	return jsonify(output)


@browser_api.route('/facebookCreateAccount', methods = ['POST'])
def facebookCreateAccount():
	first_name = request.json['first_name'].title()
	last_name = request.json['last_name'].title()
	userID = request.json['username']
	password = "FB_DEFAULT_PASSWORD"
	email = request.json['email']
	fb_id = request.json['fb_id']
	phone_number = "555-555-5555"
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
	user_manager.addUser(userID, first_name = first_name, last_name = last_name, password = password, email = email,  isActive = isActive,
		avatar_url = avatar_url, avatar_name = avatar_name, confirmationPin = confirmationPin, tradeFilter = None, playFilter = None, chillFilter = None,
		isAdmin = False, phone_number = phone_number, birthMonth = birthMonth, birthDay = birthDay, birthYear = birthYear,
		gender = gender, fb_id = fb_id) 

	user_manager.closeConnection()

	session['logged_in'] = True
	session['userID'] = userID

	return jsonify({'result' : 'success', 'username': userID})



@browser_api.route('/verifyAndLogin', methods=['POST'])
def verifyAndLogin() :
	user = request.json['user']
	password = request.json['password']
	res = validation.validateLogin(user, password)
	if res['result'] == 'success':
		session['logged_in'] = True
		session['userID'] = res['username']
		return jsonify({ 'error' : False })
	else : 
		return jsonify({ 'error' : res['error'] })

@browser_api.route('/registerUsername', methods=['POST'])
def registerUsername() :
	username = request.json['username']
	res = validation.validateUsername(username)
	if res['result'] == 'success' :
		return jsonify({'result': 'success', 'error' : False })
	else : 
		return jsonify({ 'error' : res['error'] })

@browser_api.route('/registerEmail', methods=['POST'])
def registerEmail() :
	email_address = request.json['email_address']
	res = validation.validateEmail(email_address)
	if res['result'] == 'success' :
		return jsonify({ 'error' : False })
	else : 
		return jsonify({ 'error' : res['error'] })

@browser_api.route('/verifyOldPassword', methods=['POST'])
def verifyOldPassword() :
	password = request.json['password']
	user = request.json['currentUser']
	if argon2.verify(password, user['password']) :
		return jsonify({ 'error' : False })
	else : 
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

@browser_api.route('/seeNotification', methods=['POST'])
def seeNotificaiton():
	notification_id = request.form['notification_id']
	post_manager = Posts()
	post_manager.markNotificationAsSeen(notification_id)
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
			

@browser_api.route('/sendConfirmation', methods = ['POST'])
def sendConfirmation():
	userID = request.form.get("currentUser[userID]")
	
	if (userID == None):
		return redirect(url_for('login'))
	else:
		thisUser = getUserInfo(userID)
		email_confirm.sendConfirmationEmail(thisUser)
		return render_template('confirmation.html')

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

@browser_api.route('/verifyEmail', methods=['POST'])
def verifyEmail():
	user_manager = Users()
	thisUser = user_manager.getInfoFromEmail(request.form['mail'])
	user_manager.closeConnection()
	return jsonify({ 'result' : (thisUser is None) })	


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




