var React = require('react');
var Link = require('react-router').Link;
export default class NotificationsDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            notifications : [],
            newNotificaitons: ''
         };
        this.refreshNotifications = this.refreshNotifications.bind(this);
        this.seeNotifications = this.seeNotifications.bind(this);
        this.generateNotificationFeed = this.generateNotificationFeed.bind(this);
    }
    refreshNotifications() {
        $.post('/getNotifications', {userID : this.props.currentUser.userID}, 
            function(data) {
                var notifications = [];
                var count = 0;
                    data.notification_list.map(function(obj) {
                        if (obj['seen'] == false) count = count + 1; 
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
                this.setState({newNotificaitons: String(count)})
            }.bind(this));
    }
    seeNotifications() {
        this.state.notifications.map(function (obj){
            $.post('/seeNotifications', {notification_id: obj['notification_id']})
        });
    }
    componentDidMount() {
        this.refreshNotifications();
    }
    generateNotificationFeed(){
        var notification_feed = [];
        for (var note in this.state.notifications){
            notification_feed.unshift(
                <li> <a href = {"/comment?id=" + note.comment_id}> {note.action +  " at " + note.timeString}  </a> </li>
            )
        }
    }
	render() { 
        var notification_feed = this.generateNotificationFeed()
		return (
			<li className="dropdown">
                <a href="#" className="SearchNavBarGlyphicon dropdown-toggle" data-toggle="dropdown" onClick = {this.seeNotifications}>
                    <span className="glyphicon glyphicon-envelope"></span>
                </a>
                <ul className="dropdown-menu">
                    
                    <li><Link to="/notifications"><center>See All</center></Link></li>
                    }
                </ul>
            </li>
		);
	}
}