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
		var report = this.props.report
		return(
			<tr>
		      <th scope="row"> {this.props.index} </th>
		      <td>{report.reporting_user}</td>
		      <td>{report.reported_user}</td>
		      <td>{report.body}</td>
		      <td>{report.reason}</td>
		      <td>{report.description}</td>
		      <td>{report.time}</td>
		    </tr>
			);
	}
}