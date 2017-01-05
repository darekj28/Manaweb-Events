var React = require('react');
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';
import SettingsInputLabel from '../Settings/SettingsInputLabel.jsx';
import { browserHistory } from 'react-router';
var Link = require('react-router').Link;

export default class LoginForm extends React.Component {
	constructor() {
		super();
		this.state = {	error 				: '',
						login_user 			: '', 
						login_password 		: ''};
	}
	handleTyping(event) {
		var obj = {}; 
		obj[event.target.id] = event.target.value;
		obj["error"] = "";
		this.setState(obj);
	}
	login() {
		var obj = { user : this.state.login_user, 
					password : this.state.login_password, 
					ip : AppStore.getIp() };
		$.ajax({
			type: "POST",
			url : '/verifyAndLogin',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success : function(res) {
				if (!res['error']) {
					this.getCurrentUserInfo.bind(this)();
				}
				else {
					this.setState({ error : res['error'] });
					this.enableLogin.bind(this)();
				}
			}.bind(this)
		});
	}
	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', {userID : this.state.login_user}, function(data) {
			AppActions.addCurrentUser(data.thisUser);
			this.getNotifications.bind(this)();
		}.bind(this));
	}
	getNotifications() {
        $.post('/getNotifications', {currentUser : AppStore.getCurrentUser()},
            function(data) {
                var notifications = [];
                data.notification_list.map(function(obj) {
                    notifications.unshift({
                    	comment_id : obj['comment_id'],
                        timeString : obj['timeString'],
                        isOP : obj['isOP'],
                        numOtherPeople : obj['numOtherPeople'],
                        sender_name : obj['sender_name'],
                        op_name : obj['op_name']
                    });
                });
                AppActions.addNotifications(notifications);
                this.getNotificationCount.bind(this)();
            }.bind(this));
    }
    getNotificationCount() {
    	$.post('/getNotificationCount', {currentUser : AppStore.getCurrentUser()},
            function(data) {
                AppActions.addNotificationCount(data.count);
                browserHistory.push('/');
            }.bind(this));
    }
    enableLogin() {
    	$('#LoginButton').one('click', function(e) {
    		e.preventDefault();
    		$(this).blur();
    		this.login.bind(this)();
    	}.bind(this));
    }
    componentDidMount() {
    	this.enableLogin.bind(this)();
    	$('#LoginFail').hide();
    }
	render() {
		return (
			<form className="navbar-form navbar-right navbar-search-form" 
				         		role="search">  	            	
				    <div className="form-group">
	                	<input type="text" className="login form-control" id="login_user" 
	                	onChange={this.handleTyping.bind(this)} placeholder="Username"/>
	                    <input type="password" className="login form-control" id="login_password" 
	                    	onChange={this.handleTyping.bind(this)} placeholder="Password"/>
		            	<button className="btn-login login form-control"
		            					id="LoginButton"><b>Login</b></button>
		            	{this.state.error && <div className="warning">
				  			<strong>Bro!</strong> {this.state.error}
						</div>}
					</div>
	        </form>
			)
	}
}