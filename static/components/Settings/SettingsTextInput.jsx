var React = require('react');
import AppStore from '../../stores/AppStore.jsx';

function idToName (id) {
	var arr = id.split('_');
	var str = "";
	var temp;
	for (var i = 0; i < arr.length; i++){
		temp = arr[i].charAt(0).toLowerCase() + arr[i].substr(1).toLowerCase();
		str = str.concat(temp + ' ');
	}
	return str;
}
function testValid (field, value) {
	switch (field) {
		case "first_name":
			var condition = /^[a-z ,.'-]+$/i;
			if (!value.match(condition)) return "invalid";
			break;
		case "last_name":
			var condition = /^[a-z ,.'-]+$/i;
			if (!value.match(condition)) return "invalid";
			break;
		case "password":
			var condition = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,}$/;
			if (!value.match(condition)) return "invalid";
			break;
		case "password_confirm":
			var condition = $('#password').val();
			if (value != condition || !value) return "invalid";
			break;
		default :
			return "valid";
	}
	return "valid";
}
function warningForField(field, value) {
	if (!value) return "You can\'t leave this empty.";
	switch (field) {
		case "old_password" :
			return "Your old password is incorrect.";
		case "password_confirm" :
			return "Your passwords don\'t match.";
		default :
			return "Invalid " + idToName(field);
	}
	return "Invalid " + idToName(field);
}

export default class SettingsTextInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { valid : "", warning : "" };
	}
	verifyUsername(username) {
		var obj = { username : username };
		$.ajax({
			type: 'POST',
			url: '/registerUsername',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8',
		    success : function(res) {
		    	if (!res['error']) {
		    		this.setState({ valid : "valid" });
		    		this.props.handleBlur("username", "valid");
		    	}
		    	else {
		    		this.setState({ valid : "invalid", warning : res['error'] });
		    		this.props.handleBlur("username", "invalid");
		    	}
		    }.bind(this)
		});
	}
	verifyEmail(email_address) {
		var obj = { email_address : email_address };
		$.ajax({
			type: 'POST',
			url: '/registerEmail',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8',
		    success : function(res) {
		    	if (!res['error']) {
		    		this.setState({ valid : "valid" });
		    		this.props.handleBlur("email_address", "valid");
		    	}
		    	else {
		    		this.setState({ valid : "invalid", warning : res['error'] });
		    		this.props.handleBlur("email_address", "invalid");
		    	}
		    }.bind(this)
		});
	}
	verifyOldPassword(password) {
		var obj = { password : password, currentUser : AppStore.getCurrentUser() };
		$.ajax({
			type: 'POST',
			url: '/verifyOldPassword',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8',
		    success : function(res) {
		    	if (!res['error']) {
		    		this.setState({ valid : "valid" });
					this.props.handleBlur("old_password", "valid");
		    	}
		    	else {
		    		this.setState({ valid : "invalid" });
					this.props.handleBlur("old_password", "invalid");
		    	}
		    }.bind(this)
		});
	}
	handleTyping(event) {
		var obj = {};
		obj[this.props.field] = event.target.value;
		this.props.handleTyping(obj);
	}
	handleBlur(event) {
		if ((this.props.field == "username" || this.props.field == "email_address") || 
					this.props.field == "old_password") {
			switch (this.props.field) {
				case "username" :
					this.verifyUsername.bind(this)(event.target.value);
					break;
				case "email_address" : 
					this.verifyEmail.bind(this)(event.target.value);
					break;
				case "old_password" :
					this.verifyOldPassword.bind(this)(event.target.value);
					break;
			}
		}
		else { 
			var isValid = testValid(this.props.field, event.target.value);
			this.setState({ valid : isValid, 
					warning : warningForField(this.props.field, event.target.value) });
		};
		this.props.handleBlur(this.props.field, isValid);
	}
	componentDidMount() {
		$('#password').popover();
		if (this.props.isUpdate && ((this.props.field != "password" 
								&& this.props.field != "password_confirm") 
								&& this.props.field != "old_password")) 
			this.setState({ valid : "valid" });
	}
	render() {
		var type = ((this.props.field == "password" 
						|| this.props.field == "password_confirm") 
						|| this.props.field == "old_password") ? "password" : "text";
		return (
			<div>
				<div className="form-group">
					{this.props.field != "password" && <input className={"setting " + this.state.valid} id={this.props.field} type={type} 
						value={this.props.value} 
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}/>}
					{this.props.field == "password" && <input data-toggle="popover" data-trigger="focus" 
						data-content="Your password must contain at least one letter and one number."
						className={"setting " + this.state.valid} id={this.props.field} type={type} 
						value={this.props.value} onClick={focus()}
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}/>}
				</div>
				{(this.state.valid == "invalid") && <div className="form-group warning" id={this.props.field + "_warning"}>
					{this.state.warning}
				</div>}
			</div>
			);
	}
}