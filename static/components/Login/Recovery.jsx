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

import SendConfirmation from './SendConfirmation.jsx'

export default class Recovery extends React.Component {
	constructor() {
		super();
		this.state = {
			error : '',
			recovery_input : "",
			initial_recovery_output: {},
			show_next_step: false
		};
		// this.responseFacebook = this.responseFacebook.bind(this);
		this.handleRecoveryInfoChange = this.handleRecoveryInfoChange.bind(this);
		this.handleRecoveryInfoSubmit = this.handleRecoveryInfoSubmit.bind(this);
		// this.handleBlur = this.handleBlur.bind(this);
		// this.handleFacebookLoginClick = this.handleFacebookLoginClick.bind(this);
	}
	loginError(err) {
		this.setState({ error : err });
	}
	
	handleRecoveryInfoChange(event) { 
		var obj = {}; 
		obj[event.target.id] = event.target.value;
		this.setState(obj);
	}

	handleRecoveryInfoSubmit() {
		var obj = {
			recovery_input : this.state.recovery_input
		};

		var that = this;
		$.ajax({
			type: "POST",
			url : '/recoverAccount',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function(data)          
		     {   
		     	if (data['result'] == 'success'){
		     		this.setState({initial_recovery_output: data})
		       		this.setState({show_next_step: true})

		     	}
		     	else {
		     		this.setState({error: data['error']})
		     	}
		     }.bind(this)
		});
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
		return (
			<div>
				<LoginNavBar loginError={this.loginError.bind(this)}/>
				<div className="container app-container">
					{this.state.error && <LoginError error={this.state.error}/>}
                   <center>
	                    { !this.state.show_next_step &&
							<div className = "col-xs-4 col-sm-offset-4">
								<div> Find your account </div>
									<div>
										<input type="text" className="form-control text-center recovery_input" id="recovery_input" 
                						onChange={this.handleRecoveryInfoChange.bind(this)} placeholder=""/>
                						<button className="btn btn-default form-control blurButton"
		            					id="Submit_Recovery"
		            					onClick = {this.handleRecoveryInfoSubmit.bind(this)} > Next!</button>
									</div>
							</div>
						}

						{
							this.state.show_next_step &&
							<SendConfirmation recovery_output = {this.state.initial_recovery_output}
							/>
						}

                	</center>

				</div>
			</div>
		);
	}	
}