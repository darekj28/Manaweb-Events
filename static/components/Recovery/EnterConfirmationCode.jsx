var React = require('react');
export default class EnterConfirmationCode extends React.Component {
	constructor() {
		super();
		this.state = { code : "" };
	}
	handleChange(e) {
		this.setState({ code : e.target.value });
	}
	handleEnter(e) {
		if (e.charCode == 13)
			this.handleSubmit.bind(this)();
	}
	handleSubmit() {
		if (this.props.code !== this.state.code)
			this.props.goNextStep();
		else
			swal("Invalid confirmation code.", "Please try again.", "error");
	}
	render() {
		return (
			<div className="recovery-page">
				<div className="recovery-title">Check your {this.props.method}</div>
				<div className="recovery">A confirmation code has been sent to your {this.props.method}.</div>
				<input type="text" className="form-control recovery-input" 
						onChange={this.handleChange.bind(this)} 
						onKeyPress={this.handleEnter.bind(this)}
						placeholder="Enter confirmation code"/>
				<button className="btn post-button recovery-button" onClick={this.props.goPrevStep}> Go back </button>
				<button className="btn post-button recovery-button" onClick={this.handleSubmit.bind(this)}> Continue </button>
			</div>
			)
	}
}