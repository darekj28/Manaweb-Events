var React = require('react');
var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var AppConstants = require('../constants/AppConstants.jsx');
var assign = require('object-assign');
var ee = require('event-emitter');

var _currentUser = (sessionStorage.CurrentUser) ? JSON.parse(sessionStorage.CurrentUser) : {};
var _notifications = (sessionStorage.Notifications) ? JSON.parse(sessionStorage.Notifications) : [];
var _notification_count = (sessionStorage.NotificationCount) ? JSON.parse(sessionStorage.NotificationCount) : "";

function _loadCurrentUser(data) {
  	_currentUser = data;
  	sessionStorage.CurrentUser = JSON.stringify(_currentUser);
}	
function _removeCurrentUser(data) {
  	_currentUser = {};
  	sessionStorage.CurrentUser = JSON.stringify(_currentUser);
}
function _addNotifications(data) {
	_notifications = data;
	sessionStorage.Notifications = JSON.stringify(_notifications);
}
function _addNotificationCount(data) {
	_notification_count = data;
	sessionStorage.NotificationCount = JSON.stringify(_notification_count);
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
	emitChange() {
	  	emitter.emit('change');
	}
	addChangeListener(callback) {
	  	emitter.on('change', listener = callback);
	}
	removeChangeListener(callback) {
	  	emitter.off('change', callback);
	}
	dispatcherCallback(payload) {
		var action = payload.action;
		switch(action.actionType) {
		    case AppConstants.ADD_CURRENTUSER:
			    _loadCurrentUser(action.data);
			    break;
		    case AppConstants.REMOVE_CURRENTUSER:
		    	_removeCurrentUser();
		    	break;
		    case AppConstants.ADD_NOTIFICATIONS:
		    	_addNotifications(action.data);
		    	break;
		    case AppConstants.ADD_NOTIFICATIONCOUNT:
		    	_addNotificationCount(action.data);
		    	break;
		    default:
		      	return true;
		}
		this.emitChange.bind(this)();
		return true;
	}
}

export default new AppStore();


