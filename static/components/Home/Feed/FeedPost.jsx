var React = require('react');
var Link = require('react-router').Link;
import Avatar from "./Avatar.jsx";
import AppStore from '../../../stores/AppStore.jsx';
import FeedPostHeader from "./FeedPostHeader.jsx";
import FeedPostBody from "./FeedPostBody.jsx";

export default class FeedPost extends React.Component {	
	constructor(props) {
		super(props);
		this.state = {comment_id : this.props.post.comment_id};
	}
	handlePostEdit() {
		this.props.refreshPostDisplayedInModal(this.props.post);
		$('#EditPostModal').modal('show');
	}
	handlePostDelete() {
		var callback = function() {
			swal({title : "Success!", 
						text: "The post has been deleted.", 
						type: "success",
						confirmButtonColor: "#80CCEE",
		  				confirmButtonText: "OK"
					});
		}
		swal({
	      	title: "Are you sure you want to delete this post?", 
		    showCancelButton: true,
	      	closeOnConfirm: false,
	      	confirmButtonText: "Yes, I'm sure!",
	      	confirmButtonColor: "#80CCEE"}, 
	    	function() {
	    	var obj = {
	    			userID : AppStore.getCurrentUser()['userID'],
	    			unique_id : this.props.post.unique_id,
					jwt: localStorage.jwt};
			$.ajax({
				type : 'POST',
				url  : '/deletePost',
				data : JSON.stringify(obj, null, '\t'),
				contentType: 'application/json;charset=UTF-8',
				success: function(data) {
					if (data['result'] == 'success')
						this.props.handlePostDelete(this.props.post, callback);
					else
						swal({title : "Sorry!", 
							text: "This post was already deleted.", 
							type: "error",
							confirmButtonColor: "#80CCEE",
								confirmButtonText: "OK"
						});
				}.bind(this)
			});
	    }.bind(this));
	}
	handlePostReport() {
		this.props.refreshPostDisplayedInModal(this.props.post);
		$('#ReportPostModal').modal('show');
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ comment_id : nextProps.post.comment_id });
	}
	scrollToDropdown() {
		var post = document.getElementById('dropdown_' + this.props.post.comment_id);
		var offset = post.offsetTop - 300;
		$('html, body').animate({scrollTop : offset}, 500);
	}
	render() {
		var post = this.props.post;
		var isOP = this.props.isOP;
		var isAdmin = this.props.isAdmin;
		var reply = post.numberOfComments == 0 || post.numberOfComments > 1 ? "replies" : "reply";
		return (
			<li className="Post" id = {"post_" + post.comment_id}>
				<Avatar source={post.avatar}/>
				<div className="PostSpace">
					<div className="row"><FeedPostHeader post={this.props.post} 
						handleFilterUser = {this.props.handleFilterUser} 
						isAdmin={isAdmin} isOP={isOP}/></div>
					<div className="row"><FeedPostBody content={post.postContent}/></div>
					<div className="PostFooter row">
						<div className="CommentContainer">
							<Link to={'/comment/' + this.state.comment_id}>
							<span className="glyphicon glyphicon-comment pull-left PostBottomIcon AppGlyphicon" 
									id={"viewComment_" + this.state.comment_id}>
									</span>
							{post.numberOfComments > 0 && <span className="numberOfComments pull-left AppGlyphicon"><h6>{post.numberOfComments} {reply}</h6></span>}
							{post.numberOfComments == 0 && <span className="noComments pull-left"><h6>Be the first to comment!</h6></span>}
							</Link>
						</div>
						<div className="dropdown pull-right" id={"dropdown_" + post.comment_id} onClick={this.scrollToDropdown.bind(this)}>
							<a href="#" className="dropdown-toggle" data-toggle="dropdown">
				                <span className="glyphicon glyphicon-option-horizontal 
				                				pull-right PostBottomIcon AppGlyphicon"></span>
				            </a>
				            <ul className="PostDropdown pull-right dropdown-menu">
				            	<li><a id="hpr" onClick={this.handlePostReport.bind(this)}><span className="fa fa-exclamation-circle modal-icon-report"/>Report post</a></li>
				              	{(isOP || isAdmin) && <li><a id="hpe" onClick={this.handlePostEdit.bind(this)}><span className="fa fa-pencil-square-o modal-icon-edit"/>Edit post</a></li> }
			              		{(isOP || isAdmin) && <li><a id="hpd" onClick={this.handlePostDelete.bind(this)}><span className="fa fa-trash-o modal-icon-delete"/>Delete post</a></li> }
				            </ul>
				        </div>
					</div>
				</div>
			</li>
		);
	}
}