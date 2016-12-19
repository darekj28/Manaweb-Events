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
	componentWillReceiveProps(nextProps) {
		this.setState({ comment_id : nextProps.post.comment_id });
	}
	scrollToDropdown() {
		var post = document.getElementById('post_' + this.props.post.comment_id);
		var offset = post.offsetTop - 300;
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
						isAdmin={this.props.isAdmin} isOP={this.props.isOP}/></div>
					<div className="row"><FeedPostBody content={post.postContent}/></div>
					<div className="PostFooter row">
						<div className="CommentContainer">
						<Link to={'/comment/' + this.state.comment_id}>
						<span className="glyphicon glyphicon-comment pull-left PostBottomIcon AppGlyphicon" 
								id={"viewComment_" + this.state.comment_id}>
								</span>
						<span className="numberOfComments pull-left AppGlyphicon"><h6>{post.numberOfComments}</h6></span>
						</Link>
						</div>
						{ (this.props.isAdmin || !this.props.isOP) && 
						<div className="dropdown pull-right" id={"dropdown_" + this.props.post.comment_id} onClick={this.scrollToDropdown}>
							<a href="#" className="dropdown-toggle" data-toggle="dropdown">
				                <span className="glyphicon glyphicon-option-horizontal 
				                				pull-right PostBottomIcon AppGlyphicon"></span>
				            </a>
				            <ul className="PostDropdown pull-right dropdown-menu">
				              	{(this.props.isAdmin) && <li><a id="hpe" href="#" onClick={this.handlePostEdit}>Edit post</a></li> }
			              		{(this.props.isAdmin) && <li><a id="hpd" href="#" onClick={this.handlePostDelete}>Delete post</a></li> }
			              		{(!this.props.isOP || this.props.isAdmin) && <li><a id="hpr" href="#" onClick={this.handlePostReport}>Report post</a></li> }
				            </ul>
				        </div>}	
					</div>
				</div>
			</li>
		);
	}
}