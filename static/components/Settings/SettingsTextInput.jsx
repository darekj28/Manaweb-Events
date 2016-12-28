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
function testValid (field, value) {
	switch (field) {
		case "first_name":
			var condition = /^[a-z ,.'-]+$/i;
			if (!value.match(condition)) return "invalid";
		case "last_name":
			var condition = /^[a-z ,.'-]+$/i;
			if (!value.match(condition)) return "invalid";
		case "password":
			var condition = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,}$/;
			if (!value.match(condition)) return "invalid";
		case "password_confirm":
			var condition = $('#password').val();
			if (value != condition) return "invalid";
		default :
			return "valid";
	}
	return "valid";
}
function warningForField(field, value) {
	if (!value) return "You can\'t leave this empty.";
	switch (field) {
		case "password_confirm" :
			return "Your passwords don\'t match.";
		default :
			return "Invalid " + idToName(field);
	}
	return "Invalid " + idToName(field);
}

export default class SettingsTextInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { valid : "valid" };
	}
	handleTyping(event) {
		var obj = {};
		obj[this.props.field] = event.target.value;
		this.props.handleTyping(obj);
	}
	handleBlur(event) {
		var isValid = testValid(this.props.field, event.target.value);
		this.setState({ valid : isValid });
		this.props.handleBlur(this.props.field, isValid);
	}
	componentDidMount() {
		$('#password').popover();
	}
	render() {
		var type = (this.props.field == "password" || this.props.field == "password_confirm") ? "password" : "text";
		return (
			<div>
				<div className="form-group">
					{this.props.field != "password" && <input className={"setting " + this.state.valid} id={this.props.field} type={type} 
						value={this.props.value} 
						onChange={this.handleTyping} onBlur={this.handleBlur}/>}
					{this.props.field == "password" && <input data-toggle="popover" data-trigger="focus" 
						data-content="Your password must contain at least one letter and one number."
						className={"setting " + this.state.valid} id={this.props.field} type={type} 
						value={this.props.value} onClick={focus()}
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}/>}
				</div>
				{(this.state.valid == "invalid") && <div className="form-group warning" id={this.props.field + "_warning"}>
					{warningForField(this.props.field, $('#' + this.props.field).val())}
				</div>}
			</div>
			);
	}
}