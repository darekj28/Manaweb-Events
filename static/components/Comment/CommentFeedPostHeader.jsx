var React = require('react');
export default class CommentFeedPostHeader extends React.Component {
	constructor(props) {
		super(props);
		this.scrollToDropdown = this.scrollToDropdown.bind(this);
	}
	scrollToDropdown(){
		$('html, body').animate({scrollTop : $("#commentdropdown_" + this.props.comment.unique_id).offset().top - 300}, 500);
	}
	render() {
		return(
			<div id = {"comment_" + this.props.comment.unique_id} className="FeedPostHeader">
				{this.props.comment.name != undefined && 
				<div className="headerpart pull-left"><b>{this.props.comment.name}</b></div> }
				{this.props.comment.name != undefined && 
				<div className="headerpart pull-left username text-muted">@{this.props.comment.userID}</div>}
				{!this.props.isOriginalPost && 
				<div className="headerpart time pull-left text-muted">&#8226; {this.props.comment.time}</div>}
				{(this.props.comment.name != undefined && this.props.isOriginalPost) && 
				<div className="headerpart time pull-left text-muted">&#8226; {this.props.comment.timeString}</div>}
				{(!this.props.isOriginalPost && (this.props.isAdmin || !this.props.isOP)) && 
				<div className="dropdown" id={"commentdropdown_" + this.props.comment.unique_id}>
					<a href="#" className="dropdown-toggle pull-right" 
								data-toggle="dropdown" onClick={this.scrollToDropdown}>
		                <span className="glyphicon glyphicon-option-horizontal 
		                				pull-right CommentBottomIcon AppGlyphicon"></span>
		            </a>
		            <ul className="CommentDropdown pull-right dropdown-menu">
		              	{(this.props.isOP || this.props.isAdmin) && 
		              		<li><a id="hce" onClick={this.props.handleCommentEdit}>Edit comment</a></li> }
		              	{(this.props.isOP || this.props.isAdmin) && 
		              		<li><a id="hcd" onClick={this.props.handleCommentDelete}>Delete comment</a></li> }
		              	{(!this.props.isOP || this.props.isAdmin) && 
		              		<li><a id="hcr" onClick={this.props.handleCommentReport}>Report comment</a></li> }
		            </ul>
	        	</div>}
			</div>
		)
	}
}