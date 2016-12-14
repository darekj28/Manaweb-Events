var React = require('react');
export default class FeedPostHeader extends React.Component {
	constructor(props) {
		super(props);
		this.handleFilterUser = this.handleFilterUser.bind(this);
	}
	handleFilterUser() {
		this.props.handleFilterUser(this.props.userID);
	}
	render() {
		var tpc = "";
		if (this.props.post.isTrade) tpc = tpc.concat(' Trade ');
		if (this.props.post.isPlay)  tpc = tpc.concat(' Play ');
		if (this.props.post.isChill) tpc = tpc.concat(' Chill ');
		return(
			<div className="FeedPostHeader">
				<div className="tpc pull-right"><kbd>{tpc}</kbd></div> 
				<div className="headerpart name" onClick={this.handleFilterUser}><b>{this.props.post.name}</b></div>
				<div className="headerpart username text-muted" onClick={this.handleFilterUser}>@{this.props.post.userID}</div>
				<div className="headerpart time text-muted">&#8226; {this.props.post.time}</div>
				{ (this.props.isAdmin || !this.props.isOP) && 
						<div className="dropdown pull-left" id={"dropdown_" + this.props.post.comment_id} onClick={this.props.scrollToDropdown}>
							<a href="#" className="dropdown-toggle" data-toggle="dropdown">
				                <span className="glyphicon glyphicon-option-horizontal 
				                				pull-left AppGlyphicon"></span>
				            </a>
				            <ul className="PostDropdown pull-left dropdown-menu">
				              	{(this.props.isAdmin) && <li><a id="hpe" href="#" onClick={this.props.handlePostEdit}>Edit post</a></li> }
			              		{(this.props.isAdmin) && <li><a id="hpd" href="#" onClick={this.props.handlePostDelete}>Delete post</a></li> }
			              		{(!this.props.isOP || this.props.isAdmin) && <li><a id="hpr" href="#" onClick={this.props.handlePostReport}>Report post</a></li> }
				            </ul>
				        
				        </div>
				  	  }	
			</div>
			)
	}
}