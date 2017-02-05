var React = require('react');
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';


export default class AdminReportBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
	}

	componentDidMount() {
		// this.getCurrentUserInfo.bind(this)()
	}

	render() {
		return(
			<div id="AdminReportBox">
				<span id = "reported_user" >
				 	{this.props.report.reported_user} 
				 </span>
			</div>
			);
	}
}