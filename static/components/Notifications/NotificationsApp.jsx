var React = require('react');
import NoSearchNavBar from "../GenericNavBar/NoSearchNavBar.jsx";
import NotificationsFeed from './NotificationsFeed.jsx';
import AppStore from '../../stores/AppStore.jsx';
export default class NotificationsApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser : AppStore.getCurrentUser(),
            notifications : AppStore.getNotifications()
        };
	}
	componentDidMount() {
        AppStore.addChangeListener(this._onChange.bind(this));
    }
    componentWillUnmount() {
        AppStore.removeChangeListener(this._onChange.bind(this));
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
						<h2>{name}'s Notifications</h2>}
					<NotificationsFeed notifications={this.state.notifications}/>		
				</div>	
			</div>
		);
	}
}