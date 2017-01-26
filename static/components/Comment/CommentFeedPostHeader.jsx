var React = require('react');
export default class CommentFeedPostHeader extends React.Component {
	render() {
		return(
			<div id = {"comment_" + this.props.comment.unique_id} className="FeedPostHeader">
				{this.props.comment.name != undefined && 
				<div className="headerpart pull-left"><b>{this.props.comment.name}</b></div> }
				{this.props.comment.name != undefined && 
				<div className="headerpart pull-left username text-muted">@{this.props.comment.userID}</div>}
				{!this.props.isOriginalPost && 
				<div className="headerpart time pull-left text-muted">&#8226; {this.props.comment.time}</div>}
			</div>
		)
	}
}