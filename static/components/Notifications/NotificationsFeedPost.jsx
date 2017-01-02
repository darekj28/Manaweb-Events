var React = require('react');
var Link = require('react-router').Link;
export default class NotificationsFeedPost extends React.Component {
	render() {
        var note = this.props.note;
		return (
			<li className="NotificationsFeedPost">
                <Link to={"/comment/" + note.comment_id}> 
                    <div className="row"><b>{note.action}</b></div>
                </Link>
                <div className="row"><small>{note.timeString}</small></div>
            </li>
			);
	}
}