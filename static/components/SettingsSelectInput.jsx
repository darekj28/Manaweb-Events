var React = require('react');
export default class SettingsSelectInput extends React.Component {
	render() {
		return (
			<input className="setting" id={this.props.name} name="first_name" type="text" placeholder="First"/>
			);
	}
}