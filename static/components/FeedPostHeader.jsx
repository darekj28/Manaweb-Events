class FeedPostHeader extends React.Component {
	constructor(props) {
		super(props);
		this.handleFilterUser = this.handleFilterUser.bind(this);
	}
	handleFilterUser() {
		this.props.handleFilterUser(this.props.userID);
	}
	render() {
		var tpc = "";
		if (this.props.isTrade) tpc = tpc.concat(' Trade ');
		if (this.props.isPlay)  tpc = tpc.concat(' Play ');
		if (this.props.isChill) tpc = tpc.concat(' Chill ');
		return(
			<div className="FeedPostHeader">
				<div className="tpc pull-right"><kbd>{tpc}</kbd></div> 
				<div className="headerpart name" onClick={this.handleFilterUser}><b>{this.props.name}</b></div>
				<div className="headerpart username text-muted" onClick={this.handleFilterUser}>@{this.props.userID}</div>
				<div className="headerpart time text-muted">&#8226; {this.props.time}</div>
			</div>
			)
	}
}