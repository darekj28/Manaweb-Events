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
	handleBlur() {
		this.props.handleBlur(ableToSubmit);
	}
	render() {
		var type = (this.props.id == "password" || this.props.id == "password_confirm") ? "password" : "text";
		return (
			<div>
				<div className="form-group">
					<input className="setting" id={this.props.id} type={type} 
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