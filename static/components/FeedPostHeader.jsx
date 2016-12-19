var React = require('react');
export default class FeedPostHeader extends React.Component {
	constructor(props) {
		super(props);
		this.handleFilterUser = this.handleFilterUser.bind(this);
	}
	handleFilterUser() {
		this.props.handleFilterUser(this.props.post.userID);
	}
	render() {
		var postType = "";
		if (this.props.post.isTrade) postType = postType.concat(' trade ');
		if (this.props.post.isPlay)  postType = postType.concat(' play ');
		if (this.props.post.isChill) postType = postType.concat(' chill ');
		return(
			<div className="FeedPostHeader">
				<div className="postType pull-right">{postType}</div> 
				<div className="headerpart name" onClick={this.handleFilterUser}><b>{this.props.post.name}</b></div>
				<div className="headerpart username text-muted">@{this.props.post.userID}</div>
				<div className="headerpart time text-muted">&#8226; {this.props.post.time}</div>
			</div>
			)
	}
}