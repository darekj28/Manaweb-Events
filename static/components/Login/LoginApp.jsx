var React = require('react');
import LoginNavBar from './LoginNavBar.jsx';
export default class LoginApp extends React.Component {
	constructor() {
		super();
		this.state = {error : ''};
	}
	loginError(err) {
		this.setState({ error : err });
	}
	render() {
		return (
			<div>
				<LoginNavBar loginError={this.loginError.bind(this)}/>
				<div className="container app-container">
					{this.state.error && 
					<div className="alert alert-danger">
			  			<strong>Bro!</strong> {this.state.error}
					</div>}
					<h1><center>M A N A W E B</center></h1>
					<form method="get" action="createProfile">
                        <center>
                        	<button type="submit" className="btn btn-default">Sign Up Here!</button>
                    	</center>
                    </form>
				</div>
			</div>
		);
	}	
}