var React = require('react');
var Link = require('react-router').Link;
import AppStore from '../../stores/AppStore.jsx';

export default class NotificationsDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notifications : AppStore.getNotifications(),
            numUnseen : AppStore.getNotificationCount()
        };
    }
    seeNotification() {
        this.state.notifications.map(function (obj){
            $.post('/seeNotification', {notification_id: obj['notification_id']})
        });
    }
    componentDidMount() {
        this.seeNotification.bind(this)();
        AppStore.addChangeListener(this._onChange.bind(this));
    }
    componentWillUnmount() {
        AppStore.removeChangeListener(this._onChange.bind(this));
    }
    _onChange() {
        this.setState({ notifications : AppStore.getNotifications(), 
                            numUnseen : AppStore.getNotificationCount() })
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
                    {!this.state.notifications.length && 
                        <li className="unclickableDropdown" id="NoNewNotificationsDropdown">No new notifications.</li>}
                    <li className="divider"></li>
                    <li><Link to="/notifications"><center>See All</center></Link></li>
                </ul>
            </li>
		);
	}
}