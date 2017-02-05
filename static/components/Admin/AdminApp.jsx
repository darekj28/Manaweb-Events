var React = require('react');
import NoSearchNavBar from '../GenericNavBar/NoSearchNavBar.jsx';
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';
import AdminUserList from './AdminUserList.jsx'
import AdminReportList from './AdminReportList.jsx'

export default class AdminApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser 		: AppStore.getCurrentUser()	,
			user_list			: []						,
			view 				: "Report"					,
			report_list 		: []						,
		};
	}

	initializeUserList() {
		$.post('/getUserList', function(data){
			var user_list = [];
			data.user_list.map(function(obj) {
				user_list.unshift(obj);
			});	
			this.setState({user_list : user_list})
		}.bind(this));
	}

	initializeReportList(){
		$.post('/getReportList', function(data){
			var report_list = [];
			data.report_list.map(function(obj) {
				report_list.unshift(obj);
			});	
			this.setState({report_list : report_list})
		}.bind(this));
	}

	componentDidMount() {
		this.initializeUserList.bind(this)()
		this.initializeReportList.bind(this)()
	}

	render() {
		return(
			<div id="AdminApp">
				<NoSearchNavBar currentUser={this.state.currentUser} name={name}/>

				<div className="container app-container">
					{ this.state.view == "User" &&
						<AdminUserList user_list = {this.state.user_list}/>
					}

					{
						this.state.view == "Report" &&
						<AdminReportList report_list = {this.state.report_list}/>
					}

				</div>
			</div>
			);
	}
}