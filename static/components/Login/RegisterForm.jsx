var React = require('react');
var Link = require('react-router').Link;
import SettingsTextInput from '../Settings/SettingsTextInput.jsx';
import SettingsInputLabel from '../Settings/SettingsInputLabel.jsx';
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';
import { browserHistory } from 'react-router';

var text_fields = [	"username", "password", "first_name", "last_name", "contact" ];

export default class RegisterForm extends React.Component {
	constructor() {
		super();
		this.state = { first_name 			: '', 
						last_name  			: '',
						username 			: '',
						contact				: '',
						password			: '',
						valid_text_fields	: [],
						submittable			: false };
	}

	handleChange(obj) { this.setState(obj); }

	handleTextBlur(field, valid) {
		var valid_text_fields = this.state.valid_text_fields;
		if (valid == "valid") this.setState({ valid_text_fields : add(valid_text_fields, field) });
		else this.setState({ valid_text_fields : remove(valid_text_fields, field) });
		this.setState({ submittable : text_fields.every(field => contains(valid_text_fields, field)) });
	}

	handleSubmit() {
		if (this.state.submittable) {
			var obj = {
				first_name 			: this.state.first_name		,
				last_name			: this.state.last_name		,
				username 			: this.state.username 		,
				email_address		: this.state.email_address	,
				password			: this.state.password		,
				phone_number 		: this.state.phone_number		
			};
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
			$('#CreateProfileSuccess').fadeIn(400).delay(4000).fadeOut(400);
			$("html, body").animate({ scrollTop: $('#LoginRegisterMenu').prop('scrollHeight') }, 600);
		}
		else {
			$('#CreateProfileFail').fadeIn(400).delay(4000).fadeOut(400);
			$("html, body").animate({ scrollTop: $('#LoginRegisterMenu').prop('scrollHeight') }, 600);
			this.enableRegister.bind(this)();
		}
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
                browserHistory.push('/');
            }.bind(this));
    }
    enableRegister() {
    	$('#RegisterSubmit').one("click", function(e) {
			e.preventDefault();
			$(this).blur();
			this.handleSubmit.bind(this)();
		}.bind(this));
    }
    componentDidMount() {
    	this.enableRegister.bind(this)();
		$('#CreateProfileSuccess').hide();
    	$('#CreateProfileFail').hide();
    }
	render() {
		return(
			<div className="container" id="RegisterForm">
				<form className="form-horizontal">
					{text_fields.map(function(field) {
						return 	<div className="form-group">
									<SettingsInputLabel field={field} />
									<SettingsTextInput field={field} value={this.state[field]} 
												handleTyping={this.handleChange.bind(this)} 
												handleBlur={this.handleTextBlur.bind(this)}/>
								</div>;
					}, this)}
					<div className="form-group">
						<button className="btn-login form-control" 
								id="RegisterSubmit"> 
									<b>Get Started!</b></button>
					</div>
					<div className="alert alert-success login_alert" id="CreateProfileSuccess">
					  <strong>Success!</strong> Please hold on as we redirect you.
					</div>
					<div className="alert alert-danger login_alert" id="CreateProfileFail">
					  <strong>Bro!</strong> You need to fill out more stuff.
					</div>
				</form>
			</div>
			)
	}
}