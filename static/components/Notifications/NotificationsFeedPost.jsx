var React = require('react');
var Link = require('react-router').Link;
export default class NotificationsFeedPost extends React.Component {
    getNotificationSyntax(note) {
        var whose; var also; var notification;
        if (note.isOP) { 
            whose = "your";
            also = "";
        }
        else {
            whose = note.op_name + "'s";
            also = " also";
        }
        if (note.numOtherPeople > 1)
            notification = note.sender_name + " and " + 
                note.numOtherPeople + " other people commented on " + whose + " post."
        else if (note.numOtherPeople == 1)
            notification = note.sender_name + 
                " and 1 other person commented on " + whose + " post."
        else 
            notification = note.sender_name + also + " commented on " + whose + " post."
        return notification;
    }
	render() {
        var note = this.props.note;
		return (
			<li className="NotificationsFeedPost">
                <Link to={"/comment/" + note.comment_id}> 
                    <div className="row">
                        <b>{this.getNotificationSyntax.bind(this)(note)}</b>
                    </div>
                </Link>
                <div className="row"><small>{note.timeString}</small><hr className="notification-hr"/></div>
            </li>
			);
	}
}