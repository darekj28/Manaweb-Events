var React = require('react');
var Link = require('react-router').Link;
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';

export default class LoginNavBar extends React.Component {
	constructor() {
		super();
		this.state = {login_register : 'login',
						error : ""};
	}
	switchMenu(event) {
		this.setState({ login_register : event.target.id });
	}
	render() {
		return (
			<div>
				<nav className="navbar navbar-default" role="navigation">
				  <div className="container">
			       		<div className="navbar-header">
		                 	<Link to="/" className="navbar-brand navbar-brand-logo">
		                        <span className="glyphicon glyphicon-home"></span>
		                  	</Link>

		               

		                  	<div id="LoginRegisterLabel" className="SearchNavBarGlyphicon navbar-toggle navbar-toggle-always" 
		                  		data-toggle="offcanvas" data-target="#LoginRegisterMenu">
		                  			<b> Login &#8226; Register </b>
		                  	</div>	
			        	</div>
				  </div>
				</nav>
				<nav id="LoginRegisterMenu" className="navmenu navmenu-default navmenu-fixed-right offcanvas" 
							role="navigation">
				  	<div className="navmenu-brand" id="login" onClick={this.switchMenu.bind(this)}>
				  		Login</div>
				  	<div className="navmenu-brand" id="register" onClick={this.switchMenu.bind(this)}>
				  		Register</div>
				  	{this.state.login_register == "login" &&
				  		<LoginForm/>}
				  	{this.state.login_register == "register" &&
			  			<RegisterForm/> }
				</nav>
			</div>
		)
	}
}