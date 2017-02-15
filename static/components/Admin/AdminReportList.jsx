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
		this.props.report_list.map(function(obj, i) {
			var element = <AdminReportBox index = {i} report = {obj}
							/>
			report_list.push(element)
		}.bind(this))
		return report_list
	}

	componentDidMount() {
		// $(document).ready(function() {
		//     $('#repost_table').DataTable();
		// } );
	}

	// see the reports 

	render() {
		var report_list = this.generateReportList.bind(this)()
		return(
			<div id="AdminReportList">
			<div className = "table-responsive">
			<table id = "report_table" className="table table-striped table-bordered" cellspacing="0" width="100%">
			  <thead>
			    <tr>
			      <th>#</th>
			      <th>Reporting User</th>
			      <th>Reported User</th>
			      <th> Body </th>
			      <th> Reason </th>
			      <th> Description </th>
			      <th> Time </th>
			    </tr>
			  </thead>
			  <tbody>
			   		{report_list}
			  </tbody>
			</table>
			</div>
			</div>
			);
	}
}