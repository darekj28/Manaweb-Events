var React = require('react');
export default class EventName extends React.Component{
	render() {
		return(<div id="EventName" className="pull-left"><h1>{this.props.name}</h1></div>);
	}
}