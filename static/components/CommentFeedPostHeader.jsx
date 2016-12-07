var React = require('react');
export default class CommentFeedPostHeader extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<div className="FeedPostHeader">
				<div className="pull-left name"><b>{this.props.name}</b></div>
				<div className="pull-left username text-muted">@{this.props.userID}</div>
				<div className="time pull-left text-muted">&#8226; {this.props.time}</div>
				<div className="pull-right">
					{!this.props.isOriginalPost && <div className="dropdown">
						<a href="#" className="dropdown-toggle" data-toggle="dropdown">
			                <span className="glyphicon glyphicon-option-horizontal 
			                				pull-left CommentBottomIcon AppGlyphicon"></span>
			            </a>
			            <ul className="CommentDropdown pull-right dropdown-menu">
			              	{(this.props.isOP || this.props.isAdmin) && <li><a href="#" onClick={this.props.handleCommentEdit}>Edit comment</a></li> }
			              	{(this.props.isOP || this.props.isAdmin) && <li><a href="#" onClick={this.props.handleCommentDelete}>Delete comment</a></li> }
			              	{!(this.props.isOP || this.props.isAdmin) && <li><a href="#" onClick={this.props.handleCommentReport}>Report comment</a></li> }
			            </ul>
		        	</div>}
				</div>
			</div>
			)
	}
}