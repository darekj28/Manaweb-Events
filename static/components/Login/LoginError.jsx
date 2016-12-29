var React = require('react');

export default class LoginError extends React.Component {
	render() {
		return( 
				<div className="alert alert-danger">
		  			<strong>Bro!</strong> {this.props.error}
				</div>
			)
	}
}