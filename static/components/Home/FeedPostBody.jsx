var React = require('react');
export default class FeedPostBody extends React.Component {
	render() {
		return(
			<div className="FeedPostBody">
				{this.props.content}
			</div>
		)
	}
}