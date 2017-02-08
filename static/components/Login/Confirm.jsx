var React = require('react');
var Link = require('react-router').Link;
import FacebookLogin from 'react-facebook-login';
import LoginNavBar from './LoginNavBar.jsx';
import SettingsTextInput from '../Settings/SettingsTextInput.jsx';
import SettingsInputLabel from '../Settings/SettingsInputLabel.jsx';
import AppActions from '../../actions/AppActions.jsx';
import { browserHistory } from 'react-router';
import AppStore from '../../stores/AppStore.jsx';

export default class Confirm extends React.Component {
	constructor() {
		super();
		this.state = {
			error : '',
			input: "",
			confirmationCode : AppStore.getCurrentUser().confirmationPin,
			this_user: AppStore.getCurrentUser(),
			show_welcome : false
		};
	}

	handleChange(e) {
		this.setState({ input : e.target.value });
	}
	handleEnter(e) {
		if (e.charCode == 13)
			this.handleSubmit.bind(this)();
	}

	handleSubmit() {
		if (this.state.input === this.state.confirmationCode) {
			this.confirmAccount.bind(this)();
			swal({title : "Success!", 
						text: "Please hold on as we get you started.", 
						type: "success",
						showConfirmButton : false});
		}
		else {
			this.setState({ error : true });
			swal("Sorry!", "Incorrect pin.", "error");
		}
	}

	confirmAccount() {
		var obj = {
			userID : this.state.this_user.userID,
		}
		$.ajax({
			type: "POST",
			url : '/confirmAccount',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function(data){   
		     	this.getCurrentUserInfo.bind(this)(data.jwt);
		    }.bind(this)
		});
	}
	getCurrentUserInfo(jwt) {
		$.post('/getCurrentUserInfo', {userID : this.state.this_user.userID, jwt : jwt}, function(data) {
			AppActions.addCurrentUser(data.thisUser, jwt);
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
                        op_name : obj['op_name'],
                        avatar : obj['avatar']
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
                swal.close();
                this.showWelcome.bind(this)()
            }.bind(this));
    }

    showWelcome(){
		var current_user = AppStore.getCurrentUser()
		var avatar_name = current_user.avatar_name
		var container = document.getElementById('avatar_container');
		container.style.backgroundImage = 'url(static/avatars/' + avatar_name + '.png)';
		var welcome_container = document.getElementById('welcome-container')
		welcome_container.style.display = ''
		var recovery_container = document.getElementById('recovery-container')
		recovery_container.style.display = 'none'
		var avatar_name_space = document.getElementById('avatar_name_space')
		avatar_name_space.innerHTML = avatar_name.charAt(0).toUpperCase() + avatar_name.slice(1);
    }

    navigateToMain() {
    	browserHistory.push('/')
    }

	resendConfirmation() {
		this.setState({error : ""});
		swal("A new confirmation code has been sent to you.", "Try again.");
		var obj = {
			userID : this.state.this_user.userID,
			email : this.state.this_user.email,
			phone_number : this.state.this_user.phone_number,
			confirmationPin : this.state.confirmationCode
		}
		$.ajax({
			type: "POST",
			url : '/resendConfirmation',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function(data){   
		    }.bind(this)
		});
	}

	render() {

		return ( 
				<div className="container app-container">
					<div id = "recovery-container">
					<div className="recovery-title">Confirm your account</div>
					{this.state.this_user.email && 
						<div className="recovery">A confirmation code was sent to <span className="special">{this.state.this_user.email}</span>. Please enter it below.</div>}
					{(!this.state.this_user.email && this.state.this_user.phone_number) && 
						<div className="recovery">A confirmation code was sent to <span className="special">{this.state.this_user.phone_number}</span>. Please enter it below.</div>}
               		<input className="form-control recovery-input" onKeyPress={this.handleEnter.bind(this)} onChange={this.handleChange.bind(this)}/>
               		<button className="btn post-button recovery-button" onClick={this.handleSubmit.bind(this)}> Confirm </button>
		            {this.state.error &&
		            	<button className="btn post-button recovery-button" onClick={this.resendConfirmation.bind(this)}> Resend confirmation code </button>}
		            </div>
		           	<div id = "welcome-container" style = {{display : "none"}}>
		            <div className = "recovery-title"> Congratulations! </div>
						<div id="avatar_container"  className="select_setting avatar_container centered-text"></div>
						<div className="recovery">  You've been randomly selected to have  <span className="special" id = "avatar_name_space"/> as your avatar. 
						You can change your avatar anytime in settings </div>
						<button className="btn post-button recovery-button" onClick={this.navigateToMain.bind(this)}> 
						 Click here to continue
						</button>
					</div>
            	</div> 
		);
	}	
}