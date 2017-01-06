var React = require('react');

import FacebookConnect from './FacebookConnect.jsx';
import RegisterForm from './RegisterForm.jsx';
import LoginNavBar from './LoginNavBar.jsx';

export default class LoginApp extends React.Component {
	render() {
		return (
			<div>
				<LoginNavBar/>
				<div className="container app-container register-container col-xs-12">
					<div className="col-xs-6">
						<img id="Logo" src="static/logo.png"></img>
						<FacebookConnect/>
					</div>
					<div className="col-xs-6">
						<div className="page-header"><h3><b>Create an account</b></h3></div>
						<RegisterForm/>
					</div>	
				</div>
			</div>
		);
	}	
}