var React = require('react');
var Link = require('react-router').Link;

import FacebookConnect from './FacebookConnect.jsx';
import RegisterForm from './RegisterForm.jsx';
import LoginNavBar from './LoginNavBar.jsx';

export default class LoginApp extends React.Component {
	render() {
		return (
			<div>
				<LoginNavBar/>
				<div className="container app-container col-xs-12">
					<RegisterForm/>
				</div>
			</div>
		);
	}	
}