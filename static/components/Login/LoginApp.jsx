var React = require('react');
var Link = require('react-router').Link;
import FacebookLogin from 'react-facebook-login';

import LoginNavBar from './LoginNavBar.jsx';
import LoginError from './LoginError.jsx';
export default class LoginApp extends React.Component {
	constructor() {
		super();
		this.state = {error : ''};
	}
	loginError(err) {
		this.setState({ error : err });
	}
	componentDidMount() {
		$('#SignUpButton').click(function(e) {
			$(this).blur();
		});
	}

	// handleFacebookLoginClick() {
 // 		 console.log();
	// }

	responseFacebook(response) {
		console.log(response)
	}


	render() {
		const appId = "1138002282937846"
		const testAppId = "1298398903564849"
		return (
			<div>
				<LoginNavBar loginError={this.loginError.bind(this)}/>
				<div className="container app-container">
					{this.state.error && <LoginError error={this.state.error}/>}
					<h1><center>M A N A W E B</center></h1>
                    <center>
                    	<Link to="/register">
                    	<button className="btn btn-default" id="SignUpButton">
                    			Create A Profile!
                    		</button>
                    	</Link>

                    	<br/>
                    	<br/>

                    	<FacebookLogin
						    appId= {appId}
						    autoLoad={true}
						    fields="name,email"
						    onClick={this.handleFacebookLoginClick}
						    callback={this.responseFacebook}
						    icon="fa-facebook"
						    size = "small" />

                	</center>
				</div>
			</div>
		);
	}	
}