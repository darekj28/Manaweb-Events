var React = require('react');
var Link = require('react-router').Link;
var Pusher = require('pusher-js');
import AppStore from '../../stores/AppStore.jsx';
import AppActions from '../../actions/AppActions.jsx';
function getNotificationFirst(note) {
    var also; var notification;
    if (note.isOP) { 
        also = "";
    }
    else {
        also = " also";
    }
    if (note.numOtherPeople > 1)
        notification = note.sender_name + " and " + note.numOtherPeople + " other people commented on "
    else if (note.numOtherPeople == 1)
        notification = note.sender_name + " and 1 other person commented on "
    else 
        notification = note.sender_name + also + " commented on "
    return notification;
}
function getNotificationSecond(note) {
    var whose;
    if (note.isOP) { 
        whose = "your";
    }
    else {
        whose = note.op_name + "'s";
    }
    return whose + " post";
}
export default class NotificationsDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications : AppStore.getNotifications().slice(0, 5),
            numUnseen : AppStore.getNotificationCount()
        };
    }
    seeNotifications() {
        AppActions.deleteNotificationCount();
        $.post('/seeNotifications', {currentUser : AppStore.getCurrentUser()});
    }
    // getNotificationCount() {
    //     $.post('/getNotificationCount', {currentUser : AppStore.getCurrentUser(), numUnseen : AppStore.getNotificationCount()},
    //         function(data) {
    //             AppActions.addNotificationCount(data.count);
    //             this.setState({ timer : setTimeout(this.getNotificationCount.bind(this), 1000) })
    //         }.bind(this));
    // }
    getNotifications() {
        $.post('/getNotifications', {currentUser : AppStore.getCurrentUser()},
            function(data) {
                var notifications = [];
                data.notification_list.map(function(obj) {
                    notifications.unshift({
                        comment_id : obj['comment_id'],
                        timeString : obj['timeString'],
                        isOP : obj['isOP'],
                        numOtherPeople : obj['numOtherPeople'],
                        sender_name : obj['sender_name'],
                        op_name : obj['op_name'],
                        avatar : obj['avatar']
                    });
                });
                AppActions.addNotifications(notifications);
            }.bind(this));
    }
    componentDidMount() {
        AppStore.addNoteChangeListener(this._onChange.bind(this));
        // this.getNotificationCount.bind(this)();
        this.notificationService.bind('new_notification_for_' + AppStore.getCurrentUser()['userID'], function(message) {
            AppActions.addNotificationCount(this.state.numUnseen + 1);
            this.getNotifications.bind(this)();
        }, this);
    }
    componentWillMount() {
        this.pusher = new Pusher('1e44533e001e6236ca17');
        this.notificationService = this.pusher.subscribe('notifications');
    }
    componentWillUnmount() {
        clearTimeout(this.state.timer);
        AppStore.removeNoteChangeListener(this._onChange.bind(this));
    }
    _onChange() {
        this.setState({ notifications : AppStore.getNotifications().slice(0, 5), 
                            numUnseen : AppStore.getNotificationCount() })
    }
	render() { 
		return (
			<li className="dropdown">
                <a href="#" onClick={this.seeNotifications.bind(this)} 
                    className="SearchNavBarGlyphicon dropdown-toggle" data-toggle="dropdown">
                    <span className="glyphicon glyphicon-envelope"></span>
                    {this.state.numUnseen > 0 && <span className="badge badge-notify">{this.state.numUnseen}</span>}
                </a>
                <ul className="dropdown-menu">
                    {this.state.notifications.map(function(note, i) {
                        return (<li key={i}>
                                    <Link to={"/comment/" + note.comment_id}> 
                                        {getNotificationFirst(note)}
                                        <span className="special">{getNotificationSecond(note)}</span>. 
                                        <small>{" " + note.timeString}</small>
                                    </Link>
                                </li>);
                    }, this)}
                    {!this.state.notifications.length && 
                    <li className="unclickableDropdown" id="NoNewNotificationsDropdown">
                        No new notifications.</li>}
                    <li className="divider"></li>
                    <li><Link to="/notifications"><center>See All</center></Link></li>
                </ul>
            </li>
		);
	}
}