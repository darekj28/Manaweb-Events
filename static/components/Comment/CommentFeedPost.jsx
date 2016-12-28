var React = require('react');
import CommentFeedPostHeader from "./CommentFeedPostHeader.jsx";
import CommentFeedPostBody from "./CommentFeedPostBody.jsx";
import Avatar from "../Home/Avatar.jsx";

export default class CommentFeedPost extends React.Component {
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
					<div className="row"><CommentFeedPostHeader comment={comment}
												isOP={this.props.isOP} isAdmin={this.props.isAdmin} 
												handleCommentEdit={this.handleCommentEdit.bind(this)}
												handleCommentDelete={this.handleCommentDelete.bind(this)} 
												handleCommentReport={this.handleCommentReport.bind(this)}
												isOriginalPost={this.props.isOriginalPost}/></div>
					<div className="row"><CommentFeedPostBody content={comment.commentContent} 
									isOriginalPost={this.props.isOriginalPost}/></div>
				</div>
			</li>)
	}
}