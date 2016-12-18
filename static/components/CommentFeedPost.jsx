var React = require('react');
import CommentFeedPostHeader from "./CommentFeedPostHeader.jsx";
import CommentFeedPostBody from "./CommentFeedPostBody.jsx";
import Avatar from "./Avatar.jsx";
// var $ = require('jquery');

export default class CommentFeedPost extends React.Component {
	constructor(props) {
		super(props);
		this.handleCommentEdit = this.handleCommentEdit.bind(this);
		this.handleCommentDelete = this.handleCommentDelete.bind(this);
		this.handleCommentReport = this.handleCommentReport.bind(this);
	}

	handleCommentEdit() {
		this.props.refreshCommentDisplayedInModal(this.props.comment);
		$('#EditCommentModal').modal('show');
	}
	handleCommentDelete() {
		this.props.refreshCommentDisplayedInModal(this.props.comment);
		$('#DeleteCommentModal').modal('show'); 
	}
	handleCommentReport() {
		this.props.refreshCommentDisplayedInModal(this.props.comment);
		$('#ReportCommentModal').modal('show');
	}
	render() {
		var comment = this.props.comment;
		var rowClass = this.props.isOriginalPost ? "CommentFeedPostOriginal" : "CommentFeedPost"; 
		return (
			<li className={rowClass}>
				<Avatar source={comment.avatar}/>
				<div className="PostSpace">
					<div className="row"><CommentFeedPostHeader comment = {this.props.comment}
												isOP={this.props.isOP} isAdmin={this.props.isAdmin} handleCommentEdit={this.handleCommentEdit}
												handleCommentDelete={this.handleCommentDelete} handleCommentReport={this.handleCommentReport}
												isOriginalPost={this.props.isOriginalPost}/></div>
					<div className="row"><CommentFeedPostBody content={comment.commentContent} isOriginalPost={this.props.isOriginalPost}/></div>
				</div>
			</li>)
	}
}