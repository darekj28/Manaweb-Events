var React = require('react');
var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var AppConstants = require('../constants/AppConstants.jsx');
var assign = require('object-assign');
var ee = require('event-emitter');

var _currentUser = (localStorage.CurrentUser) ? JSON.parse(localStorage.CurrentUser) : "";
var _notifications = (localStorage.Notifications) ? JSON.parse(localStorage.Notifications) : [];
var _notification_count = (localStorage.NotificationCount) ? JSON.parse(localStorage.NotificationCount) : "";
var _ip = ""


function _loadCurrentUser(data, jwt) {
  	_currentUser = data;
  	localStorage.CurrentUser = JSON.stringify(_currentUser);
  	localStorage.jwt = jwt;
}	
function _removeCurrentUser() {
  	_currentUser = "";
  	localStorage.CurrentUser = JSON.stringify(_currentUser);
  	localStorage.jwt = "";
}
function _addNotifications(data) {
	_notifications = data;
	localStorage.Notifications = JSON.stringify(_notifications);
}
function _addNotificationCount(data) {
	_notification_count = data;
	localStorage.NotificationCount = JSON.stringify(_notification_count);
}
function _deleteNotificationCount() {
	_notification_count = "";
	localStorage.NotificationCount = JSON.stringify(_notification_count);
}
function _addIp(data) {
	_ip = data;
	if (_ip != null)
		localStorage.Ip = JSON.stringify(_ip);
}

var emitter = ee({}), listener;

class AppStore extends React.Component {
	constructor() {
		super();
		AppDispatcher.register(this.dispatcherCallback.bind(this));
	}
	getCurrentUser() {
		return _currentUser;
	}
	getNotifications() {
		return _notifications;
	}
	getNotificationCount() {
		return _notification_count;
	}
	getIp() {
		return _ip;
	}
	emitUserChange() {
	  	emitter.emit('userchange');
	}
	addUserChangeListener(callback) {
	  	emitter.on('userchange', listener = callback);
	}
	removeUserChangeListener(callback) {
	  	emitter.off('userchange', callback);
	}
	emitNoteChange() {
	  	emitter.emit('notechange');
	}
	addNoteChangeListener(callback) {
	  	emitter.on('notechange', listener = callback);
	}
	removeNoteChangeListener(callback) {
	  	emitter.off('notechange', callback);
	}
	dispatcherCallback(payload) {
		var action = payload.action;
		switch(action.actionType) {
		    case AppConstants.ADD_CURRENTUSER:
			    _loadCurrentUser(action.data, action.jwt);
			    this.emitUserChange.bind(this)();
			    break;
		    case AppConstants.REMOVE_CURRENTUSER:
		    	_removeCurrentUser();
		    	this.emitUserChange.bind(this)();
		    	break;
		    case AppConstants.ADD_NOTIFICATIONS:
		    	_addNotifications(action.data);
		    	this.emitNoteChange.bind(this)();
		    	break;
		    case AppConstants.ADD_NOTIFICATIONCOUNT:
		    	_addNotificationCount(action.data);
		    	this.emitNoteChange.bind(this)();
		    	break;
		    case AppConstants.DELETE_NOTIFICATIONCOUNT:
		    	_deleteNotificationCount();
		    	this.emitNoteChange.bind(this)();
		    	break;
		    case AppConstants.ADD_IP:
		    	_addIp();
		    	break;
		    default:
		      	return true;
		}
		return true;
	}
}

export default new AppStore();


