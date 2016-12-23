var React = require('react');
import SettingsTextInput from './SettingsTextInput.jsx';
import SettingsSelectInput from './SettingsSelectInput.jsx';
import SettingsInputLabel from './SettingsInputLabel.jsx';
import NoSearchNavBar from './NoSearchNavBar.jsx';

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
var select_fields = [ "birthMonth", "birthDay", "birthYear", "avatar" ];

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
			birthMonth 			: '',
			birthDay 			: '',
			birthYear 			: '',
			avatar 				: '',
			valid_text_fields	: text_fields,
			valid_select_fields	: select_fields,
			submittable			: true
		}
		this.getCurrentUserInfo = this.getCurrentUserInfo.bind(this);
		this.handleTyping = this.handleTyping.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
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
					birthDay			: user.birthDay,
					birthYear			: user.birthYear,
					birthMonth			: user.birthMonth,
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
	handleTyping(obj) {
		this.setState(obj);
	}
	handleBlur(field, valid) {
		if (valid) this.setState({ valid_text_fields : add(array, field) });
		else this.setState({ valid_text_fields : remove(array, field) });
		this.setState({ submittable : isSameSet(text_fields, this.state.valid_text_fields) });
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
										<SettingsInputLabel id={field} />
										<SettingsTextInput id={field} value={this.state[field]} 
													handleTyping={this.handleTyping} handleBlur={this.handleBlur}/>
									</div>;
						}, this)}
						<div className="form-group">
							<button className="btn btn-default"> Update! </button>
						</div>
					</form>
				</div>
			</div>
			);
	}
}