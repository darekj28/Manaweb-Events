var React = require('react');
import SettingsTextInput from './SettingsTextInput.jsx';
import SettingsSelectInput from './SettingsSelectInput.jsx';
import SettingsInputLabel from './SettingsInputLabel.jsx';
import NoSearchNavBar from '../GenericNavBar/NoSearchNavBar.jsx';
import AppStore from '../../stores/AppStore.jsx';

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
function contains(collection, item) {
	if(collection.indexOf(item) !== -1) return true;
	else return false;
}
var text_fields = [	"first_name", "last_name", "old_password", "password", "password_confirm", "phone_number" ];
var select_fields = [ "month_of_birth", "day_of_birth", "year_of_birth", "avatar" ];
var required_text_fields = ["first_name", "last_name", "old_password", "phone_number"];
export default class SettingsApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser 		: AppStore.getCurrentUser(),
			first_name 			: '',
			last_name  			: '',
			old_password		: '',
			password			: '',
			password_confirm 	: '',
			phone_number 		: '',
			month_of_birth 		: '',
			day_of_birth 		: '',
			year_of_birth 		: '',
			avatar 				: '',
			valid_text_fields	: [	"first_name", "last_name", "phone_number" ],
			valid_select_fields	: [ "month_of_birth", "day_of_birth", "year_of_birth", "avatar" ],
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
		if (valid == "valid") this.setState({ valid_text_fields : add(valid_text_fields, field) });
		else this.setState({ valid_text_fields : remove(valid_text_fields, field) });
		this.setState({ submittable : isSameSet(required_text_fields, valid_text_fields) && 
										isSameSet(select_fields, valid_select_fields) });
	}

	handleSelectBlur(field, valid) {
		var valid_text_fields = this.state.valid_text_fields; 
		var valid_select_fields = this.state.valid_select_fields;
		if (valid == "valid") this.setState({ valid_select_fields : add(valid_select_fields, field) });
		else this.setState({ valid_select_fields : remove(valid_select_fields, field) });
		this.setState({ submittable : isSameSet(required_text_fields, valid_text_fields) && 
										isSameSet(select_fields, valid_select_fields) });
	}

	handleSubmit() {
		if (this.state.submittable) {
			var password = this.state.old_password;
			if (contains(this.valid_text_fields, "password") && 
				contains(this.valid_text_fields, "password_confirm"))
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
			$('#UpdateSettingsSuccess').fadeIn(400).delay(5000).fadeOut(400);
			$("html, body").animate({ scrollTop: $('#SettingsApp').prop('scrollHeight') }, 600);

		}
		else {
			$('#UpdateSettingsFail').fadeIn(400).delay(5000).fadeOut(400);
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
							return <div>
										<SettingsInputLabel field={field} />
										<SettingsTextInput field={field} value={this.state[field]} 
													handleTyping={this.handleChange.bind(this)} 
													handleBlur={this.handleTextBlur.bind(this)}
													isUpdate={true} />
									</div>;
						}, this)}
						{select_fields.map(function(field) {
							return <div>
										<SettingsInputLabel field={field} />
										<SettingsSelectInput field={field} value={this.state[field]}
															avatar_list={this.state.avatar_list}
															handleSelect={this.handleChange.bind(this)} 
															handleBlur={this.handleSelectBlur.bind(this)}
															isUpdate={true}/>
									</div>
						}, this)}
						<div id="avatar_container" className="avatar_container centered-text"></div>
						<div className="form-group">
							<button className="btn btn-default" id="UpdateSettingsSubmit" 
									onClick={this.handleSubmit.bind(this)}> Update! </button>
						</div>
					</form>
					<div className="alert alert-success" id="UpdateSettingsSuccess">
					  <strong>Success!</strong> Your settings have been updated.
					</div>
					<div className="alert alert-danger" id="UpdateSettingsFail">
					  <strong>Bro!</strong> You need to fill out more stuff.
					</div>
				</div>
			</div>
			);
	}
}