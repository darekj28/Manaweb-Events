var React = require('react');
import SettingsTextInput from './SettingsTextInput.jsx';
import SettingsSelectInput from './SettingsSelectInput.jsx';
import SettingsInputLabel from './SettingsInputLabel.jsx';
import NoSearchNavBar from '../GenericNavBar/NoSearchNavBar.jsx';

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

var text_fields = [	"first_name", "last_name", "password", "password_confirm", "phone_number" ];
var select_fields = [ "month_of_birth", "day_of_birth", "year_of_birth", "avatar" ];

export default class SettingsApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser 		: '',
			first_name 			: '',
			last_name  			: '',
			password			: '',
			password_confirm 	: '',
			phone_number 		: '',
			month_of_birth 		: '',
			day_of_birth 		: '',
			year_of_birth 		: '',
			avatar 				: '',
			valid_text_fields	: [	"first_name", "last_name", "password", "password_confirm", "phone_number" ],
			valid_select_fields	: [ "month_of_birth", "day_of_birth", "year_of_birth", "avatar" ],
			submittable			: true
		};
		this.getCurrentUserInfo = this.getCurrentUserInfo.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleTextBlur = this.handleTextBlur.bind(this);
		this.handleSelectBlur = this.handleSelectBlur.bind(this);
		this.autopopulateSettings = this.autopopulateSettings.bind(this);
	}
	autopopulateSettings() {
		$.ajax({
			type: 'GET',
			url: '/getPreviousSettings',
			success: function(user) {
				this.setState({
					first_name 			: user.first_name,
					last_name  			: user.last_name,
					password   			: user.password,
					password_confirm 	: user.password,
					phone_number		: user.phone_number,
					day_of_birth		: user.birthDay,
					year_of_birth		: user.birthYear,
					month_of_birth		: user.birthMonth,
					avatar      		: user.avatar_name
				});
			}.bind(this)
		});
	}

	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', function(data) {
			this.setState({currentUser : data.thisUser});
		}.bind(this));
	}
	
	handleChange(obj) { this.setState(obj); }

	handleTextBlur(field, valid) {
		var valid_text_fields = this.state.valid_text_fields;
		var valid_select_fields = this.state.valid_select_fields;
		if (valid) this.setState({ valid_text_fields : add(valid_text_fields, field) });
		else this.setState({ valid_text_fields : remove(valid_text_fields, field) });
		this.setState({ submittable : isSameSet(text_fields, valid_text_fields) && 
										isSameSet(select_fields, valid_select_fields) });
	}

	handleSelectBlur(field, valid) {
		var valid_text_fields = this.state.valid_text_fields; 
		var valid_select_fields = this.state.valid_select_fields;
		if (valid) this.setState({ valid_select_fields : add(valid_select_fields, field) });
		else this.setState({ valid_select_fields : remove(valid_select_fields, field) });
		this.setState({ submittable : isSameSet(text_fields, valid_text_fields) && 
										isSameSet(select_fields, valid_select_fields) });
	}

	handleSubmit() {

	}

	componentDidMount() {
		this.autopopulateSettings();
	}
	render() {
		var name = this.state.currentUser['first_name'] + " " + this.state.currentUser['last_name'];
		return(
			<div id="SettingsApp">
				<NoSearchNavBar currentUser={this.state.currentUser} name={name}/>
				<div className="container">
					<form class="form-horizontal">
						<div className="page-header">
							<h2> Update Settings </h2>
						</div>
						{text_fields.map(function(field) {
							return <div>
										<SettingsInputLabel field={field} />
										<SettingsTextInput field={field} value={this.state[field]} 
													handleTyping={this.handleChange} 
													handleBlur={this.handleTextBlur}/>
									</div>;
						}, this)}
						{select_fields.map(function(field) {
							return <div>
										<SettingsInputLabel field={field} />
										<SettingsSelectInput field={field} value={this.state[field]}
															avatar_list={this.state.avatar_list}
															handleSelect={this.handleChange} 
															handleBlur={this.handleSelectBlur}/>
									</div>
						}, this)}
						<div id="avatar_container" className="avatar_container centered-text"></div>
						<div className="form-group">
							{this.state.submittable && 
								<button className="btn btn-default"> Update! </button>}
							{!this.state.submittable && 
								<button className="btn btn-default" onClick={this.handleSubmit} disabled> Update! </button>}
						</div>
					</form>
				</div>
			</div>
			);
	}
}