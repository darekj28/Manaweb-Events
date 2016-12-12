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

	scrollToDropdown(){

		console.log("bob");
		var id_name = "post_" + this.props.post.comment_id
		var x = document.getElementById(id_name)
		x.scrollIntoView()

		
	}
	
	render() {
		var post = this.props.post;
		return (
			<li className="Post" id = {"post_" + post.comment_id}>
				<Avatar source={post.avatar}/>
				<div className="PostSpace">
					<div className="row"><FeedPostHeader name={post.name} userID={post.userID} handleFilterUser = {this.props.handleFilterUser} 
						isTrade={post.isTrade} isPlay={post.isPlay} isChill={post.isChill} time={post.time}/></div>
					<div className="row"><FeedPostBody content={post.postContent}/></div>
					<div className="PostFooter row">
						<Link to={'/comment?id=' + this.state.comment_id}>
						<span className="glyphicon glyphicon-comment pull-left PostBottomIcon AppGlyphicon" 
								id={"viewComment_" + this.state.comment_id}>
								</span></Link>
						<div> {post.numberOfComments} </div>

						<div className="dropdown" >
							<a href="#" className="dropdown-toggle" data-toggle="dropdown" onClick = {this.scrollToDropdown} >
				                <span className="glyphicon glyphicon-option-horizontal 
				                				pull-left PostBottomIcon AppGlyphicon"></span>
				            </a>
				            <ul className="PostDropdown pull-left dropdown-menu">
				              	{(this.props.isAdmin) && <li><a id="hpe" href="#" onClick={this.handlePostEdit}>Edit post</a></li> }
			              		{(this.props.isAdmin) && <li><a id="hpd" href="#" onClick={this.handlePostDelete}>Delete post</a></li> }
			              		{(!this.props.isOP || this.props.isAdmin) && <li><a id="hpr" href="#" onClick={this.handlePostReport}>Report post</a></li> }
				            </ul>
				        </div>
					</div>
				</div>
			</li>
		);
	}
}