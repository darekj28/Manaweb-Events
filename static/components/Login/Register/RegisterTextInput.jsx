var React = require('react');
export default class RegisterTextInput extends React.Component {
	handleTyping(event) {
		var obj = {};
		obj[this.props.field] = event.target.value;
		this.props.handleTyping(obj);
	}
	render() {
		var field = this.props.field, value = this.props.value, placeholder = idToName(field), maxlength = "30";
		var isPassword = (field == "password");
		var type = isPassword ? "password" : "text";
		var content;
		switch(field) {
			case "first_name" :
				content = "Must contain only letters (1 to 12 characters)";
				maxlength = "12";
				break;
			case "last_name" :
				content = "Must contain only letters (1 to 12 characters)";
				maxlength = "12";
				break;
			case "password" :
				content = "Must contain at least one number and one letter";
				break;
			case "username" : 
				content = "Must be at least 2 characters (2 to 15 characters)";
				maxlength = "15";
				break;
			case "email_or_phone" :
				content = "Must be a valid email or phone number";
				break;
		}
		return (
			<div className="form-group">
				<input className={field + " register required form-control"} 
					data-placement="top" data-trigger="manual" data-content={content}
					id={field} type={type} value={value} placeholder={placeholder} maxlength={maxlength}
					onChange={this.handleTyping.bind(this)}/>
			</div>
			);
	}
}
