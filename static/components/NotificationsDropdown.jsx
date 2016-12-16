var React = require('react');
var Link = require('react-router').Link;
export default class NotificationsDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.getNotifications = this.getNotifications.bind(this);
    }
    getNotifications() {
        this.props.getNotifications();
    }
	render() { 
		return (
			<li className="dropdown">
                <a href="#" className="SearchNavBarGlyphicon dropdown-toggle" data-toggle="dropdown" 
                        onClick={this.getNotifications}>
                    <span className="glyphicon glyphicon-envelope"></span>
                </a>
                <ul className="dropdown-menu">
                    {this.props.notifications.map(function(note) {
                        return (<li><Link to={"/comment?id=" + note.comment_id}> {note.action +  " at " + note.timeString}</Link></li>);
                    })}
                    <li><Link to="/notifications"><center>See All</center></Link></li>
                </ul>
            </li>
		);
	}
}