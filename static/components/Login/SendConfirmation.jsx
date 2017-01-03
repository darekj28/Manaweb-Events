var React = require('react');
var Link = require('react-router').Link;
import FacebookLogin from 'react-facebook-login';
import LoginNavBar from './LoginNavBar.jsx';
import LoginError from './LoginError.jsx';
import AppActions from '../../actions/AppActions.jsx';
import { browserHistory } from 'react-router';
import AppStore from '../../stores/AppStore.jsx';
import SettingsTextInput from '../Settings/SettingsTextInput.jsx';
import SettingsInputLabel from '../Settings/SettingsInputLabel.jsx';


export default class SendConfirmation extends React.Component {
	constructor() {
		super();
		this.state = {
			error : '',
			confirmationCode: "",
			selected_method: "",
			confirmation_code_input: "",
			enable_password_change : false,
			password : "",
			valid_password : false
		};
		this.handleEmailSelect = this.handleEmailSelect.bind(this)
		this.handleTextSelect = this.handleTextSelect.bind(this)
		this.sendEmailConfirmation = this.sendEmailConfirmation.bind(this)
		this.sendTextConfrmation = this. sendTextConfrmation.bind(this)
		this.handleSendConfirmation = this.handleSendConfirmation.bind(this)
		this.handleTyping = this.handleTyping.bind(this)
		this.handleConfirmationCodeSubmit = this.handleConfirmationCodeSubmit.bind(this);
		this.handleTextBlur = this.handleTextBlur.bind(this)
		this.handleNewPasswordSubmit = this.handleNewPasswordSubmit.bind(this)

	}
	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', {userID : this.props.recovery_output.username}, function(data) {
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


	loginError(err) {
		this.setState({ error : err });
	}
	
	handleTyping(event) {
		var obj = {}; 
		obj[event.target.id] = event.target.value;
		this.setState(obj);
	}

	handleEmailSelect() {
		this.setState({selected_method : "email"})
		$("#email_recovery").prop("checked", true)
		$("#text_recovery").prop("checked", false)
	}

	handleTextSelect() {
		this.setState({selected_method : "phone_number"})
		$("#text_recovery").prop("checked", true)	
		$("#email_recovery").prop("checked", false)
	}

	handleTextBlur(field, valid) {
		if (valid == "valid") this.setState({ valid_password : true });
		else this.setState({ valid_password : false });
	}

	// censorEmail(email){
	// 	var splits = email.split()
	// }

	handleSendConfirmation() {
		
		if (this.state.selected_method == "email")
			this.sendEmailConfirmation(this.props.recovery_output.email)
		else if (this.state.selected_method == "phone_number") {
			this.sendTextConfrmation(this.props.recovery_output.phone_number)
		}
	}

	sendEmailConfirmation(email) {
		var obj = { email : email };
		$.ajax({
			type: "POST",
			url : '/sendEmailConfirmation',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function(data)          
		     {   
		     	if (data['result'] == 'success'){
		     		this.setState({confirmationCode: data.confirmationCode})	
		     	}
		     	else {
		     		// this.setState({error: data['error']})
		     		this.setState({error: "error with confirmation code from email"})
		     	}
		     }.bind(this)
		});
	}

	sendTextConfrmation(phone_number){
		var obj = { phone_number : phone_number };
		$.ajax({
			type: "POST",
			url : '/sendTextConfirmation',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function(data)          
		     {   
		     	if (data['result'] == 'success'){
		     		this.setState({confirmationCode: data.confirmationCode})	
		     	}
		     	else {
		     		// this.setState({error: data['error']})
		     		this.setState({error: "error with confirmation code from text"})
		     	}
		     }.bind(this)
		});
	}

	handleChange(obj) { this.setState(obj); }


	handleConfirmationCodeSubmit() {
		if (this.state.confirmation_code_input == this.state.confirmationCode){
			// log the user in and enable them an option to change password 
			
			this.setState({enable_password_change: true})
		}
		else {
			this.setState({error : "invalid confirmation code...please try again"})
		}
	}

	handleNewPasswordSubmit() {
		var obj = { 
			username : this.props.recovery_output.username, 
			password : this.state.password
		 };
		$.ajax({
			type: "POST",
			url : '/updatePassword',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function(data)          
		     {   
		     	if (data['result'] == 'success'){
		     		this.getCurrentUserInfo.bind(this)();
		     	}
		     	else {
		     		// this.setState({error: data['error']})
		     		this.setState({error: "error with resetting password..abort abort"})
		     	}
		     }.bind(this)
		});
	}

	componentDidMount() {

	}


	render() {
		// remember to censor the email and phone number depending on the previous input
		return (
			<div>
				<div className="container app-container">
                   	
                   	<center>
                   	<div>
                   		Username is <strong> {this.props.recovery_output['username']} </strong>
                   		<br/>
                   	</div>

                   	{(this.state.confirmationCode == "" && !this.state.enable_password_change) &&
                   	
                   		<div class="form-group ">
						  <label class="control-label " for="mRadio"> Select a recovery method </label>
						  <div id="mRadio" class="form-control">
						    <div>
						    <label class="radio">
						      <input type="radio" id = "email_recovery"
						      onClick = {this.handleEmailSelect} /> 
						     	 Send confirmation to {this.props.recovery_output.email}  
						     </label>
						     </div>
						     <br/>
						     <div>
						     <label class="radio">
						      <input type="radio" id = "text_recovery"
						      onClick = {this.handleTextSelect} /> 
						     	 Send confirmation to {this.props.recovery_output.phone_number}  
						     </label>
						     </div>
						  </div>
						  <span class="glyphicon glyphicon-ok form-control-feedback"></span>
						  <div className="form-group">
							<button className="btn btn-default" id="SendConfirmationButton" 
									onClick={this.handleSendConfirmation.bind(this)}> Send confirmation! </button>
							</div>
						</div>
						
					}
				
					{(this.state.confirmationCode != "" && this.state.enable_password_change == false) &&
						<div> 
							<input type="text" className="form-control login text-center" id="confirmation_code_input" 
	                    	onChange={this.handleTyping.bind(this)} placeholder="Enter confirmation pin"/>
							<button className="btn btn-default form-control blurButton"
		            					id="Submit Confirmation"
		            					onClick = {this.handleConfirmationCodeSubmit.bind(this)} > Confirm identity!</button>
		            	</div>
					}

					{
						(this.state.enable_password_change == true) &&
						<div>
								<SettingsInputLabel field= "password" />
								<SettingsTextInput field= "password" value={this.state.password} 
													handleTyping={this.handleChange.bind(this)} 
													handleBlur={this.handleTextBlur.bind(this)}/>

								{ this.state.valid_password &&
									<button className="btn btn-default form-control blurButton"
		            					id="Submit Confirmation"
		            					onClick = {this.handleNewPasswordSubmit.bind(this)} > Change password! </button>
								}
		            	</div>
					}

                	</center>

				</div>
			</div>
		);
	}	
}