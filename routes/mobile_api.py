from flask import Blueprint, jsonify, request, session, render_template, redirect, url_for
from users import Users
from posts import Posts
import time
# from py2neo import authenticate, Graph, Node
# authenticate("localhost:7474", "neo4j", "powerplay")
# graph = Graph()

mobile_api = Blueprint('mobile_api', __name__)


@mobile_api.route('/getNotifications', methods=['POST'])
def getNotifications():
	feed_name = "BALT"

	userID = request.form['userID']
	post_manager = Posts()
	notification_list = post_manager.getNotifications(feed_name, userID)
	post_manager.sortAscending(notification_list)
	post_manager.closeConnection()
	return jsonify({ 'notification_list' : notification_list })	


@mobile_api.route('/seeNotification', methods=['POST'])
def seeNotificaiton():
	feed_name = "BALT"
	notification_id = request.json['notification_id']
	post_manager = Posts()
	post_manager.markNotificationAsSeen(feed_name, notification_id)
	post_manager.close()
	

@mobile_api.route('/sendConfirmation', methods = ['POST'])
def sendConfirmation():
	if (session.get('userID') == None):
		return redirect(url_for('login'))
	else:
		thisUser = getUserInfo(session['userID'])
		email_confirm.sendConfirmationEmail(thisUser)
		return render_template('confirmation.html')

# gets the posts for the current feed (defaulted to BALT for now)
@mobile_api.route('/getPosts', methods = ['POST'])
def getPosts():
	feed_name = "BALT"
	post_manager = Posts()
	post_list = post_manager.getPosts(feed_name)
	post_manager.sortAscending(post_list)
	post_manager.closeConnection()
	return jsonify({ 'post_list' : post_list })	

@mobile_api.route('/getPostById', methods = ['POST'])
def getPostById():
	feed_name = "BALT"
	comment_id = request.form['comment_id']
	post_manager = Posts()
	this_post = post_manager.getPostById(feed_name, comment_id)
	post_manager.closeConnection()
	return jsonify({'this_post' : this_post})

@mobile_api.route('/getComments', methods = ['POST'])
def getComments():
	feed_name = "BALT"
	comment_id = request.form['comment_id']
	post_manager = Posts()
	comment_list = post_manager.getComments(feed_name, comment_id)
	post_manager.sortAscending(comment_list)
	post_manager.closeConnection()
	return jsonify({ 'comment_list' : comment_list })	

@mobile_api.route('/getInfoFromUserId', methods=['POST'])
def getInfoFromUserId():
	userID = request.json['userId']
	return jsonify({'first_name' : getFirstName(userID),
					'last_name'  : getLastName(userID),
					'avatar_url' : getAvatarUrl(userID)})

@mobile_api.route('/editComment', methods = ['POST'])
def editComment():
	feed_name = "BALT"
	unique_id = request.json['unique_id']
	field_name = request.json['field_name']
	field_data = request.json['field_data']
	post_manager = Posts()
	post_manager.editComment(feed_name, unique_id, field_name, field_data)
	post_manager.closeConnection()
	return redirect(url_for('index'))
	


# get current user info
@mobile_api.route('/getCurrentUserInfo', methods = ['POST'])
def getCurrentUserInfo():
	thisUserID = session.get('userID')
	thisUser = getUserInfo(thisUserID)
	return jsonify({'thisUser' : thisUser})

@mobile_api.route("/setFeedFilter", methods = ['POST'])
def setFeedFilter():
	if request.method == 'POST':
		thisUser = getUserInfo(session['userID'])
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
		user_manager.updateInfo(session['userID'], 'tradeFilter', tradeFilter)	
		user_manager.updateInfo(session['userID'], 'playFilter', playFilter)	
		user_manager.updateInfo(session['userID'], 'chillFilter', chillFilter)
		user_manager.closeConnnection()	
		return redirect(url_for("index"))

	else:
		return "<h2> Invalid request on sendMessage, only post method please </h2>"

@mobile_api.route("/makePost", methods = ['POST'])
def makePost():
	if request.method == 'POST':
		postContent = request.json['postContent']
		isTrade		= request.json['isTrade']
		isPlay 		= request.json['isPlay']
		isChill		= request.json['isChill']
		comment_id  = request.json['comment_id']

		post_manager = Posts()
		post_manager.postInThread('BALT', body = postContent, poster_id = session['userID'], 
				isTrade = isTrade, isPlay = isPlay, isChill = isChill, comment_id = comment_id)
		
		post_manager.closeConnection()
		return redirect(url_for("index"))
	else:
		return "<h2> Invalid request on sendPost, only post method please </h2>"


@mobile_api.route('/generateUniqueId' , methods = ['POST'])
def generateUniqueId():
	timeStamp = time.time() 
	post_manager = Posts()
	unique_id = post_manager.hash_comment_id(str(timeStamp))
	post_manager.closeConnection()
	return jsonify ({ 'unique_id' : unique_id})	

@mobile_api.route("/makeComment", methods = ['POST'])
def makeComment():
	if request.method == 'POST':
		feed_name = "BALT"

		comment_id = request.json['comment_id']
		commentContent = request.json['commentContent']
		unique_id = request.json['unique_id']
		
		post_manager = Posts()
		post_manager.makeComment(feed_name, comment_id, commentContent, session['userID'], unique_id = unique_id)
		post_manager.closeConnection()	

		return redirect(url_for("index"))
	else:
		return "<h2> Invalid request on sendMessage, only post method please </h2>"


@mobile_api.route('/deletePost', methods = ['POST'])
def deletePost():
	# feed_name = request.form.get('feed_name')
	feed_name = "BALT"
	unique_id = request.json.get('unique_id')
	post_manager = Posts()
	post_manager.deletePost(feed_name, unique_id)
	post_manager.closeConnection()

	return redirect(url_for('index'))


@mobile_api.route('/deleteComment', methods = ['POST'])
def deleteComment():
	feed_name = "BALT"
	# feed_name = request.form.get('feed_name')
	unique_id = request.json.get('unique_id')
	post_manager = Posts()
	post_manager.deleteComment(feed_name, unique_id)
	post_manager.closeConnection()
	return redirect(url_for('index'))



@mobile_api.route('/reportPost', methods = ['POST'])
def reportPost():
	# feed_name = request.json['feed_name']
	feed_name = "BALT"
	unique_id = request.json['unique_id']
	reason = request.json["reason"]
	description = reason
	reporting_user = session['userID']
	reported_user = request.json['reported_user']

	
	post_manager = Posts()
	posts.reportPost(feed_name, unique_id, reason, description, reporting_user, reported_user)
	post_manager.closeConnection()

	return redirect(url_for('index'))
	# return redirect(url_for("index"))

@mobile_api.route('/reportComment', methods = ['POST'])
def reportComment():
	# feed_name = request.json['feed_name']
	feed_name = "BALT"
	print(request.json)
	unique_id = request.json['unique_id']
	reason = request.json["reason"]
	description = reason
	reporting_user = session['userID']
	reported_user = request.json['reported_user']


	post_manager = Posts()
	posts.reportComment(feed_name, unique_id, reason, description, reporting_user, reported_user)
	post_manager.closeConnection()

	return redirect(url_for("index"))



@mobile_api.route('/verifyUser', methods=['POST'])
def verifyUser():
	thisUser = getUserInfo(request.form['username'])
	return jsonify({ 'result' : (thisUser is None) })		

@mobile_api.route('/verifyEmail', methods=['POST'])
def verifyEmail():
	user_manager = Users()
	thisUser = user_manager.getInfoFromEmail(request.form['mail'])
	user_manager.closeConnection()
	return jsonify({ 'result' : (thisUser is None) })	

def getUserInfo(user_id):
	user_manager = Users()
	this_user = user_manager.getInfo(user_id)
	user_manager.closeConnection()
	return this_user

