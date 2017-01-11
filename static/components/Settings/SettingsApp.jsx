var React = require('react');
import SettingsTextInput from './SettingsTextInput.jsx';
import SettingsSelectInput from './SettingsSelectInput.jsx';
import SettingsInputLabel from './SettingsInputLabel.jsx';
import NoSearchNavBar from '../GenericNavBar/NoSearchNavBar.jsx';
import AppStore from '../../stores/AppStore.jsx';
import Footer from '../Footer.jsx';

var text_fields = [	"first_name", "last_name", "old_password", "password", "phone_number" ];
var select_fields = [ "month_of_birth", "day_of_birth", "year_of_birth", "avatar" ];
var required_text_fields = ["first_name", "last_name", "old_password"];
export default class SettingsApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser 		: AppStore.getCurrentUser(),
			first_name 			: '',
			last_name  			: '',
			old_password		: '',
			password			: '',
			phone_number 		: '',
			month_of_birth 		: '',
			day_of_birth 		: '',
			year_of_birth 		: '',
			avatar 				: '',
			valid_text_fields	: [],
			valid_select_fields	: [],
			invalid_text_fields : [],
			invalid_select_fields : [],
			submittable			: false
		};
	}
	autopopulateSettings() {
		var obj = {currentUser : this.state.currentUser};
		$.ajax({
			type: 'POST',
			url: '/getPreviousSettings',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8',
			success: function(user) {
				this.setState({
					first_name 			: user.first_name,
					last_name  			: user.last_name,
					phone_number		: user.phone_number,
					day_of_birth		: user.birthDay,
					year_of_birth		: user.birthYear,
					month_of_birth		: user.birthMonth,
					avatar      		: user.avatar_name
				});
			}.bind(this)
		});
	}
	
	handleChange(obj) { this.setState(obj); }

	handleTextBlur(field, valid) {
		var valid_text_fields = this.state.valid_text_fields;
		var valid_select_fields = this.state.valid_select_fields;
		var invalid_text_fields = this.state.invalid_text_fields;
		var invalid_select_fields = this.state.invalid_select_fields;
		if (valid == "valid") { 
			this.setState({ valid_text_fields : add(valid_text_fields, field) });
			this.setState({ invalid_text_fields : remove(invalid_text_fields, field) });
		}
		else if (valid == "invalid") {
			this.setState({ valid_text_fields : remove(valid_text_fields, field) });
			this.setState({ invalid_text_fields : add(invalid_text_fields, field) });
		}
		else {
			this.setState({ valid_text_fields : remove(valid_text_fields, field) });
			this.setState({ invalid_text_fields : remove(invalid_text_fields, field) });
		}
		this.setState({ submittable : required_text_fields.every(field => contains(valid_text_fields, field)) && 
									  select_fields.every(field => contains(valid_select_fields, field)) });
		if (invalid_select_fields.length || invalid_text_fields.length)
			this.setState({ submittable : false });
	}

	handleSelectBlur(field, valid) {
		var valid_text_fields = this.state.valid_text_fields; 
		var valid_select_fields = this.state.valid_select_fields;
		var invalid_text_fields = this.state.invalid_text_fields;
		var invalid_select_fields = this.state.invalid_select_fields;
		if (valid == "valid") { 
			this.setState({ valid_select_fields : add(valid_select_fields, field) });
			this.setState({ invalid_select_fields : remove(invalid_select_fields, field) });
		}
		else if (valid == "invalid") {
			this.setState({ valid_select_fields : remove(valid_select_fields, field) });
			this.setState({ invalid_select_fields : add(invalid_select_fields, field) });
		}
		else {
			this.setState({ valid_select_fields : remove(valid_select_fields, field) });
			this.setState({ invalid_select_fields : remove(invalid_select_fields, field) });
		}
		this.setState({ submittable : required_text_fields.every(field => contains(valid_text_fields, field)) && 
									  select_fields.every(field => contains(valid_select_fields, field)) });
		if (invalid_select_fields.length || invalid_text_fields.length)
			this.setState({ submittable : false });
	}

	handleSubmit() {
		if (this.state.submittable) {
			var password = this.state.old_password;
			if (contains(this.state.valid_text_fields, "password"))
				password = this.state.password;
			var obj = {
				first_name 		: this.state.first_name,
				last_name  		: this.state.last_name,
				password   		: password,
				phone_number 	: this.state.phone_number,
				day_of_birth 	: this.state.day_of_birth,
				month_of_birth 	: this.state.month_of_birth,
				year_of_birth 	: this.state.year_of_birth,
				avatar 			: this.state.avatar,
				currentUser 	: this.state.currentUser
			}
			$.ajax({
				type: 'POST',
				url: '/updateSettings',
				data : JSON.stringify(obj, null, '\t'),
			    contentType: 'application/json;charset=UTF-8'
			});
			$('#UpdateSettingsSubmit').blur();
			$('#UpdateSettingsSuccess').fadeIn(400).delay(4000).fadeOut(400);
			$("html, body").animate({ scrollTop: $('#SettingsApp').prop('scrollHeight') }, 600);
		}
		else {
			$('#UpdateSettingsFail').fadeIn(400).delay(4000).fadeOut(400);
			$("html, body").animate({ scrollTop: $('#SettingsApp').prop('scrollHeight') }, 600);
		}
	}

	enableUpdate() {
		$('#UpdateSettingsSubmit').on("click", function(e) {
			e.preventDefault();
			$(this).blur();
		});
	}
	componentDidMount() {
		this.autopopulateSettings.bind(this)();
		this.enableUpdate.bind(this)();
		$('#UpdateSettingsSuccess').hide();
		$('#UpdateSettingsFail').hide();
	}
	render() {
		var name = this.state.currentUser['first_name'] + " " + this.state.currentUser['last_name'];
		return(
			<div id="SettingsApp">
				<NoSearchNavBar currentUser={this.state.currentUser} name={name}/>
				<div className="container app-container">
					<form class="form-horizontal">
						<div className="page-header">
							<h2> Update Settings </h2>
						</div>
						{text_fields.map(function(field) {
							return <div className="form-group">
										<SettingsInputLabel field={field} />
										<SettingsTextInput field={field} value={this.state[field]} 
													handleTyping={this.handleChange.bind(this)} 
													handleBlur={this.handleTextBlur.bind(this)}/>
									</div>;
						}, this)}
						{select_fields.map(function(field) {
							return <div className="form-group">
										<SettingsInputLabel field={field}/>
										<SettingsSelectInput field={field} value={this.state[field]}
															handleSelect={this.handleChange.bind(this)} 
															handleBlur={this.handleSelectBlur.bind(this)}/>
									</div>
						}, this)}
						<div id="avatar_container" className="select_setting avatar_container centered-text"></div>
						<div className="form-group">
							<button className="btn btn-default" id="UpdateSettingsSubmit" 
									onClick={this.handleSubmit.bind(this)}> Update! </button>
						</div>
					</form>
					<div className="success" id="UpdateSettingsSuccess">
					  <strong>Success!</strong> Your settings have been updated.
					</div>
					<div className="warning" id="UpdateSettingsFail">
					  <strong>Bro!</strong> There's an error in your submission.
					</div>
				</div>
			</div>
			);
	}
}