var React = require('react');
var Link = require('react-router').Link;
import FacebookLogin from 'react-facebook-login';

import LoginNavBar from './LoginNavBar.jsx';
import LoginError from './LoginError.jsx';
import SettingsTextInput from '../Settings/SettingsTextInput.jsx';
import SettingsInputLabel from '../Settings/SettingsInputLabel.jsx';
import AppActions from '../../actions/AppActions.jsx';
import { browserHistory } from 'react-router';

export default class LoginApp extends React.Component {
	constructor() {
		super();
		this.state = {
			error : '',
			fb_verified : false,
			fb_first_name : "",
			fb_last_name: "",
			fb_email: "",
			fb_id: "",
			username : "",
			submittable: false

		};
		this.responseFacebook = this.responseFacebook.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}
	loginError(err) {
		this.setState({ error : err });
	}
	

	// handleFacebookLoginClick() {
		
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
			        }
			        else {
			        	// send the user to the home page
			        	// console.log("fbUser")
			        	// console.log(response)
			        	AppActions.addCurrentUser(data.fbUser);
			        	browserHistory.push('/')
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
				// console.log('success motha trucka');
			}
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
				<LoginNavBar loginError={this.loginError.bind(this)}/>
				<div className="container app-container">
					{this.state.error && <LoginError error={this.state.error}/>}
					<h1><center>M A N A W E B</center></h1>
                    <center>
                    	<Link to="/register">
                    	<button className="btn btn-default" id="SignUpButton">
                    			Create A Profile!
                    		</button>
                    	</Link>

                    	<br/>
                    	<br/>

                    	<FacebookLogin
						    appId= {appId}
						    autoLoad={false}
						    fields="first_name,email, last_name, name"
						    // onClick={this.handleFacebookLoginClick}
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
									id="RegisterSubmit" onClick = {this.handleSubmit}> 
										Let's go! </button>
									</Link> 
								:
								<button className="btn btn-default" id="RegisterSubmit" disabled> 
									Almost there!
								</button>
							}
							</div>
						}

                	</center>

				</div>
			</div>
		);
	}	
}