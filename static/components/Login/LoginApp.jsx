var React = require('react');

import FacebookConnect from './FacebookConnect.jsx';
import RegisterForm from './RegisterForm.jsx';
import LoginNavBar from './LoginNavBar.jsx';

export default class LoginApp extends React.Component {
	render() {
		return (
			<div>
				<LoginNavBar/>
				<div className="container app-container col-xs-12">
					<div className="col-xs-6">
						<div className="page-header"><h1>Create a profile</h1></div>
						<RegisterForm/>
						<FacebookConnect/>
					</div>
					<div className="col-xs-6">
						
					</div>
				</div>
			</div>
		);
	}	
}