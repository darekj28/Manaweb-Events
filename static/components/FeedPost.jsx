class FeedPost extends React.Component {	
	constructor(props) {
		super(props);
		this.state = {comment_id : this.props.post.comment_id};
		this.handlePostEdit = this.handlePostEdit.bind(this);
		this.handlePostDelete = this.handlePostDelete.bind(this);
		this.handlePostReport = this.handlePostReport.bind(this);
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
	componentDidMount() {
		var post = this.props.post;
		$('#viewComment_' + post.comment_id).click(function() {
			window.location.href = "/comment?id=" + this.state.comment_id;
		}.bind(this));
	}
	render() {
		var post = this.props.post;
		return (
			<li className="Post">
				<Avatar source={post.avatar}/>
				<div className="PostSpace">
					<div className="row"><FeedPostHeader name={post.name} userID={post.userID} handleFilterUser = {this.props.handleFilterUser} 
						isTrade={post.isTrade} isPlay={post.isPlay} isChill={post.isChill} time={post.time}/></div>
					<div className="row"><FeedPostBody content={post.postContent}/></div>
					<div className="PostFooter row">
						<span className="glyphicon glyphicon-comment pull-left PostBottomIcon AppGlyphicon" 
								id={"viewComment_" + this.state.comment_id}></span>
						<div className="dropdown">
							<a href="#" className="dropdown-toggle" data-toggle="dropdown">
				                <span className="glyphicon glyphicon-option-horizontal 
				                				pull-left PostBottomIcon AppGlyphicon"></span>
				            </a>
				            <ul className="PostDropdown pull-left dropdown-menu">
				              	{(this.props.isOP || this.props.isAdmin) && <li><a href="#" onClick={this.handlePostEdit}>Edit post</a></li> }
			              		{(this.props.isOP || this.props.isAdmin) && <li><a href="#" onClick={this.handlePostDelete}>Delete post</a></li> }
			              		{!(this.props.isOP || this.props.isAdmin) && <li><a href="#" onClick={this.handlePostReport}>Report post</a></li> }
				            </ul>
				        </div>
					</div>
				</div>
			</li>
		);
	}
}