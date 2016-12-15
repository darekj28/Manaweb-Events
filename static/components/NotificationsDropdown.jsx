var React = require('react');
var Link = require('react-router').Link;
export default class NotificationsDropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = { notifications : [] };
        this.getNotifications = this.getNotifications.bind(this);
    }
    getNotifications() {

    }
    componentDidMount() {
        this.getNotifications();
    }
	render() {
		return (
			<li className="dropdown">
                <a href="#" className="SearchNavBarGlyphicon dropdown-toggle" data-toggle="dropdown">
                    <span className="glyphicon glyphicon-envelope"></span>
                </a>
                <ul className="dropdown-menu">
                	<li><a href="#">Insert notifications here.</a></li>
                	<li><a href="#">Insert notifications here.</a></li>
                	<li><a href="#">Insert notifications here.</a></li>
                    <li className="divider"></li>
                    <li><Link to="/notifications"><center>See All</center></Link></li>
                </ul>
            </li>
		);
	}
}