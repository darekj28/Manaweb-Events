var React = require('react');
export default class CommentFeedPostHeader extends React.Component {
	constructor(props) {
		super(props);
		this.scrollToDropdown = this.scrollToDropdown.bind(this);
	}
	scrollToDropdown(){
		var comment = document.getElementById('comment_' + this.props.comment.unique_id);
		var offset = comment.offsetTop - 250;
		$('#CommentFeed').animate({scrollTop : offset}, 300);
	}
	render() {
		return(
			<div id = {"comment_" + this.props.comment.unique_id} className="FeedPostHeader">
				<div className="pull-left name"><b>{this.props.name}</b></div>
				<div className="pull-left username text-muted">@{this.props.userID}</div>
				{!this.props.isOriginalPost && <div className="time pull-left text-muted">&#8226; {this.props.comment.time}</div>}
				{this.props.isOriginalPost && <div className="time pull-left text-muted">&#8226; {this.props.comment.timeString}</div>}
				<div className="pull-right">
					{(!this.props.isOriginalPost && (this.props.isAdmin || !this.props.isOP)) && 
					<div className="dropdown">
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" onClick={this.scrollToDropdown}>
			                <span className="glyphicon glyphicon-option-horizontal 
			                				pull-left CommentBottomIcon AppGlyphicon"></span>
			            </a>
			            <ul className="CommentDropdown pull-right dropdown-menu">
			              	{(this.props.isOP || this.props.isAdmin) && <li><a id="hce" href="#" onClick={this.props.handleCommentEdit}>Edit comment</a></li> }
			              	{(this.props.isOP || this.props.isAdmin) && <li><a id="hcd" href="#" onClick={this.props.handleCommentDelete}>Delete comment</a></li> }
			              	{(!this.props.isOP || this.props.isAdmin) && <li><a id="hcr" href="#" onClick={this.props.handleCommentReport}>Report comment</a></li> }
			            </ul>
		        	</div>
		        	}
				</div>
			</div>
			)
	}
}