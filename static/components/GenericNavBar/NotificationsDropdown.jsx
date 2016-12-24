var React = require('react');
var Link = require('react-router').Link;
export default class NotificationsDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications : [],
            numUnseen : ''
        };
        this.getNotifications = this.getNotifications.bind(this);
        this.seeNotification = this.seeNotification.bind(this);
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
                this.setState({numUnseen: String(count)});
            }.bind(this));
        this.seeNotification();
    }
    seeNotification() {
        this.state.notifications.map(function (obj){
            $.post('/seeNotification', {notification_id: obj['notification_id']})
        });
    }
    componentDidMount() {
        this.getNotifications();
    }
	render() { 
		return (
			<li className="dropdown">
                <a href="#" className="SearchNavBarGlyphicon dropdown-toggle" data-toggle="dropdown">
                    <span className="glyphicon glyphicon-envelope"></span>
                </a>
                <ul className="dropdown-menu">
                    {this.state.notifications.map(function(note, i) {
                        return (<li key={i}>
                                    <Link to={"/comment/" + note.comment_id}> 
                                        {note.action +  " at " + note.timeString}
                                    </Link>
                                </li>);
                    })}
                    <li><Link to="/notifications"><center>See All</center></Link></li>
                </ul>
            </li>
		);
	}
}