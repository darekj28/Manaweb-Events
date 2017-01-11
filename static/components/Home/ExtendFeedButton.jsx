var React = require('react');
export default class ExtendFeedButton extends React.Component {
	render() {
		var plural = this.props.numMorePosts > 1 ? "s" : "";
		return (
			<div className="add-to-feed" id="ExtendFeedButton" 
					onClick={this.props.extendFeed}>
				<center> Show {this.props.numMorePosts} more post{plural} </center>
			</div>
			);
	}
}