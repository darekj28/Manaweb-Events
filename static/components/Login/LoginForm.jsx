var React = require('react');
import LoginError from './LoginError.jsx';
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';
import { browserHistory } from 'react-router';
var Link = require('react-router').Link;

export default class LoginForm extends React.Component {
	constructor() {
		super();
		this.state = {login_user : '', 
						login_password : '', 
						ip : ""};
	}
	loginError(err) {
		this.setState({ error : err });
	}
	handleTyping(event) {
		var obj = {}; 
		obj[event.target.id] = event.target.value;
		this.setState(obj);
	}
	login() {
		var obj = { user : this.state.login_user, 
					password : this.state.login_password, 
					ip : this.state.ip };
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
    initializeIp(){
    	$.get('https://jsonip.com/', function(r){ 
    		this.setState({ip: r.ip}) 
    		console.log("after initialize ip")
    	}.bind(this))
    }
    componentDidMount() {
    	this.enableLogin.bind(this)();
    	this.initializeIp.bind(this)();
    }
	render() {
		return (
			<div>
				<form>
            	<div className="form-group">
                	<input type="text" className="form-control login" id="login_user" 
                	onChange={this.handleTyping.bind(this)} placeholder="Username"/>
                    <input type="password" className="form-control login" id="login_password" 
                    	onChange={this.handleTyping.bind(this)} placeholder="Password"/>
	            	<button className="btn btn-default form-control blurButton"
	            					id="LoginButton"> Sign In!</button>
	            	{this.state.error && 
				  		<LoginError error={this.state.error}/>}
	            </div>


	        	</form>
    	   		{/* Feel free to move this Darek put this here for kicks */}
                  	<Link to="/recovery" className="navbar-brand navbar-brand-logo">
                        Forgot your password?
                  	</Link>
	        </div>
			)
	}
}