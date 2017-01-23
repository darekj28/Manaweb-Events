var React = require('react');
import { browserHistory } from 'react-router';

export default class ChangePassword extends React.Component {
	constructor() {
		super();
		this.state = { password : "",
						valid : "" };
	}
	handleBlur(e) {
		var isValid = testValid("password", e.target.value);
		this.setState({ valid : isValid });
	}
	handleEnter(e) {
		if (e.charCode == 13)
			this.handleSubmit.bind(this)();
	}
	handleChange(e) {
		this.setState({ password : e.target.value });
	}
	handleSubmit() {
		if (this.state.valid == "valid") {
			var obj = { 
				username : this.props.username, 
				password : this.state.password
			};
			$.ajax({
				type: "POST",
				url : '/updatePassword',
				data : JSON.stringify(obj, null, '\t'),
				contentType : 'application/json;charset=UTF-8',
				success: function(data){   
			     	if (data['result'] == 'success'){
			     		alert("Success! Your password is changed.")
			     		browserHistory.push('/');
			     	}
			     	else {
			     		alert("Sorry! There was an error in changing your password.")
			     	}
			    }.bind(this)
			});
		}
		else 
			alert("Invalid password. Please follow the instructions in the tooltip.");
	}
	componentDidMount() {
		passwordHelper();
	}
	render() {
		return (
			<div className="recovery-page">
				<div className="recovery-title">Enter a new password</div>
				<input data-toggle="popover" data-trigger="focus" data-placement="top"
						data-content="Your password must contain at least one letter and one number."
						className={"form-control recovery-input " + this.state.valid} 
						type="password" 
						value={this.state.password} 
						onClick={focus()} placeholder="Password"
						id="password"
						onKeyPress={this.handleEnter.bind(this)}
						onChange={this.handleChange.bind(this)} onBlur={this.handleBlur.bind(this)}/>
				<button className="btn post-button recovery-button" onClick={this.props.goPrevStep}> Go back </button>
				<button className="btn post-button recovery-button" onClick={this.handleSubmit.bind(this)}> Submit </button>
			</div>
			)
	}
}