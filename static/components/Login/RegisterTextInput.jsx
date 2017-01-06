var React = require('react');
export default class RegisterTextInput extends React.Component {
	handleTyping(event) {
		var obj = {};
		obj[this.props.field] = event.target.value;
		this.props.handleTyping(obj);
	}
	render() {
		var field = this.props.field, value = this.props.value, placeholder = idToName(field);
		var isPassword = (field == "password");
		var type = isPassword ? "password" : "text";
		var content;
		switch(field) {
			case "first_name" :
				content = "Must contain only letters";
				break;
			case "last_name" :
				content = "Must contain only letters";
				break;
			case "password" :
				content = "Must contain at least one number and one letter"
				break;
			case "username" : 
				content = "At least 2 characters";
				break;
		}
		return (
			<div className="form-group">
				<input className={field + " register required form-control"} 
					data-placement="left" data-trigger="manual" data-content={content}
					id={field} type={type} value={value} placeholder={placeholder}
					onChange={this.handleTyping.bind(this)}/>
			</div>
			);
	}
}
