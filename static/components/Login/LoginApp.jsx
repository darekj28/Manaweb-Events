var React = require('react');

import FacebookConnect from './Login/FacebookConnect.jsx';
import RegisterForm from './Register/RegisterForm.jsx';
import LoginNavBar from './LoginNavBar.jsx';
import Footer from './Footer.jsx';

export default class LoginApp extends React.Component {
	render() {
		return (
			<div>
				<LoginNavBar/>
				<div className="container app-container register-container col-xs-12">
					<div className="col-xs-6">
						{/* <img id="Logo" src="static/logo.png"></img> */}
						<div className="pull-right"><img id="Logo" src="static/img/gatewatch.jpg"></img></div>
					</div>
					<div className="RegisterContainer col-xs-6">
						<div className="page-header"><h3><b>Create an account</b></h3></div>
						<RegisterForm/>
						<FacebookConnect/>
					</div>	
				</div>
				<Footer/>
			</div>
		);
	}	
}