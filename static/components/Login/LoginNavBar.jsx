var React = require('react');
import AppActions from '../../actions/AppActions.jsx';

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
	login(event) {
		event.preventDefault();
		var obj = { user : this.state.user, password : this.state.password };
		$.ajax({
			type: "POST",
			url : '/verifyAndLogin',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success : function(data) {
				this.getCurrentUserInfo.bind(this)();
				this.getNotifications.bind(this)();
			}.bind(this)
		});
	}
	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', function(data) {
			AppActions.addCurrentUser(data.thisUser);
		}.bind(this));
	}
	getNotifications() {
        $.post('/getNotifications', 
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
                AppActions.addNotificationCount(String(count));
            }.bind(this));
    }
    componentDidMount() {
    	$('#LoginButton').click(function() {
    		$(this).blur();
    	});
    }
	render() {
		return (
			<nav className="navbar navbar-default" role="navigation">
			  <div className="container">
		       		<div className="navbar-header">
	                 	<a id="home" className="navbar-brand navbar-brand-logo" href="/">
	                        <span className="glyphicon glyphicon-home"></span>
	                  	</a>
	                  	<button type="button" className="SearchNavBarGlyphicon navbar-toggle" 
	                  					data-toggle="collapse" 
										data-target="#bs-example-navbar-collapse-1">
				            <span className="sr-only">Toggle navigation</span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				        </button>
		        	</div>
			        <form className="collapse navbar-collapse navbar-form navbar-right" 
			        			id="bs-example-navbar-collapse-1">
                        <div className="form-group">
                            <input type="text" className="form-control login" id="user" 
                            	onChange={this.handleTyping.bind(this)} placeholder="Username"/>
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control login" id="password" 
                            	onChange={this.handleTyping.bind(this)} placeholder="Password"/>
                        </div>
			            <button className="btn btn-default form-control" id="LoginButton" 
			            		onClick={this.login.bind(this)}>Sign In!</button>
			        </form>
			  </div>
			</nav>
		)
	}
}