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
		var tpc = "";
		if (this.props.post.isTrade) tpc = tpc.concat(' Trade ');
		if (this.props.post.isPlay)  tpc = tpc.concat(' Play ');
		if (this.props.post.isChill) tpc = tpc.concat(' Chill ');
		return(
			<div className="FeedPostHeader">
				<div className="tpc pull-right">{tpc}</div> 
				<div className="headerpart name" onClick={this.handleFilterUser}><b>{this.props.post.name}</b></div>
				<div className="headerpart username text-muted" onClick={this.handleFilterUser}>@{this.props.post.userID}</div>
				<div className="headerpart time text-muted">&#8226; {this.props.post.time}</div>
			</div>
			)
	}
}