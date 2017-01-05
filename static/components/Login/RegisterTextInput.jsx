var React = require('react');
export default class RegisterTextInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { valid : "", warning : "" };
	}
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
		else { 
			var isValid = testValid(field, event.target.value);
			this.setState({ valid : isValid, 
					warning : warningForField(field, event.target.value) });
		};
		this.props.handleBlur(field, isValid);
	}
	componentDidMount() {
		if (this.props.field == "phone_number")
			phoneHelper();
		if (this.props.field == "password") 
			passwordHelper();
	}
	verifyUsername(username) {
		var obj = { username : username };
		$.ajax({
			type: 'POST',
			url: '/registerUsername',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8',
		    success : function(res) {
		    	if (!res['error']) {
		    		this.setState({ valid : "valid" });
		    		this.props.handleBlur("username", "valid");
		    	}
		    	else {
		    		this.setState({ valid : "invalid", warning : res['error'] });
		    		this.props.handleBlur("username", "invalid");
		    	}
		    }.bind(this)
		});
	}
	verifyEmail(email_address) {
		var obj = { email_address : email_address };
		$.ajax({
			type: 'POST',
			url: '/registerEmail',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8',
		    success : function(res) {
		    	if (!res['error']) {
		    		this.setState({ valid : "valid" });
		    		this.props.handleBlur("email_address", "valid");
		    	}
		    	else {
		    		this.setState({ valid : "invalid", warning : res['error'] });
		    		this.props.handleBlur("email_address", "invalid");
		    	}
		    }.bind(this)
		});
	}
	render() {
		return (
			);
	}
}