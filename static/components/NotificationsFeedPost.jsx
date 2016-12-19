var React = require('react');
var Link = require('react-router').Link;
export default class NotificationsFeedPost extends React.Component {
    constructor(props) {
        super(props);
    }
	render() {
        var note = this.props.note;
		return (
			<li className="NotificationsFeedPost">
                <Link to={"/comment?id=" + note.comment_id}> 
                    {note.action +  " at " + note.timeString}
                </Link>
            </li>
			);
	}
}