var React = require('react');
import AppStore from '../../stores/AppStore.jsx';

function idToName (id) {
	var arr = id.split('_');
	var str = "";
	var temp;
	for (var i = 0; i < arr.length; i++){
		temp = arr[i].charAt(0).toUpperCase() + arr[i].substr(1).toLowerCase();
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
		if (this.props.isUpdate) 
			$('#password').popover();
		else 
			$('#password').popover({ placement : 'bottom' });
		var isPassword = ((this.props.field == "password" 
						|| this.props.field == "password_confirm") 
						|| this.props.field == "old_password");
		if ((this.props.isUpdate && !isPassword) || this.props.hasBeenChecked)
			this.setState({ valid : "valid" });

		if (this.props.field == "phone_number"){
			$('#phone_number').attr('maxlength', 14);
			$('#phone_number').keydown(function (e) {
				var key = e.charCode || e.keyCode || 0;
				// Auto-format- do not expose the mask as the user begins to type
				if (key !== 8 && key !== 9) {
					if ($(this).val().length === 4) {
						$(this).val($(this).val() + ')');
					}
					if ($(this).val().length === 5) {
						$(this).val($(this).val() + ' ');
					}			
					if ($(this).val().length === 9) {
						$(this).val($(this).val() + '-');
					}
				}
				// Allow numeric (and tab, backspace, delete) keys only
				return (key == 8 || 
						key == 9 ||
						key == 46 ||
						(key >= 48 && key <= 57) ||
						(key >= 96 && key <= 105));	
				})
			.bind('focus click', function () {
				if ($(this).val().length === 0) {
					$(this).val('(');
				}
				else {
					var val = $(this).val();
					$(this).val('').val(val); // Ensure cursor remains at the end
				}
			})
			.blur(function () {
				if ($(this).val() === '(') {
					$(this).val('');
				}
			});
		}
	}

	render() {
		var isPassword = ((this.props.field == "password" 
						|| this.props.field == "password_confirm"));
		var type = isPassword ? "password" : "text";
		var isPhoneNumber = (this.props.field == "phone_number")
		return (
				<div>
					{isPhoneNumber && <input className={"setting form-control " + this.state.valid}
					 id={this.props.field} type= {type} 
						value={this.props.value} 
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}
						name = "phone_number" maxlength="14" placeholder="(XXX) XXX-XXXX"/>
					}
					{(!isPassword && !isPhoneNumber) && <input className={"setting form-control " + this.state.valid} id={this.props.field} type={type} 
						value={this.props.value} placeholder={idToName(this.props.field)}
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}/>}
					{this.props.field == "password_confirm" && <input className={"setting form-control " + this.state.valid} id={this.props.field} type={type} 
						value={this.props.value} placeholder="Re-type password"
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}/>}
					{this.props.field == "password" && <input data-toggle="popover" data-trigger="focus" 
						data-content="Your password must contain at least one letter and one number."
						className={"setting form-control " + this.state.valid} id={this.props.field} type={type} 
						value={this.props.value} onClick={focus()} placeholder={idToName(this.props.field)}
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}/>}
					{(this.state.valid == "invalid") && 
					<div className="warning" id={this.props.field + "_warning"}>
						{this.state.warning}
					</div>}				
				</div>
			);
	}
}
SettingsTextInput.defaultProps = {
	hasBeenChecked : false
};