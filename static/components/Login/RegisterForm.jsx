var React = require('react');
var Link = require('react-router').Link;
import SettingsTextInput from '../Settings/SettingsTextInput.jsx';
import SettingsSelectInput from '../Settings/SettingsSelectInput.jsx';
import SettingsInputLabel from '../Settings/SettingsInputLabel.jsx';
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';
import { browserHistory } from 'react-router';

var text_fields = [	"username", "password", "password_confirm", "first_name", "last_name", "email_address", "phone_number" ];
var select_fields = [ "month_of_birth", "day_of_birth", "year_of_birth", "avatar" ];

function contains(collection, item) {
	if(collection.indexOf(item) !== -1) return true;
	else return false;
}

export default class RegisterForm extends React.Component {
	handleSubmit() {
		if (this.props.submittable) {
			var obj = {
				first_name 			: this.props.first_name		,
				last_name			: this.props.last_name		,
				username 			: this.props.username 		,
				email_address		: this.props.email_address	,
				password			: this.props.password		,
				phone_number 		: this.props.phone_number 	,
				month_of_birth 		: this.props.month_of_birth ,
				day_of_birth 		: this.props.day_of_birth 	,
				year_of_birth 		: this.props.year_of_birth 	,
				avatar 				: this.props.avatar 			
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
		var obj = { user : this.props.username, password : this.props.password, ip : this.props.ip };
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
		$.post('/getCurrentUserInfo', {userID : this.props.username}, function(data) {
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
						var hasBeenChecked = contains(this.props.valid_text_fields, field);
						return 	<div className="form-group">
									<SettingsInputLabel field={field} />
									<SettingsTextInput field={field} value={this.props[field]} 
												handleTyping={this.props.handleChange} 
												handleBlur={this.props.handleTextBlur}
												hasBeenChecked={hasBeenChecked}/>
								</div>;
					}, this)}
					{select_fields.map(function(field) {
						var hasBeenChecked = contains(this.props.valid_select_fields, field);
						return 	<div className="form-group">
									<SettingsInputLabel field={field} />
									<SettingsSelectInput field={field} value={this.props[field]}
														avatar_list={this.props.avatar_list}
														handleSelect={this.props.handleChange} 
														handleBlur={this.props.handleSelectBlur}
														hasBeenChecked={hasBeenChecked}/>
								</div>
					}, this)}
					<div id="avatar_container" className="avatar_container centered-text"></div>
					<div className="form-group">
						<button className="btn-login form-control blurButton" 
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