var React = require('react');
import NoSearchNavBar from "../GenericNavBar/NoSearchNavBar.jsx";
import NotificationsFeed from './NotificationsFeed.jsx';
import AppStore from '../../stores/AppStore.jsx';
import AppActions from '../../actions/AppActions.jsx';

export default class NotificationsApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser : AppStore.getCurrentUser(),
            notifications : AppStore.getNotifications()
        };
	}
	seeNotifications() {
		AppActions.deleteNotificationCount();
        $.post('/seeNotifications', {currentUser : AppStore.getCurrentUser()});
    }
	componentDidMount() {
        AppStore.addNoteChangeListener(this._onChange.bind(this));
        this.seeNotifications.bind(this)();
    }
    componentWillUnmount() {
        AppStore.removeNoteChangeListener(this._onChange.bind(this));
    }
    _onChange() {
        this.setState({ notifications : AppStore.getNotifications() })
    }
	render() {
		var name = this.state.currentUser['first_name'] + " " + this.state.currentUser['last_name'];
		return (
			<div id="NotificationsApp">
				<NoSearchNavBar currentUser={this.state.currentUser} name={name}/>
				<div className="container app-container">

					{this.state.currentUser['first_name'] != undefined && 
						<div className="page-header my-page-header"><h2>YOUR NOTIFICATIONS</h2></div>}
					<div className="feed row">
						<NotificationsFeed notifications={this.state.notifications}/>		
					</div>
				</div>	
			</div>
		);
	}
}