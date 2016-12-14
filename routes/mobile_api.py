from flask import Blueprint, jsonify, request, session, render_template
import users

# from py2neo import authenticate, Graph, Node
# authenticate("localhost:7474", "neo4j", "powerplay")
# graph = Graph()

update_settings = Blueprint('mobile_api', __name__)


@mobile_api.route('/getNotifications', methods=['GET'])
def getNotifications():
	feed_name = "BALT"
	userID = request.json['userID']
	notificaiton_list = posts.getNotifications(feed_name, userID)
	posts.sortAscending(notificaiton_list)
	return jsonify({ 'notificaiton_list' : notificaiton_list })	


@mobile_api.route('/seeNotificaiton', methods=['GET'])
def seeNotificaiton():
	feed_name = "BALT"
	notification_id = request.json['notificaiton_id']
	posts.seeNotificaiton(feed_name, notification_id)
	



