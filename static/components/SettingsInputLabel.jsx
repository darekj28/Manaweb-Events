var React = require('react');
function idToName (id) {
	var arr = id.split('_');
	var str = "";
	var temp;
	for (var i = 0; i < arr.length; i++){
		temp = arr[i].charAt(0).toUpperCase() + arr[i].substr(1).toLowerCase();
		str = str.concat(temp + ' ');
	}
	return str;
}
export default class SettingsInputLabel extends React.Component {
	render() {
		return (
			<div className="form-group">
				<label className="control-label" for={this.props.id}>{idToName(this.props.id)}</label>
			</div>
			);
	}
}