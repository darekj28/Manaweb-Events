var React = require('react');
var Link = require('react-router').Link;
export default class NotificationsFeedPost extends React.Component {
	render() {
        var note = this.props.note;
		return (
			<li className="NotificationsFeedPost">
                <Link to={"/comment/" + note.comment_id} id="NotificationsFeedPostLink"> 
                    <div className="row">{note.action}</div>
                    <div className="row"><small>{note.timeString}</small></div>
                </Link>
            </li>
			);
	}
}