var React = require('react');
export default class EventName extends React.Component{
	render() {
		return(

			<div id="EventName" className="pull-left">
				{this.props.numUnseenPosts == -1 ?
					<h1>{this.props.name}  </h1> :
					<h1>{this.props.name} <small> {this.props.numUnseenPosts} unseen posts </small> </h1> 
				}
			</div>);
	}
}