var React = require('react');
export default class RegisterTextInput extends React.Component {
	handleTyping(event) {
		var obj = {};
		obj[this.props.field] = event.target.value;
		this.props.handleTyping(obj);
	}
	handleBlur(event) {
		var field = this.props.field;
		if (field == "username")
			this.verifyUsername.bind(this)(event.target.value);
		else if (field == "email_address")
			this.verifyEmail.bind(this)(event.target.value);
	}
	componentDidMount() {
		if (this.props.field == "password") 
			passwordHelper();
	}
	render() {
		var field = this.props.field, value = this.props.value;
		var isPassword = (field == "password");
		var type = isPassword ? "password" : "text";
		var content;
		switch(this.props.field) {
			case "first_name" :
				content = "At least 1 character and only contain letters";
				break;
			case "last_name" :
				content = "At least 1 character and only contain letters";
				break;
			case "password" :
				content = "At least 6 characters and contain at least one number and one letter."
				break;
			case "email_address" :
				content = "Give a valid e-mail address";
				break;
			case "username" : 
				content = "At least 4 characters long";
				break;
		}
		return (
			<div className="form-group">
				<input className={field + " register required form-control"} 
					data-placement="right" data-trigger="manual" data-content={content}
					id={field} type={type} value={value} placeholder={idToName(field)}
					onChange={this.handleTyping.bind(this)}/>
			</div>
			);
	}
}
