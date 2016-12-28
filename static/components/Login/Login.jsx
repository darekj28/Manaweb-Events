var React = require('react');
export default class Login extends React.Component {
	constructor() {
		this.state = {user : '', password : ''};
	}
	handleTyping(event) {
		this.setState({ event.target.id : event.target.value });
	}
	login(event) {
		event.preventDefault();
		Auth.login(this.state.user, this.state.password)
			.catch(function(err) {
				alert("Error logging in", err);
			});
	}
	render() {
		return (
			<form role="form">
				<div className="form-group">
					<input type="text" id="user" onChange={this.handleTyping.bind(this)} placeholder="Username"/>
					<input type="password" id="password" onChange={this.handleTyping.bind(this)} placeholder="Password"/>
				</div>
			</form>
			)
	}
}