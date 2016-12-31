var React = require('react');
var Link = require('react-router').Link;
import AppStore from '../../stores/AppStore.jsx';
import AppActions from '../../actions/AppActions.jsx';

export default class NotificationsDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications : AppStore.getNotifications(),
            numUnseen : AppStore.getNotificationCount()
        };
    }
    seeNotification() {
        AppActions.deleteNotificationCount();
        this.state.notifications.map(function (note){
            $.post('/seeNotification', {notification_id: note['notification_id']});
        });
    }
    getNotificationCount() {
        $.post('/getNotificationCount', {currentUser : AppStore.getCurrentUser()},
            function(data) {
                if (data.count > 0) { 
                    AppActions.addNotificationCount(data.count);
                }
            }.bind(this));
    }
    componentDidMount() {
        AppStore.addChangeListener(this._onChange.bind(this));
        if (!this.state.timer)
            this.setState({ timer : setInterval(this.getNotificationCount.bind(this), 10000) });
    }
    componentWillUnmount() {
        clearInterval(this.state.timer);
        AppStore.removeChangeListener(this._onChange.bind(this));
    }
    _onChange() {
        this.setState({ notifications : AppStore.getNotifications(), 
                            numUnseen : AppStore.getNotificationCount() })
    }
	render() { 
		return (
			<li className="dropdown">
                <a href="#" onClick={this.seeNotification.bind(this)} className="SearchNavBarGlyphicon dropdown-toggle" data-toggle="dropdown">
                    <span className="glyphicon glyphicon-envelope"></span>
                    {this.state.numUnseen > 0 && <span className="badge badge-notify">{this.state.numUnseen}</span>}
                </a>
                <ul className="dropdown-menu">
                    {this.state.notifications.map(function(note, i) {
                        return (<li key={i}>
                                    <Link to={"/comment/" + note.comment_id}> 
                                        {note.action + " " + note.timeString}
                                    </Link>
                                </li>);
                    })}
                    {!this.state.notifications.length && 
                        <li className="unclickableDropdown" id="NoNewNotificationsDropdown">No new notifications.</li>}
                    <li className="divider"></li>
                    <li><Link to="/notifications"><center>See All</center></Link></li>
                </ul>
            </li>
		);
	}
}