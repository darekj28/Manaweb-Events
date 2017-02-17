var React = require('react');
import CommentFeedPostHeader from "./CommentFeedPostHeader.jsx";
import CommentFeedPostBody from "./CommentFeedPostBody.jsx";
import Avatar from "../Home/Feed/Avatar.jsx";

export default class CommentFeedPost extends React.Component {
	handleCommentEdit() {
		this.props.refreshCommentDisplayedInModal(this.props.comment);
		$('#EditCommentModal').modal('show');
	}
	handleCommentDelete() {
		var callback = function() {
			swal({title : "Success!", 
						text: "The comment has been deleted.", 
						type: "success",
						confirmButtonColor: "#80CCEE",
		  				confirmButtonText: "OK"
					});
		}
		swal({
	      	title: "Are you sure you want to delete this comment?", 
		    showCancelButton: true,
	      	closeOnConfirm: false,
	      	confirmButtonText: "Yes, I'm sure!",
	      	confirmButtonColor: "#80CCEE"}, 
	    	function() {
	    	var obj = {feed_name : "BALT", 
					comment_id : this.props.comment.comment_id,
					unique_id : this.props.comment.unique_id}
			$.ajax({
				type : 'POST',
				url  : '/deleteComment',
				data : JSON.stringify(obj, null, '\t'),
				contentType: 'application/json;charset=UTF-8',
				success: function(data) {
					if (data['result'] == 'success')
						this.props.handleCommentDelete(this.props.comment, callback);
					else
						swal({title : "Sorry!", 
							text: "This comment was already deleted.", 
							type: "error",
							confirmButtonColor: "#80CCEE",
							confirmButtonText: "OK"
						});
				}.bind(this)
			});
	    }.bind(this));
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
						{!this.props.isOriginalPost && <div className="dropdown" id={"commentdropdown_" + comment.unique_id}>
							<a href="#" className="dropdown-toggle pull-right" 
										data-toggle="dropdown" onClick={this.scrollToDropdown.bind(this)}>
				                <span className="glyphicon glyphicon-option-horizontal 
				                				pull-right CommentBottomIcon AppGlyphicon"></span>
				            </a>
				            
				            <ul className="CommentDropdown pull-right dropdown-menu">
				            	<li><a id="hcr" onClick={this.handleCommentReport.bind(this)}><span className="fa fa-exclamation-circle modal-icon-report"/>Report comment</a></li>
				              	{(isOP || isAdmin) && <li><a id="hce" onClick={this.handleCommentEdit.bind(this)}><span className="fa fa-pencil-square-o modal-icon-edit"/>Edit comment</a></li> }
				              	{(isOP || isAdmin) && <li><a id="hcd" onClick={this.handleCommentDelete.bind(this)}><span className="fa fa-trash-o modal-icon-delete"/>Delete comment</a></li> }
				            </ul>
			        	</div>}
			        	{this.props.isOriginalPost && 
			        	<div className="original-post-time headerpart time pull-left text-muted">{comment.timeString}</div>}
					</div>
				</div>
			</li>)
	}
}