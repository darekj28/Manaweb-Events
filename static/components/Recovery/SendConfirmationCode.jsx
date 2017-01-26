var React = require('react');
export default class SendConfirmationCode extends React.Component {
	constructor() {
		super();
		this.state = { selected : '' };
	}
	sensorPhone(number) {
		return number.slice(-2);
	}
	sensorEmail(email) {
		var arr = email.split('@');
		var len = arr[0].length - 2;
		var email = arr[0].substring(0, 2);
		for (var i = 0; i < len; i++)
			email += "*";
		return email + "@" + arr[1];
	}
	handleSelect(e) {
		this.setState({ selected : e.target.id });
	}
	handleSendConfirmation() {
		if (this.state.selected == "email")
			this.sendEmailConfirmation.bind(this)(this.props.input.email);
		else if (this.state.selected == "phone")
			this.sendTextConfirmation.bind(this)(this.props.input.phone_number);
		else 
			swal("Yo!", "Please select a method.", "warning");
	}
	sendEmailConfirmation(email) {
		var obj = { email : email };
		$.ajax({
			type: "POST",
			url : '/sendEmailConfirmation',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function(data){   
		     	if (data['result'] == 'success'){
		     		this.props.handleSCC(data.confirmationCode, "email");	
		     	}
		     	else {
		     		swal("Sorry!", "There was an error in sending the confirmation code.", "error");
		     	}
		    }.bind(this)
		});
	}
	sendTextConfirmation(phone_number){
		var obj = { phone_number : phone_number };
		$.ajax({
			type: "POST",
			url : '/sendTextConfirmation',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function(data){   
		     	if (data['result'] == 'success'){
		     		this.props.handleSCC(data.confirmationCode, "phone");	
		     	}
		     	else {
		     		swal("Sorry!", "There was an error in sending the confirmation code.", "error");
		     	}
		    }.bind(this)
		});
	}
	render() {
		return (
			<div className="recovery-page">
				<div className="recovery-title">Hi {this.props.input['username']}. How do you want to reset your password?</div>
				<div className="recovery"> We found the following information associated with your account. </div>
				<label className="radio recovery">
					<input type="radio" id="email" name="recovery" onClick={this.handleSelect.bind(this)}/> 
						Email a code to {this.sensorEmail(this.props.input.email)}.  
				</label>
				<label className="radio recovery">
					<input type="radio" id="phone" name="recovery" onClick={this.handleSelect.bind(this)}/> 
						Text a code to my phone number ending in {this.sensorPhone(this.props.input.phone_number)}.  
				</label>
				<button className="btn post-button recovery-button" onClick={this.props.goPrevStep}> Go back </button>
				<button className="btn post-button recovery-button" onClick={this.handleSendConfirmation.bind(this)}> Continue </button>
			</div>
			)
	}
}