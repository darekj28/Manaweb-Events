var React = require('react');
var Link = require('react-router').Link;
import RegisterTextInput from './RegisterTextInput.jsx';
import AppActions from '../../../actions/AppActions.jsx';
import AppStore from '../../../stores/AppStore.jsx';
import { browserHistory } from 'react-router';

var text_fields = ["first_name", "last_name", "email_or_phone", "username", "password" ];

export default class RegisterForm extends React.Component {
	constructor() {
		super();
		this.state = { first_name 			: '', 
						last_name  			: '',
						username 			: '',
						email_or_phone		: '',
						password			: '',
					};
	}
	verifyFields() {
		if (this.state.username_error || this.state.email_error) {
			swal("Oops...", "There's a mistake in your username or contact you provided!", "error");
			return;
		}
		if ($('#register_form').find('input.valid').length == 5) {
			this.verifyUsername.bind(this)();
			swal({title : "Success!", 
						text: "Please hold on as we redirect you.", 
						type: "success",
						showConfirmButton : false});
		}
		else 
			swal("Oops...", "There's a mistake in your submission!", "error");
	}
	checkUsername() {
		var obj = { username : this.state.username };
		$.ajax({
			type: 'POST',
			url: '/registerUsername',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8',
		    success : function(res) {
		    	if (!res['error']) {
		    		this.setState({ username_error : "" });
		    	}
		    	else if (this.state.username != "") {
		    		this.setState({ username_error : res['error'] });
		    	}
		    }.bind(this)
		});
	}
	verifyUsername() {
		var obj = { username : this.state.username };
		$.ajax({
			type: 'POST',
			url: '/registerUsername',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8',
		    success : function(res) {
		    	if (!res['error'])
		    		this.verifyEmailOrPhone.bind(this)();
		    }.bind(this)
		});
	}
	checkEmailOrPhone() {
		var obj = { email_or_phone : this.state.email_or_phone };
		$.ajax({
			type: 'POST',
			url: '/registerEmailOrPhone',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8',
		    success : function(res) {
		    	if (!res['error']){
		    		this.setState({ email_error : "" });
		    	}
		    	else if (this.state.email_or_phone != ""){
		    		this.setState({ email_error : res['error'] });
		    	}
		    }.bind(this)
		});
	}
	verifyEmailOrPhone() {
		var obj = { email_or_phone : this.state.email_or_phone };
		$.ajax({
			type: 'POST',
			url: '/registerEmailOrPhone',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8',
		    success : function(res) {
		    	if (!res['error'])
		    		this.handleSubmit.bind(this)(res['method']);
		    }.bind(this)
		});
	}
	handleChange(obj) {
		if (Object.keys(obj)[0] == "username") this.setState({ username_error : "" }); 
		if (Object.keys(obj)[0] == "email_or_phone") this.setState({ email_error : "" }); 
		this.setState(obj); 
	}

	handleSubmit(email_or_phone) {
		var obj = {
			first_name 			: this.state.first_name		,
			last_name			: this.state.last_name		,
			username 			: this.state.username 		,
			password			: this.state.password		,
			email_or_phone		: email_or_phone
		};
		obj[email_or_phone] = this.state.email_or_phone;
		$.ajax({
			type: "POST",
			url : '/createProfile',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success : function(res) {
				if(res['result'] == "success") {
					this.getCurrentUserInfo.bind(this)();
				}
				else if (res['result'] == "phone_exception") {
					swal("Oops...", "The number you gave us is not valid.", "error");
				}
			}.bind(this)
		});
	}
	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', {userID : this.state.username}, function(data) {
			AppActions.addCurrentUser(data.thisUser, data.jwt);
			swal.close();
			browserHistory.push('/confirm');
		}.bind(this));
	}
    register() {
    	$('#register_form').on("submit", function(e) {
			e.preventDefault();
			this.verifyFields.bind(this)();
		}.bind(this));
    }
    componentDidMount() {
    	this.register.bind(this)();
    	$('#email_or_phone').blur(function() {
    		this.checkEmailOrPhone.bind(this)();
    	}.bind(this));
    	$('#username').blur(function() {
    		this.checkUsername.bind(this)();
    	}.bind(this));
    	$('#register_form').goValidate();
    }
	render() {
		var error = "";
		if (this.state.username_error) error = this.state.username_error;
		else if (this.state.email_error) error = this.state.email_error;
		return(
			<div className="container" id="RegisterForm">
				<form className="form-horizontal" id="register_form">
					{text_fields.map(function(field) {
						return 	<div>
									<RegisterTextInput field={field} value={this.state[field]} 
												handleTyping={this.handleChange.bind(this)}/>
								</div>;
					}, this)}
					<div className="form-group">
						<button type="submit" className="btn-login register form-control"> 
									<b>Create an account</b>
						</button>
					</div>
					<div className="form-group">
						{error != "" && <div className="warning">
						   {error}
						</div>}
						<div className="register" id="Or">
							<center>- or -</center>
						</div>
					</div>
				</form>
			</div>
			)
	}
}