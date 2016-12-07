var React = require('react');
export default class Notifications extends React.Component {
	render() {
		return (
			<li className="dropdown">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                    <span className="glyphicon glyphicon-envelope"></span>
                </a>
                <ul className="dropdown-menu">
                	<li><a href="#">Insert notifications here.</a></li>
                	<li><a href="#">Insert notifications here.</a></li>
                	<li><a href="#">Insert notifications here.</a></li>
                </ul>
            </li>
		);
	}
}