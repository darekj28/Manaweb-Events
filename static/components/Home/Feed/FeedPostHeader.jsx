var React = require('react');
export default class FeedPostHeader extends React.Component {
	handleFilterUser() {
		this.props.handleFilterUser(this.props.post.userID);
	}
	render() {
		return(
			<div className="FeedPostHeader">
				{this.props.post.isChill && 
				<div className="postType pull-right">
					<span className="HeaderGlyphicon fa fa-snowflake-o"></span>
				</div>}
				{this.props.post.isTrade && <div className="postType pull-right">
					<span className="HeaderGlyphicon fa fa-handshake-o"></span>
				</div> }
				{this.props.post.isPlay && 
				<div className="postType pull-right">
					<span className="HeaderGlyphicon fa fa-play"></span>
				</div> } 				
				<div className="headerpart name" onClick={this.handleFilterUser.bind(this)}><b>{this.props.post.name}</b></div>
				{this.props.post.userID != "$DELETED_USER" && <div className="headerpart username text-muted">@{this.props.post.userID}</div>}
				<div className="headerpart time text-muted">&#8226; {this.props.post.time}</div>
			</div>
			)
	}
}