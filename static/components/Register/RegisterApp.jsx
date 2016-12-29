var React = require('react');
var Link = require('react-router').Link;
import LoginNavBar from '../Login/LoginNavBar.jsx';
import LoginError from '../Login/LoginError.jsx';
import SettingsTextInput from '../Settings/SettingsTextInput.jsx';
import SettingsSelectInput from '../Settings/SettingsSelectInput.jsx';
import SettingsInputLabel from '../Settings/SettingsInputLabel.jsx';

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

var text_fields = [	"first_name", "last_name", "username", "email_address", "password", "password_confirm", "phone_number" ];
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
	componentDidMount() {
		$('#RegisterSubmit').click(function(e) {
			e.preventDefault();
			$(this).blur();

		})
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

	}
	render() {
		return(
			<div>
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
							{this.state.submittable && 
								<Link to="/"> <button className="btn btn-default" id="RegisterSubmit" 
										onClick={this.handleSubmit.bind(this)}> Get Started! </button>
									</Link> }
							{!this.state.submittable && 
								<button className="btn btn-default" id="RegisterSubmit" 
									onClick={this.handleSubmit.bind(this)} disabled> 
									Get Started!
								</button>}
						</div>
					</form>
				</div>	
			</div>
			)
	}
}