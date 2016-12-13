var React = require('react');
var Link = require('react-router').Link;
// var $ = require('jquery');
import Avatar from "./Avatar.jsx";
import FeedPostHeader from "./FeedPostHeader.jsx";
import FeedPostBody from "./FeedPostBody.jsx";

export default class FeedPost extends React.Component {	
	constructor(props) {
		super(props);
		this.state = {comment_id : this.props.post.comment_id};
		this.handlePostEdit = this.handlePostEdit.bind(this);
		this.handlePostDelete = this.handlePostDelete.bind(this);
		this.handlePostReport = this.handlePostReport.bind(this);
		this.scrollToDropdown = this.scrollToDropdown.bind(this);
	}
	handlePostEdit() {
		this.props.refreshPostDisplayedInModal(this.props.post);
		$('#EditPostModal').modal('show');
	}
	handlePostDelete() {
		this.props.refreshPostDisplayedInModal(this.props.post);
		$('#DeletePostModal').modal('show'); 
	}
	handlePostReport() {
		this.props.refreshPostDisplayedInModal(this.props.post);
		$('#ReportPostModal').modal('show');
	}
	scrollToDropdown() {
		var post = document.getElementById('post_' + this.props.post.comment_id);
		var offset = post.offsetTop - 350;
		$('#Feed').animate({scrollTop : offset}, 500);
	}
	render() {
		var post = this.props.post;
		return (
			<li className="Post" id = {"post_" + post.comment_id}>
				<Avatar source={post.avatar}/>
				<div className="PostSpace">
					<div className="row"><FeedPostHeader post={this.props.post} 
						handleFilterUser = {this.props.handleFilterUser} 
						isAdmin={this.props.isAdmin} isOP={this.props.isOP}
						handlePostReport={this.handlePostReport}
						handlePostDelete={this.handlePostDelete}
						handlePostEdit={this.handlePostEdit}
						scrollToDropdown={this.scrollToDropdown}/></div>
					<div className="row"><FeedPostBody content={post.postContent}/></div>
					<div className="PostFooter row CommentContainer">
						<Link to={'/comment?id=' + this.state.comment_id}>
						<span className="glyphicon glyphicon-comment pull-left PostBottomIcon AppGlyphicon" 
								id={"viewComment_" + this.state.comment_id}>
								</span>
						<span className="numberOfComments pull-left AppGlyphicon"><h6>{post.numberOfComments}</h6></span>
						</Link>
					</div>
				</div>
			</li>
		);
	}
}