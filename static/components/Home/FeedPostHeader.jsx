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
					<span className="HeaderGlyphicon glyphicon glyphicon-time"></span>
				</div>}
				{this.props.post.isTrade && <div className="postType pull-right">
					<span className="HeaderGlyphicon glyphicon glyphicon-transfer"></span>
				</div> }
				{this.props.post.isPlay && 
				<div className="postType pull-right">
					<span className="HeaderGlyphicon glyphicon glyphicon-play"></span>
				</div> } 				
				<div className="headerpart name" onClick={this.handleFilterUser.bind(this)}><b>{this.props.post.name}</b></div>
				<div className="headerpart username text-muted">@{this.props.post.userID}</div>
				<div className="headerpart time text-muted">&#8226; {this.props.post.time}</div>
			</div>
			)
	}
}