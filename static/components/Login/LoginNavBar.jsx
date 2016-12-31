var React = require('react');
var Link = require('react-router').Link;
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';
import { browserHistory } from 'react-router';

export default class LoginNavBar extends React.Component {
	constructor() {
		super();
		this.state = {user : '', password : ''};
	}
	handleTyping(event) {
		var obj = {}; 
		obj[event.target.id] = event.target.value;
		this.setState(obj);
	}
	login() {
		var obj = { user : this.state.user, password : this.state.password };
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
					this.props.loginError(res.error);
					this.enableLogin.bind(this)();
				}
			}.bind(this)
		});
	}
	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', {userID : this.state.user}, function(data) {
			AppActions.addCurrentUser(data.thisUser);
			this.getNotifications.bind(this)();
		}.bind(this));
	}
	getNotifications() {
        $.post('/getNotifications', {currentUser : AppStore.getCurrentUser()},
            function(data) {
                var notifications = [];
                var count = 0;
                data.notification_list.map(function(obj) {
                    if (!obj['seen']) count++; 
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
    }
	render() {
		return (
			<nav className="navbar navbar-default" role="navigation">
			  <div className="container">
		       		<div className="navbar-header">
	                 	<Link to="/" className="navbar-brand navbar-brand-logo">
	                        <span className="glyphicon glyphicon-home"></span>
	                  	</Link>
	                  	<button type="button" className="SearchNavBarGlyphicon navbar-toggle" 
	                  					data-toggle="collapse" 
										data-target="#bs-example-navbar-collapse-1">
				            <span className="sr-only">Toggle navigation</span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				        </button>
		        	</div>
			        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <form className="navbar-form navbar-right">
                        	<div className="form-group">
                            	<input type="text" className="form-control login" id="user" 
                            	onChange={this.handleTyping.bind(this)} placeholder="Username"/>
	                            <input type="password" className="form-control login" id="login_password" 
	                            	onChange={this.handleTyping.bind(this)} placeholder="Password"/>
				            	
				            	<button className="btn btn-default form-control blurButton"
				            					id="LoginButton"> Sign In!</button>

				            </div>
				        </form>
			        </div>
			  </div>
			</nav>
		)
	}
}