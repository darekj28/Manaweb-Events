var React = require('react');

export default class SettingsInputLabel extends React.Component {
	render() {
		return (
				<div><b>{idToName(this.props.field)}</b></div>
			);
	}
}
