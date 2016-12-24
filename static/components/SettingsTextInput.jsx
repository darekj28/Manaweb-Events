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
			if (!value.match(condition)) return false;
			break;
		case "last_name":
			var condition = /^[a-z ,.'-]+$/i;
			if (!value.match(condition)) return false;
			break;
		case "password":
			var condition = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,}$/;
			if (!value.match(condition)) return false;
			break;
		case "password_confirm":
			var condition = $('#password').val();
			if (!value.match(condition)) return false;
			break;
		case "phone_number" :
			break;
		default :
			return true;
	}
	return true;
}

export default class SettingsTextInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { valid : true };
		this.handleTyping = this.handleTyping.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}
	handleTyping(event) {
		var obj = {};
		obj[this.props.id] = event.target.value;
		this.props.handleTyping(obj);
	}
	handleBlur(event) {
		var isValid = testValid(this.props.id, event.target.value);
		this.setState({ valid : isValid } );
		this.props.handleBlur(this.props.id, isValid);
	}
	componentDidMount() {
		$('#password').popover();
	}
	render() {
		var type = (this.props.id == "password" || this.props.id == "password_confirm") ? "password" : "text";
		var valid = this.state.valid ? "valid" : "invalid";
		return (
			<div>
				<div className="form-group">
					{this.props.id != "password" && <input className={"setting " + valid} id={this.props.id} type={type} 
						value={this.props.value} 
						onChange={this.handleTyping} onBlur={this.handleBlur}/>}
					{this.props.id == "password" && <input data-toggle="popover" data-trigger="focus" 
						data-content="Your password must contain at least one letter and one number."
						className={"setting " + valid} id={this.props.id} type={type} 
						value={this.props.value} onClick={focus()}
						onChange={this.handleTyping} onBlur={this.handleBlur}/>}
				</div>
				{!this.state.valid && <div className="form-group warning" id={this.props.id + "_warning"}>
					Invalid {idToName(this.props.id)}
				</div>}
			</div>
			);
	}
}