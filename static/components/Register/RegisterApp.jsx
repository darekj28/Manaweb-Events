var React = require('react');
var Link = require('react-router').Link;
import LoginNavBar from '../Login/LoginNavBar.jsx';
import LoginError from '../Login/LoginError.jsx';
import SettingsTextInput from '../Settings/SettingsTextInput.jsx';
import SettingsSelectInput from '../Settings/SettingsSelectInput.jsx';
import SettingsInputLabel from '../Settings/SettingsInputLabel.jsx';
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';
import { browserHistory } from 'react-router';

function remove(array, value) {
	var index = array.indexOf(value);
	if (index != -1) array.splice(index, 1);
	return array;
}
function add(array, value) {
	var index = array.indexOf(value);
	if (index === -1) array.push(value);
	return array;
}
function isSameSet (arr1, arr2) {
  return $(arr1).not(arr2).length === 0 && $(arr2).not(arr1).length === 0;  
}

var text_fields = [	"first_name", "last_name", "username", "email_address", "password", "phone_number" ];
var select_fields = [ "month_of_birth", "day_of_birth", "year_of_birth", "avatar" ];

export default class RegisterApp extends React.Component {
	constructor() {
		super();
		this.state = {error : '',
				first_name 			: '',
				last_name  			: '',
				username 			: '',
				email_address		: '',
				password			: '',
				password_confirm 	: '',
				phone_number 		: '',
				month_of_birth 		: '',
				day_of_birth 		: '',
				year_of_birth 		: '',
				avatar 				: '',
				valid_text_fields	: [],
				valid_select_fields	: [],
				submittable			: false
			};
	}
	loginError(err) {
		this.setState({ error : err });
	}
	handleChange(obj) { this.setState(obj); }

	handleTextBlur(field, valid) {
		var valid_text_fields = this.state.valid_text_fields;
		var valid_select_fields = this.state.valid_select_fields;
		if (valid == "valid") this.setState({ valid_text_fields : add(valid_text_fields, field) });
		else this.setState({ valid_text_fields : remove(valid_text_fields, field) });
		this.setState({ submittable : isSameSet(text_fields, valid_text_fields) && 
										isSameSet(select_fields, valid_select_fields) });
	}
	handleSelectBlur(field, valid) {
		var valid_text_fields = this.state.valid_text_fields; 
		var valid_select_fields = this.state.valid_select_fields;
		if (valid == "valid") this.setState({ valid_select_fields : add(valid_select_fields, field) });
		else this.setState({ valid_select_fields : remove(valid_select_fields, field) });
		this.setState({ submittable : isSameSet(text_fields, valid_text_fields) && 
										isSameSet(select_fields, valid_select_fields) });
	}
	handleSubmit() {
		if (this.state.submittable) {
			var obj = {
				first_name 			: this.state.first_name		,
				last_name			: this.state.last_name		,
				username 			: this.state.username 		,
				email_address		: this.state.email_address	,
				password			: this.state.password		,
				phone_number 		: this.state.phone_number 	,
				month_of_birth 		: this.state.month_of_birth ,
				day_of_birth 		: this.state.day_of_birth 	,
				year_of_birth 		: this.state.year_of_birth 	,
				avatar 				: this.state.avatar 			
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
			$('#CreateProfileSuccess').fadeIn(400).delay(5000).fadeOut(400);
			$("html, body").animate({ scrollTop: $('#RegisterApp').prop('scrollHeight') }, 600);
		}
		else {
			$('#CreateProfileFail').fadeIn(400).delay(5000).fadeOut(400);
			$("html, body").animate({ scrollTop: $('#RegisterApp').prop('scrollHeight') }, 600);
			this.enableRegister.bind(this)();
		}
	}
	login() {
		var obj = { user : this.state.username, password : this.state.password };
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
                var count = 0;
                data.notification_list.map(function(obj) {
                    if (!obj['seen']) count++; 
                    notifications.unshift({
                        comment_id : obj['comment_id'],
                        notification_id : obj['notification_id'],
                        timeString : obj['timeString'],
                        sender_id : obj['sender_id'],
                        action : obj['action'],
                        receiver_id : obj['receiver_id'],
                        seen : obj['seen']
                    });
                });
                AppActions.addNotifications(notifications);
                AppActions.addNotificationCount(String(count));
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
			<div id="RegisterApp">
				<LoginNavBar loginError={this.loginError.bind(this)}/>
				<div className="container app-container">
					{this.state.error && <LoginError error={this.state.error}/>}
					<form class="form-horizontal">
						<div className="page-header">
							<h2> Create Your Profile </h2>
						</div>
						{text_fields.map(function(field) {
							return <div>
										<SettingsInputLabel field={field} />
										<SettingsTextInput field={field} value={this.state[field]} 
													handleTyping={this.handleChange.bind(this)} 
													handleBlur={this.handleTextBlur.bind(this)}/>
									</div>;
						}, this)}
						{select_fields.map(function(field) {
							return <div>
										<SettingsInputLabel field={field} />
										<SettingsSelectInput field={field} value={this.state[field]}
															avatar_list={this.state.avatar_list}
															handleSelect={this.handleChange.bind(this)} 
															handleBlur={this.handleSelectBlur.bind(this)}/>
									</div>
						}, this)}
						<div id="avatar_container" className="avatar_container centered-text"></div>
						<div className="form-group">
							<button className="btn btn-default blurButton" 
									id="RegisterSubmit"> 
										Get Started! </button>
						</div>
						<div className="alert alert-success" id="CreateProfileSuccess">
						  <strong>Success!</strong> Please hold on as we redirect you.
						</div>
						<div className="alert alert-danger" id="CreateProfileFail">
						  <strong>Bro!</strong> You need to fill out more stuff.
						</div>
					</form>
				</div>	
			</div>
			)
	}
}