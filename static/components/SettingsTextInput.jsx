var React = require('react');

function idToName (id) {
	var arr = id.split('_');
	var str = "";
	var temp;
	for (var i = 0; i < arr.length; i++){
		temp = arr[i].charAt(0).toLowerCase() + arr[i].substr(1).toLowerCase();
		str = str.concat(temp + ' ');
	}
	return str;
}
function testValid (field) {
	switch (field) {
		case "first_name":
			break;
		case "last_name":
			break;
		case "password":
			break;
		case "password_confirm":
			break;
		default:
			alert("Invalid field");
	}
}
export default class SettingsTextInput extends React.Component {
	constructor(props) {
		super(props);
		this.setState = { valid : true };
		this.handleTyping = this.handleTyping.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}
	handleTyping(event) {
		var obj = {};
		obj[this.props.id] = event.target.value;
		this.props.handleTyping(obj);
	}
	handleBlur(event) {
		this.props.handleBlur(event.target.value);
	}
	render() {
		var type = (this.props.id == "password" || this.props.id == "password_confirm") ? "password" : "text";
		var valid = this.state.valid ? "valid" : "invalid";
		return (
			<div>
				<div className="form-group">
					<input className={"setting " + valid} id={this.props.id} type={type} 
						value={this.props.value} 
						onChange={this.handleTyping} onBlur={this.handleBlur}/>
				</div>
				<div className="form-group warning" id={this.props.id + "_warning"}>
					Invalid {idToName(this.props.id)}
				</div>
			</div>
			);
	}
}