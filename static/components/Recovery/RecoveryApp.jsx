var React = require('react');
import EnterAccountInfo from './EnterAccountInfo.jsx';
import SendConfirmationCode from './SendConfirmationCode.jsx';
import EnterConfirmationCode from './EnterConfirmationCode.jsx';
import ChangePassword from './ChangePassword.jsx';

export default class RecoveryApp extends React.Component {
	constructor() {
		super();
		this.state = {
			step : 1,
			eai_info : "",
			scc_code : "",
			scc_method : ""
		}
	}
	goNextStep() {
		this.setState({ step : this.state.step + 1 });
	}
	goPrevStep() {
		this.setState({ step : this.state.step - 1 });
	}
	handleEAI(account_info) {
		this.setState({ eai_info : account_info }, this.goNextStep.bind(this));
	}
	handleSCC(code, method) {
		this.setState({ scc_code : code, scc_method : method }, this.goNextStep.bind(this));
	}
	render() {
		return (
			<div className="container app-container">
				{this.state.step == 1 && 
					<EnterAccountInfo handleEAI={this.handleEAI.bind(this)}/>}
				{this.state.step == 2 && 
					<SendConfirmationCode goPrevStep={this.goPrevStep.bind(this)}
											handleSCC={this.handleSCC.bind(this)}
											input={this.state.eai_info}/>}
				{this.state.step == 3 && 
					<EnterConfirmationCode goNextStep={this.goNextStep.bind(this)}
											goPrevStep={this.goPrevStep.bind(this)}
											code={this.state.scc_code}
											method={this.state.scc_method} />}
				{this.state.step == 4 && 
					<ChangePassword goPrevStep={this.goPrevStep.bind(this)}
									username={this.state.eai_info['username']}/>}
			</div>
			)
	}
}