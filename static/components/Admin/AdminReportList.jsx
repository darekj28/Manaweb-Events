var React = require('react');
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';


export default class AdminReportList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
	}

	componentDidMount() {
		// this.getCurrentUserInfo.bind(this)()
	}

	// see the reports 

	render() {
		return(
			<div id="AdminReportList">
			</div>
			);
	}
}