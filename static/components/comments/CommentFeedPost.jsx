class CommentFeedPost extends React.Component {
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
		return (
			<li className="CommentFeedPost">
				<Avatar source={comment.avatar}/>
				<div className="PostSpace">
					<div className="row"><CommentFeedPostHeader name={comment.name} userID={comment.userID} time={comment.time}
												isOP={this.props.isOP} isAdmin={this.props.isAdmin} handleCommentEdit={this.handleCommentEdit}
												handleCommentDelete={this.handleCommentDelete} handleCommentReport={this.handleCommentReport}
												isOriginalPost={this.props.isOriginalPost}/></div>
					<div className="row"><CommentFeedPostBody content={comment.commentContent} isOriginalPost={this.props.isOriginalPost}/></div>
				</div>
			</li>)
	}
}