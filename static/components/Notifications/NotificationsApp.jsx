var React = require('react');
import NoSearchNavBar from "../GenericNavBar/NoSearchNavBar.jsx";
import NotificationsFeed from './NotificationsFeed.jsx';

export default class NotificationsApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser : '',
            notifications : []
        };
	}
	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', function(data) {
			this.setState({currentUser : data.thisUser});
		}.bind(this));
	}
	getNotifications() {
        $.post('/getNotifications', 
            function(data) {
                var notifications = [];
                var count = 0;
                data.notification_list.map(function(obj) {
                    if (!obj['seen']) count++; 
                    notifications.unshift({
                        comment_id : obj['comment_id'],
                        notification_id : obj['notification_id'],
                        timeString : obj['timeString'],
                        sender_id : obj['sender_id'],
                        action : obj['action'],
                        receiver_id : obj['receiver_id'],
                        seen : obj['seen']
                    });
                });
                this.setState({notifications : notifications});
            }.bind(this));
    }
	componentDidMount() {
		this.getNotifications.bind(this)();
		this.getCurrentUserInfo.bind(this)();
	}
	render() {
		var name = this.state.currentUser['first_name'] + " " + this.state.currentUser['last_name'];
		return (
			<div id="NotificationsApp">
				<NoSearchNavBar currentUser={this.state.currentUser} name={name}/>
				<div className="container app-container">
					{this.state.currentUser['first_name'] != undefined && 
						<h2>{name}'s Notifications</h2>}
					<NotificationsFeed notifications={this.state.notifications}/>		
				</div>	
			</div>
		);
	}
}