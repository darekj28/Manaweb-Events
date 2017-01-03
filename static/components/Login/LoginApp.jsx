var React = require('react');
var Link = require('react-router').Link;
import FacebookLogin from 'react-facebook-login';

import LoginNavBar from './LoginNavBar.jsx';
import LoginError from './LoginError.jsx';
import SettingsTextInput from '../Settings/SettingsTextInput.jsx';
import SettingsInputLabel from '../Settings/SettingsInputLabel.jsx';
import AppActions from '../../actions/AppActions.jsx';
import { browserHistory } from 'react-router';
import AppStore from '../../stores/AppStore.jsx';

export default class LoginApp extends React.Component {
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
		this.responseFacebook = this.responseFacebook.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleFacebookLoginClick = this.handleFacebookLoginClick.bind(this);
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
			        	// console.log("fbUser")
			        	// console.log(response)

			        	// AppActions.addCurrentUser(data.fbUser);
			        	this.getCurrentUserInfo.bind(this)()
			        	// browserHistory.push('/')
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

	handleBlur() {
		var x = 5;
		// console.log("bro");
	}


	componentDidMount() {
		$('#SignUpButton').one("click", function() {
			$(this).blur();
		})

		$('#RegisterSubmit').one('click', function(e) {
			$(this).blur();
			// this.handleSubmit();
		}.bind(this));
	}

	render() {
		const appId = "1138002282937846"
		const testAppId = "1298398903564849"
		return (
			<div>
				<LoginNavBar/>
				<div className="container app-container">
					<h1><center>M A N A W E B</center></h1>
                    <center>
                    	<Link to="/register">
                    	<button className="btn btn-default" id="SignUpButton">
                    			Create A Profile!
                    		</button>
                    	</Link>

                    	<br/>
                    	<br/>



                    { !this.state.fb_clicked  &&
                    	<div>
                    	<FacebookLogin
						    appId= {appId}
						    autoLoad={false}
						    fields="first_name,email, last_name, name"
						    onClick={this.handleFacebookLoginClick}
						    callback={this.responseFacebook}
						    icon="fa-facebook"
						    size = "small"
						    textButton = "Connect with Facebook" />
						<br/>

						<div> Welcome! {this.state.fb_first_name} </div>

						{
							this.state.fb_verified && 
							<div>
								<SettingsInputLabel field= "username" />
								<SettingsTextInput field= "username" 
											handleTyping={this.handleUsernameChange}
											handleBlur = {this.handleBlur} 
									/>
							
							{
								this.state.submittable 
								? 
								<Link to="/"> <button className="btn btn-default blurButton" 
									id="RegisterSubmit" onClick = {this.handleSubmit.bind(this)}> 
										Let's go! </button>
									</Link> 
								:
								<button className="btn btn-default" id="RegisterSubmit" disabled> 
									Almost there!
								</button>
							}
							</div>
						}
						</div>
					}

					{
						this.state.fb_clicked && 
						<div>
							Waiting for Facebook Authentication...
						</div>
					}

                	</center>

				</div>
			</div>
		);
	}	
}