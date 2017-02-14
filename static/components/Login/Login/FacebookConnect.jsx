var React = require('react');
var Link = require('react-router').Link;
import RegisterTextInput from '../Register/RegisterTextInput.jsx';
import AppActions from '../../../actions/AppActions.jsx';
import { browserHistory } from 'react-router';
import AppStore from '../../../stores/AppStore.jsx';
import FacebookLogin from 'react-facebook-login';
export default class FacebookConnect extends React.Component {
		constructor() {
		super();
		this.state = {
			fb_first_name 		: "",
			fb_last_name		: "",
			fb_email			: "",
			fb_id 				: "",
			fb_username 		: "",
			error 				: "",
			status 				: "start"
		};
	}
	
	handleFacebookLoginClick() {
		this.setState({status : "clicked"})
	}
		
	// handle the faceobok login
	responseFacebook(response) {
		if (response['id'] != null){
			var obj = {fb_id : response['id']}
			$.ajax({
				type: "POST",
				url : '/isFacebookUser',
				data : JSON.stringify(obj, null, '\t'),
				contentType : 'application/json;charset=UTF-8',
				success: function(data) {   
			     	// if the user does not already have an account with facebook
			        if (data['result'] == 'failure') {
			        	this.setState({status : "verified"})
						this.setState({fb_first_name: response['first_name']})
						this.setState({fb_last_name: response['last_name']})
						this.setState({fb_email: response['email']})
						this.setState({fb_id : response['id']})
			        }
			        else {
			        	this.setState({fb_username : data.fbUser.userID})
			        	var obj = {username : data.fbUser.userID}
			        	$.ajax({
			        		type: "POST",
							url : '/recordFacebookLogin',
							data : JSON.stringify(obj, null, '\t'),
							contentType : 'application/json;charset=UTF-8',
							success: function(data) {
								this.getCurrentUserInfo.bind(this)(data.jwt);
							}.bind(this)
			      		});
			        }
			    }.bind(this)
			});
			
		}
	}
	handleUsernameChange(e) { 
		this.setState({ fb_username : e.target.value });
	}
	handleSubmit() {
		var obj = {username : this.state.fb_username};
		$.ajax({
			type: "POST",
			url : '/registerUsername',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function(data) {   
		        if (data['result'] == 'success') {
		        	this.setState({ error : "" });
		        	this.createAccount.bind(this)();
		        }
		        else {
		        	this.setState({error : data['error']});
		        }
		    }.bind(this)
		});
	}
	getCurrentUserInfo(jwt) {
		$.post('/getCurrentUserInfo', {userID : this.state.fb_username, jwt : jwt}, function(data) {
			AppActions.addCurrentUser(data.thisUser, jwt);
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
	createAccount() {
		$.ajax({
			type: "POST",
			url : '/getKey',
			data : JSON.stringify({test : "test"}, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function (data){
				var obj = {
					first_name 			: this.state.fb_first_name	,
					last_name			: this.state.fb_last_name	,
					username 			: this.state.fb_username 	,
					email				: this.state.fb_email		,
					fb_id 				: this.state.fb_id,
					secret				: data.temp_key
				};
				$.ajax({
					type: "POST",
					url : '/facebookCreateAccount',
					data : JSON.stringify(obj, null, '\t'),
					contentType : 'application/json;charset=UTF-8',
					success: function (data){
						this.getCurrentUserInfo.bind(this)(data.jwt);
					}.bind(this)
				});
			}.bind(this)
		});
	}
	componentDidMount() {
		$('#RegisterSubmit').click(function(e) {
			e.preventDefault();
		})
	}
	render() {
		const appId = "1138002282937846"
		const testAppId = "1298398903564849"
		return (
			<div>
                {this.state.status == "start" &&
                <FacebookLogin
				    appId= {appId}
				    autoLoad={false}
				    fields="first_name,email, last_name, name"
				    onClick={this.handleFacebookLoginClick.bind(this)}
				    callback={this.responseFacebook.bind(this)}
				    icon="fa-facebook"
				    size = "small metro"
				    textButton = "Connect with Facebook" />}
				{this.state.status == "clicked" && 
				<h5>
					Authenticating with Facebook...
				</h5>}
				{this.state.status == "verified" && 
				<div>
					<h5> <strong>Hi {this.state.fb_first_name + "! "}</strong> 
					Choose a username and we'll get you started.</h5>
					<form>
						<div className="form-group">
							<input className="form-control register" id="fb_username"
								placeholder="Username" value={this.state.fb_username}
								onChange={this.handleUsernameChange.bind(this)}/>
						</div>
					</form>
					<button className="btn-login register form-control" 
								onClick={this.handleSubmit.bind(this)}
								id="RegisterSubmit"> 
								Continue with Facebook
							</button>
					{this.state.error && <div className="warning">{this.state.error}</div>}
				</div>}
			</div>
		)
	}
}