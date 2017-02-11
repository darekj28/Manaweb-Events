var React = require('react');
var Link = require('react-router').Link;
import LoginForm from './Login/LoginForm.jsx';
export default class LoginNavBar extends React.Component {
	constructor() {
		super();
		this.state = {error : ""};
	}
	triggerError(error) {
		this.setState({ error : error });
	}
	render() {
		return (
			<nav className="navbar navbar-default" role="navigation">
				  <div className="container navbar-container">
			       		<div className="navbar-header">
		                 	<div className="navbar-brand navbar-brand-logo login-home">
		                        <span className="glyphicon glyphicon-home"></span>
		                  	</div>
		                  	<button type="button" id="LoginToggle" className="SearchNavBarGlyphicon btn navbar-toggle" 
		                  		data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                  				<b> Login </b>
                  			</button>
			        	</div>
                  		<div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                  			<LoginForm triggerError={this.triggerError.bind(this)}/>
                  			{this.state.error && <LoginError error={this.state.error}/>}
                  		</div>
				  </div>
			</nav>
		)
	}
}