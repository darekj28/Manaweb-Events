var React = require('react');
import AppStore from '../../stores/AppStore.jsx';

function phoneHelper() {
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
			if ($(this).val().length === 0) {
				$(this).val("(" + $(this).val());
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
function passwordHelper(isUpdate) {
	if (isUpdate) 
		$('#password').popover();
	else 
		$('#password').popover({ placement : 'bottom' });
}
export default class SettingsTextInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { valid : "", warning : "", hasMounted : false };
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
		var field = this.props.field;
		if ((field == "username" || field == "email_address") || 
					field == "old_password") {
			switch (field) {
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
			var isValid = testValid(field, event.target.value);
			this.setState({ valid : isValid, 
					warning : warningForField(field, event.target.value) });
		};
		this.props.handleBlur(field, isValid);
	}
	componentWillReceiveProps(nextProps) {
		if (!this.state.hasMounted) {
			var isValid = testValid(nextProps.field, nextProps.value); 
			if (isValid == "valid" && this.props.field != "old_password")
				this.setState({ valid : isValid, hasMounted : true });
			else 
				this.setState({ hasMounted : true });
		}
	}
	componentDidMount() {
		if (this.props.field == "phone_number")
			phoneHelper();
		if (this.props.field == "password") 
			passwordHelper(this.props.isUpdate);
	}

	render() {
		var field = this.props.field;
		var value = this.props.value;
		var isPassword = ((field == "password" 
						|| field == "password_confirm")
						|| field == "old_password");
		var type = isPassword ? "password" : "text";
		var isPhoneNumber = (field == "phone_number");
		return (
				<div>
					{isPhoneNumber && <input className={"setting form-control " + this.state.valid}
					 	id={field} type= {type} 
						value={value} 
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}
						name = "phone_number" maxlength="14" placeholder="(XXX) XXX-XXXX"/>}
					{(!isPassword && !isPhoneNumber) && <input className={"setting form-control " + this.state.valid} 
						id={field} type={type} 
						value={value} placeholder={idToName(field)}
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}/>}
					{field == "old_password" && <input className={"setting form-control " + this.state.valid} 
						id={field} type={type} 
						value={value} placeholder="Enter your old password"
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}/>}
					{field == "password_confirm" && <input className={"setting form-control " + this.state.valid} 
						id={field} type={type} 
						value={value} placeholder="Re-type password"
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}/>}
					{field == "password" && <input data-toggle="popover" data-trigger="focus" 
						data-content="Your password must contain at least one letter and one number."
						className={"setting form-control " + this.state.valid} id={field} type={type} 
						value={value} onClick={focus()} placeholder={idToName(field)}
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}/>}
					{(this.state.valid == "invalid") && 
					<div className="warning" id={field + "_warning"}>
						{this.state.warning}
					</div>}				
				</div>
			);
	}
}
