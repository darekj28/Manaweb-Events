var React = require('react');
import LoginError from './LoginError.jsx';
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';
import SettingsInputLabel from '../Settings/SettingsInputLabel.jsx';
import { browserHistory } from 'react-router';
var Link = require('react-router').Link;

export default class LoginForm extends React.Component {
	constructor() {
		super();
		this.state = {error: ""};
	}
	loginError(err) {
		this.setState({ error : err });
		$('#LoginFail').fadeIn(400).delay(4000).fadeOut(400);
	}
	login() {
		var obj = { user : this.props.login_user, 
					password : this.props.login_password, 
					ip : this.props.ip };
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
					this.loginError.bind(this)(res.error);
					this.enableLogin.bind(this)();
				}
			}.bind(this)
		});
	}
	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', {userID : this.props.login_user}, function(data) {
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
                        notification_id : obj['notification_id'],
                        timeString : obj['timeString'],
                        sender_id : obj['sender_id'],
                        action : obj['action'],
                        receiver_id : obj['receiver_id'],
                        seen : obj['seen']
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
    	this.props.initializeIp();
    	$('#LoginFail').hide();
    }
	render() {
		return (
			<div id="LoginForm" className="container">
				<form className="form-horizontal">
	            	<div className="form-group">
	            		<SettingsInputLabel field="username"/>
	                	<input type="text" className="form-control setting login" id="login_user" 
	                	onChange={this.props.handleTyping} placeholder="Username"/>
	                </div>
	                <div className="form-group">
	                	<SettingsInputLabel field="password"/>
	                    <input type="password" className="form-control setting login" id="login_password" 
	                    	onChange={this.props.handleTyping} placeholder="Password"/>
		            </div>
		            <div className="form-group"> 
		            	<button className="btn-login form-control blurButton"
		            					id="LoginButton"><b>Login</b></button>
		            </div>
		            <div className="alert alert-danger login_alert" id="LoginFail">
				  		<strong>Bro!</strong> {this.state.error}
					</div>
	        	</form>
    	   		{/* Feel free to move this Darek put this here for kicks */}
                  	<Link to="/recovery" className="link">
                        Forgot your password?
                  	</Link>
	        </div>
			)
	}
}