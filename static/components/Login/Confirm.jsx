var React = require('react');
var Link = require('react-router').Link;
import FacebookLogin from 'react-facebook-login';
import LoginNavBar from './LoginNavBar.jsx';
import SettingsTextInput from '../Settings/SettingsTextInput.jsx';
import SettingsInputLabel from '../Settings/SettingsInputLabel.jsx';
import AppActions from '../../actions/AppActions.jsx';
import { browserHistory } from 'react-router';
import AppStore from '../../stores/AppStore.jsx';


export default class Confirm extends React.Component {
	constructor() {
		super();
		this.state = {
			error : '',
			confirmation_code_input: "",
			verified : false ,
			confirmationCode : "",
			this_user: {}
		};
	}

	handleConfirmationCodeChange(event) {
		var obj = {}; 
		obj[event.target.id] = event.target.value;
		this.setState(obj);
	}

	handleConfirmationCodeSubmit() {
		console.log(this.state.confirmation_code_input)
		console.log(this.state.confirmationCode)
		if (this.state.confirmation_code_input == this.state.confirmationCode) {
			this.setState({verified : true})
		}

		else {
			this.setState({error : "Incorrect pin "})
		}
	}

	resendConfirmation() {
		var that = this;
		var obj = {
			userID : this.state.this_user.userID,
			email : this.state.this_user.email,
			phone_number : this.state.this_user.phone_number,
			confirmationPin : this.state.confirmationCode
		}
		$.ajax({
			type: "POST",
			url : '/resendConfirmation',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function(data)          
		     {   
		     	this.setState({error : ""});
		     	alert("A new confirmation code has been sent to " + data.target);

		     }.bind(this)
		});
	}



	componentDidMount() {
		var this_user = AppStore.getCurrentUser()
		console.log(this_user)
		this.setState({this_user: this_user})
		this.setState({confirmationCode:  this_user.confirmationPin})
	}

	render() {
		return (
			<div>

				<div className="container app-container">
					<div className = "col-xs-4 col-sm-offset-4">
                   		<div> 

							<input type="text" className="form-control text-center" id="confirmation_code_input" 
	                    	onChange={this.handleConfirmationCodeChange.bind(this)} placeholder="Enter confirmation code!"/>
							<button className="btn btn-default form-control blurButton"
		            					id="Submit Confirmation Pin"
		            					onClick = {this.handleConfirmationCodeSubmit.bind(this)} > Confirm new account!</button>


			            	{	
			            		this.state.error != "" &&
			            		<div> 
			            			Click <a onClick = {this.resendConfirmation.bind(this)} > here </a> to send again
			            		</div>
			            	}

		            	</div>

		            	{
		            		this.state.verified &&
		            		<div>
		            			Congradulations! Your account has been confirmed! Your avatar is {this.state.this_user.avatar} 
		            		
		            			<img src = {this.state.this_user.avatar_url} />
		            				You can change your avatar at any time in settings. Click <a href = "/"> here </a> to continue to Manaweb!
		            		</div>
		            	}


                	</div>
				</div>
			</div>
		);
	}	
}