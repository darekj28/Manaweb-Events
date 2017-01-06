var React = require('react');
var Link = require('react-router').Link;
import SettingsTextInput from '../Settings/SettingsTextInput.jsx';
import SettingsInputLabel from '../Settings/SettingsInputLabel.jsx';
import AppActions from '../../actions/AppActions.jsx';
import { browserHistory } from 'react-router';
import AppStore from '../../stores/AppStore.jsx';
import FacebookLogin from 'react-facebook-login';
export default class FacebookConnect extends React.Component {
		constructor() {
		super();
		this.state = {
			fb_verified : false,
			fb_first_name : "",
			fb_last_name: "",
			fb_email: "",
			fb_id: "",
			username : "",
			submittable: false, 
			fb_clicked: false
		};
	}
	
	handleFacebookLoginClick() {
		this.setState({fb_clicked : true})
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
				success: function(data)          
			    {   
			     	// if the user does not already have an account with facebook
			        if (data['result'] == 'failure') {
			        	this.setState({fb_verified : true})
						this.setState({fb_first_name: response['first_name']})
						this.setState({fb_last_name: response['last_name']})
						this.setState({fb_email: response['email']})
						this.setState({fb_id : response['id']})
						this.setState({fb_clicked: false})
			        }
			        else {
			        	// send the user to the home page
			        	var thisFbUser = data.fbUser
			        	var obj = {username : data.fbUser.userID, ip: AppStore.getIp()}
			        	$.ajax({
			        		type: "POST",
							url : '/recordFacebookLogin',
							data : JSON.stringify(obj, null, '\t'),
							contentType : 'application/json;charset=UTF-8',
							success: function(data) {
								console.log(thisFbUser)
								AppActions.addCurrentUser(thisFbUser);
			        			this.getNotifications.bind(this)()
							}.bind(this)
			      		});
			        }
			    }.bind(this)
			});
			
		}
	}
	handleUsernameChange(input) { 
		var username = input.username
		this.setState({username : username});
		var obj = {
			username : username
		};
		var that = this;
		$.ajax({
			type: "POST",
			url : '/registerUsername',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function(data)          
		     {   
		        if (data['result'] == 'success') {
		        	that.setState({submittable : true})
		        }
		        else {
		        	that.setState({submittable: false})
		        }
		     }
		});
	}
	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', {userID : this.state.username}, function(data) {
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
	handleSubmit() {
		var obj = {
			first_name 			: this.state.fb_first_name			,
			last_name			: this.state.fb_last_name			,
			username 			: this.state.username 				,
			email				: this.state.fb_email				,
			fb_id 				: this.state.fb_id
		};
		$.ajax({
			type: "POST",
			url : '/facebookCreateAccount',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function (data){
				this.getCurrentUserInfo.bind(this)();
			}.bind(this)
		});
	}
	render() {
		const appId = "1138002282937846"
		const testAppId = "1298398903564849"
		return (
			<div className="container app-container">
                { !this.state.fb_clicked  &&
                	<div>
                	<FacebookLogin
					    appId= {appId}
					    autoLoad={false}
					    fields="first_name,email, last_name, name"
					    onClick={this.handleFacebookLoginClick.bind(this)}
					    callback={this.responseFacebook.bind(this)}
					    icon="fa-facebook"
					    size = "small"
					    textButton = "Connect with Facebook" />
					<div> Welcome! {this.state.fb_first_name} </div>
					{this.state.fb_verified && 
						<div>
							<RegisterTextInput field="username" value={this.state.username}
										handleTyping={this.handleUsernameChange.bind(this)}/>
						{this.state.submittable ? 
							<Link to="/"> <button className="btn btn-default blurButton" 
								id="RegisterSubmit" onClick = {this.handleSubmit.bind(this)}> 
									Let's go! </button>
							</Link> :
							<div> 
								Almost there!
							</div>
						}
						</div>
					}
					</div>
				}
				{this.state.fb_clicked && 
					<div>
						Waiting for Facebook Authentication...
					</div>
				}
			</div>
		)
	}
}