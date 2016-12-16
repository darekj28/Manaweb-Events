var React = require('react');
import NoSearchNavBar from "NoSearchNavBar.jsx";
import NotificationsFeed from 'NotificationsFeed.jsx';

export default class NotificationsApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {currentUser : '',
					notifications : []};
		this.getCurrentUserInfo = this.getCurrentUserInfo.bind(this);
	}
	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', function(data) {
			this.setState({currentUser : data.thisUser});
		}.bind(this));
	}
	componentDidMount() {
		this.getCurrentUserInfo();
	}
	render() {
		var name = this.state.currentUser['first_name'] + " " + this.state.currentUser['last_name'];
		return (
			<div id="NotificationsApp">
				<NoSearchNavBar name={name} currentUser={this.state.currentUser}/>
				<div className="container">
					<h2>{name}'s Notifications</h2>
					<NotificationsFeed currentUser = {this.state.currentUser} notifications={this.state.notifications}/>		
				</div>	
			</div>
		);
	}
}