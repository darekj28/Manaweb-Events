var React = require('react');
export default class CommentFeedPostHeader extends React.Component {
	constructor(props) {
		super(props);
		this.scrollToDropdown = this.scrollToDropdown.bind(this);
	}


	scrollToDropdown(){
		
		var id_name = "comment_" + this.props.comment.unique_id;
		console.log(id_name);
		var x = document.getElementById(id_name)
		x.scrollIntoView()		
	}

	render() {


		

		return(
			<div id = {"comment_" + this.props.comment.unique_id} className="FeedPostHeader">
				<div className="pull-left name"><b>{this.props.name}</b></div>
				<div className="pull-left username text-muted">@{this.props.userID}</div>
				<div className="time pull-left text-muted">&#8226; {this.props.comment.time}</div>
				<div className="time pull-left text-muted">&#8226; {this.props.comment.timeString}</div>
				<div className="pull-right">
					{!this.props.isOriginalPost && <div className="dropdown">
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" onClick = {this.scrollToDropdown}>
			                <span className="glyphicon glyphicon-option-horizontal 
			                				pull-left CommentBottomIcon AppGlyphicon"></span>
			            </a>
			            <ul className="CommentDropdown pull-right dropdown-menu">
			              	{(this.props.isAdmin) && <li><a id="hce" href="#" onClick={this.props.handleCommentEdit}>Edit comment</a></li> }
			              	{(this.props.isOP || this.props.isAdmin) && <li><a id="hcd" href="#" onClick={this.props.handleCommentDelete}>Delete comment</a></li> }
			              	{(!this.props.isOP || this.props.isAdmin) && <li><a id="hcr" href="#" onClick={this.props.handleCommentReport}>Report comment</a></li> }
			            </ul>
		        	</div>}
				</div>
			</div>
			)
	}
}