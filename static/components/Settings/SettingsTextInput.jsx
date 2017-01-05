var React = require('react');
import AppStore from '../../stores/AppStore.jsx';

export default class SettingsTextInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { valid : "", warning : "", hasMounted : false };
	}
	verifyOldPassword(password) {
		var obj = { password : password, currentUser : AppStore.getCurrentUser() };
		$.ajax({
			type: 'POST',
			url: '/verifyOldPassword',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8',
		    success : function(res) {
		    	if (!res['error']) {
		    		this.setState({ valid : "valid" });
					this.props.handleBlur("old_password", "valid");
		    	}
		    	else {
		    		this.setState({ valid : "invalid", 
		    			warning : warningForField("old_password", password) });
					this.props.handleBlur("old_password", "invalid");
		    	}
		    }.bind(this)
		});
	}
	handleTyping(event) {
		var obj = {};
		obj[this.props.field] = event.target.value;
		this.props.handleTyping(obj);
	}
	handleBlur(event) {
		var field = this.props.field;
		if (field == "old_password")
			this.verifyOldPassword.bind(this)(event.target.value);
		else { 
			var isValid = testValid(field, event.target.value);
			this.setState({ valid : isValid, 
					warning : warningForField(field, event.target.value) });
		};
		this.props.handleBlur(field, isValid);
	}
	componentWillReceiveProps(nextProps) {
		if (!this.state.hasMounted) {
			var isValid = testValid(nextProps.field, nextProps.value); 
			if (isValid == "valid" && nextProps.field != "old_password") {
				this.setState({ valid : isValid, hasMounted : true });
				this.props.handleBlur(nextProps.field, isValid);
			}
			else 
				this.setState({ hasMounted : true });
		}
	}
	componentDidMount() {
		if (this.props.field == "phone_number")
			phoneHelper();
		if (this.props.field == "password") 
			passwordHelper();
	}

	render() {
		var field = this.props.field;
		var value = this.props.value;
		var isPassword = (field == "password" || field == "old_password");
		var type = isPassword ? "password" : "text";
		var placeholder = field == "old_password" ? "Enter your old password" : idToName(field);
		return (
				<div>
					{field != "password" && <input className={"setting form-control " + this.state.valid} 
						id={field} type={type} value={value} placeholder={placeholder}
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}/>}
					{field == "password" && <input data-toggle="popover" data-trigger="focus" 
						data-content="Your password must contain at least one letter and one number."
						className={"setting form-control " + this.state.valid} id={field} type={type} value={value} 
						onClick={focus()} placeholder={idToName(field)}
						onChange={this.handleTyping.bind(this)} onBlur={this.handleBlur.bind(this)}/>}
					{(this.state.valid == "invalid") && 
					<div className="warning" id={field + "_warning"}>{this.state.warning}</div>}				
				</div>
			);
	}
}
