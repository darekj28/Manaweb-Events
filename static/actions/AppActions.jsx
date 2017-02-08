var AppDispatcher = require('../dispatcher/AppDispatcher.jsx');
var AppConstants = require('../constants/AppConstants.jsx');

var AppActions = {
    addCurrentUser: function(data, jwt){
        AppDispatcher.handleViewAction({
          actionType: AppConstants.ADD_CURRENTUSER,
          data: data,
          jwt : jwt
        })
    },
    removeCurrentUser: function(){
        AppDispatcher.handleViewAction({
          actionType: AppConstants.REMOVE_CURRENTUSER
        })
    },
    addNotifications: function(data) {
        AppDispatcher.handleViewAction({
          actionType: AppConstants.ADD_NOTIFICATIONS,
          data: data
        })
    },
    addNotificationCount: function(data) {
        AppDispatcher.handleViewAction({
          actionType: AppConstants.ADD_NOTIFICATIONCOUNT,
          data: data
        })
    },
    deleteNotificationCount: function() {
        AppDispatcher.handleViewAction({
          actionType: AppConstants.DELETE_NOTIFICATIONCOUNT
        })
    },
    addIp: function(data) {
        AppDispatcher.handleViewAction({
          actionType: AppConstants.ADD_IP,
          data: data
        })
    }
};

module.exports = AppActions;