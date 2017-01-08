var React = require('react');
var Link = require('react-router').Link;
import RegisterTextInput from './RegisterTextInput.jsx';
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';
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
		if ($('#register_form').find('input.valid').length == 5)
			this.verifyUsername.bind(this)();
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
	}
	verifyEmail() {
		var obj = { email_or_phone : this.state.email_or_phone };
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
					this.login.bind(this)();
				}
			}.bind(this)
		});
		$("html, body").animate({ scrollTop: $('html,body').prop('scrollHeight') }, 600);
		$('#CreateProfileSuccess').fadeIn(400).delay(3000).fadeOut(400);
	}
	login() {
		var obj = { user : this.state.username, password : this.state.password, ip : AppStore.getIp() };
		$.ajax({
			type: "POST",
			url : '/verifyAndLogin',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success : function(res) {
				if (!res['error']) {
					this.getCurrentUserInfo.bind(this)();
				}
			}.bind(this)
		});
	}
	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', {userID : this.state.username}, function(data) {
			if (!data.confirmed) 
				browserHistory.push('/confirm');
			else {
				AppActions.addCurrentUser(data.thisUser);
				this.getNotifications.bind(this)();
			}
		}.bind(this));
	}
	getNotifications() {
        $.post('/getNotifications', {currentUser : AppStore.getCurrentUser()},
            function(data) {
                var notifications = [];
                data.notification_list.map(function(obj) {
                    notifications.unshift({
                        comment_id : obj['comment_id'],
                        timeString : obj['timeString'],
                        isOP : obj['isOP'],
                        numOtherPeople : obj['numOtherPeople'],
                        sender_name : obj['sender_name'],
                        op_name : obj['op_name']
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
    	$('#CreateProfileSuccess').hide();
    	$('#CreateProfileFail').hide();
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
						<div className="success" id="CreateProfileSuccess">
						  <strong>Success!</strong> Please hold on as we redirect you.
						</div>
						<div className="warning" id="CreateProfileFail">
						  <strong>Bro!</strong> You need to fill out more stuff.
						</div>
						<div className="register" id="Or">
							<center>- or -</center>
						</div>
					</div>
				</form>
			</div>
			)
	}
}