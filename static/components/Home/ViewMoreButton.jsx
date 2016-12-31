var React = require('react');

export default class ViewMoreButton extends React.Component {
	render() {
		var plural = this.props.numUnseenPosts > 1 ? "s" : "";
		return(
			<div id="ViewMoreButton" onClick={this.props.refreshFeed}>
				<center> View {this.props.numUnseenPosts} new post{plural} </center>
			</div>
			);
	}
}