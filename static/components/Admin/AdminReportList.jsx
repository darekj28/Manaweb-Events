var React = require('react');
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';
import AdminReportBox from './AdminReportBox.jsx'

export default class AdminReportList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
	}

	generateReportList(){
		var report_list = []
		this.props.report_list.map(function(obj) {
			var element = <AdminReportBox report = {obj}
							/>
			report_list.push(element)
		}.bind(this))
		return report_list
	}

	componentDidMount() {
		
	}

	// see the reports 

	render() {
		var report_list = this.generateReportList.bind(this)()
		return(
			<div id="AdminReportList">
				{report_list}
			</div>
			);
	}
}