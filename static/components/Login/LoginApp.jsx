var React = require('react');
var Link = require('react-router').Link;

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
	render() {
		return (
			<div>
				<LoginNavBar loginError={this.loginError.bind(this)}/>
				<div className="container app-container">
					{this.state.error && <LoginError error={this.state.error}/>}
					<h1><center>M A N A W E B</center></h1>
                    <center>
                    	<Link to="/register"><button className="btn btn-default" id="SignUpButton">
                    		Create A Profile!
                    	</button></Link>
                	</center>
				</div>
			</div>
		);
	}	
}