var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var AppConstants = require('../constants/AppConstants.jsx');
import {EventEmitter} from 'events';
var _currentUser = {};

function loadCurrentUser(data) {
  _currentUser = data.currentUser;
}
function removeCurrentUser(data) {
  _currentUser = {};
}
var AppStore = Object.assign({}, EventEmitter.prototype, {
	getCurrentUser: function() {
	  return _currentUser;
	},
	emitChange: function() {
	  this.emit('change');
	},
	addChangeListener: function(callback) {
	  this.on('change', callback);
	},
	removeChangeListener: function(callback) {
	  this.removeListener('change', callback);
	}
});
AppDispatcher.register(function(payload) {
	var action = payload.action;
	// Define what to do for certain actions
	switch(action.actionType) {
	  case AppConstants.ADD_CURRENTUSER:
	    // Call internal method based upon dispatched action
	    loadCurrentUser(action.data);
	    break;
	  case AppConstants.REMOVE_CURRENTUSER:
	  	removeCurrentUser();
	  	break;
	  default:
	    return true;
	}
	
	AppStore.emitChange();

	return true;

});
export default AppStore;
