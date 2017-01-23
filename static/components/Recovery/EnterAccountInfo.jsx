var React = require('react');
export default class EnterAccountInfo extends React.Component {
	constructor() {
		super();
		this.state = { info : "",
						error : "" };
	}
	handleChange(e) {
		this.setState({ info : e.target.value });
	}
	handleEnter(e) {
		if (e.charCode == 13)
			this.handleSubmit.bind(this)();
	}
	handleSubmit() {
		var obj = { recovery_input : this.state.info };
		$.ajax({
			type: "POST",
			url : '/recoverAccount',
			data : JSON.stringify(obj, null, '\t'),
			contentType : 'application/json;charset=UTF-8',
			success: function(data){   
		     	if (data['result'] == 'success') {
		     		this.props.handleEAI(data);
		     	}
		     	else 
		     		alert("Unable to find account");
		    }.bind(this)
		});
	}
	render() {
		return (
			<div>
				<div className="recovery-title">Find your Manaweb account</div>
				<div className="recovery"> Enter your email, phone number, or username.</div>
				<input className="form-control recovery-input" onKeyPress={this.handleEnter.bind(this)} onChange={this.handleChange.bind(this)}/>
                <button className="btn post-button recovery-button"
                		onClick={this.handleSubmit.bind(this)}> Search </button>
			</div>
			)
	}
}