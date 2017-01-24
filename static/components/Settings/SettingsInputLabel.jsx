var React = require('react');

export default class SettingsInputLabel extends React.Component {
	render() {
		var label = idToName(this.props.field);
		if (this.props.field == "old_password") label = "Current password"; 
		return (
				<div><h4><b>{label}</b></h4></div>
			);
	}
}
