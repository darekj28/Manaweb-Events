var React = require('react');
var Link = require('react-router').Link;

import FacebookConnect from './Login/FacebookConnect.jsx';
import RegisterForm from './Register/RegisterForm.jsx';
import LoginNavBar from './LoginNavBar.jsx';
import Footer from './Footer.jsx';

export default class LoginApp extends React.Component {
	render() {
		return (
			<div>
				<LoginNavBar/>
				<div className="container app-container register-container">
					<div className="login-page-filler col-xs-6">
						<img src="static/img/gatewatch_copy.jpg" className="login-page-image"/>
					</div>
					<div className="register-form-container col-xs-6">
						<div className="page-header my-page-header">
							<div><h2>Welcome to Manaweb!<br/><small>The world of Magic awaits you...</small></h2></div>
						</div>
						<RegisterForm/>
						<FacebookConnect/>
						<div className="terms-of-service">
							<center className="terms-of-service-text">
								By signing up, you agree to our <Link to="/">Terms of Service</Link> and <Link to="/">Privacy Policy</Link>, including our <Link to="/">Cookie Use</Link>. You may receive emails from Manaweb and can opt out at any time. 
							</center>
						</div>
					</div>	
				</div>
				<Footer/>
			</div>
		);
	}	
}