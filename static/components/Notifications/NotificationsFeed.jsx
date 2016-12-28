var React = require('react');
import NotificationsFeedPost from "./NotificationsFeedPost.jsx";

export default class NotificationsFeed extends React.Component {
    addNotificationsToFeed() {
        var notes = [];
        this.props.notifications.map(function(note, i) {
            notes.push(<NotificationsFeedPost key={i} note={note}/>);
        });
        return notes;
    }
	render() {
		return (
			<ul id="NotificationsFeed">
				{this.addNotificationsToFeed.bind(this)()}
			</ul>
			);
	}
}