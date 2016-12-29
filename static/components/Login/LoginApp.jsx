var React = require('react');
import LoginNavBar from './LoginNavBar.jsx';
export default class LoginApp extends React.Component {
	render() {
		return (
			<div>
				<LoginNavBar/>
				<div className="container app-container">
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