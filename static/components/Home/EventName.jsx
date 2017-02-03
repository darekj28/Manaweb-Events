var React = require('react');
export default class EventName extends React.Component{
	render() {
		return(
			<div id="EventName">
				<h1>{this.props.name.toUpperCase()}</h1> 
			</div>
		);
	}
}