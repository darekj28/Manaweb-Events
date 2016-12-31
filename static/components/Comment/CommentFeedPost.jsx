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
	scrollToDropdown(){
		$('html, body').animate({scrollTop : $("#commentdropdown_" + this.props.comment.unique_id).offset().top - 300}, 500);
	}
	render() {
		var comment = this.props.comment;
		var isOP = this.props.isOP;
		var isAdmin = this.props.isAdmin;
		var rowClass = this.props.isOriginalPost ? "CommentFeedPostOriginal" : "CommentFeedPost"; 
		return (
			<li className={rowClass}>
				<Avatar source={comment.avatar}/>
				<div className="PostSpace">
					<div className="row"><CommentFeedPostHeader comment={comment}
												isOriginalPost={this.props.isOriginalPost}/></div>
					<div className="row"><CommentFeedPostBody content={comment.commentContent} 
									isOriginalPost={this.props.isOriginalPost}/></div>
					<div className="PostFooter row">
						{(!this.props.isOriginalPost && (isAdmin || !isOP)) && 
						<div className="dropdown" id={"commentdropdown_" + comment.unique_id}>
							<a href="#" className="dropdown-toggle pull-right" 
										data-toggle="dropdown" onClick={this.scrollToDropdown.bind(this)}>
				                <span className="glyphicon glyphicon-option-horizontal 
				                				pull-right CommentBottomIcon AppGlyphicon"></span>
				            </a>
				            <ul className="CommentDropdown pull-right dropdown-menu">
				              	{(isOP || isAdmin) && 
				              		<li><a id="hce" onClick={this.handleCommentEdit.bind(this)}>Edit comment</a></li> }
				              	{(isOP || isAdmin) && 
				              		<li><a id="hcd" onClick={this.handleCommentDelete.bind(this)}>Delete comment</a></li> }
				              	{(!isOP || isAdmin) && 
				              		<li><a id="hcr" onClick={this.handleCommentReport.bind(this)}>Report comment</a></li> }
				            </ul>
			        	</div>}
					</div>
				</div>
			</li>)
	}
}