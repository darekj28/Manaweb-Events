var React = require('react');
import NoSearchNavBar from '../GenericNavBar/NoSearchNavBar.jsx';
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';
import AdminUserList from './AdminUserList.jsx'
import AdminReportList from './AdminReportList.jsx'
import {Nav, NavItem, PageHeader} from 'react-bootstrap';

function queryInObject(query, obj) {
	if (query == "") return true;
	for (var property in obj) {
		if (obj[property])
			if (obj[property].toLowerCase().indexOf(query.toLowerCase()) !== -1) {
				return true;
			}
	}
	return false;
}
function deepCopy(i) {
	return JSON.parse(JSON.stringify(i));
}
function sort_by(field, reverse, primer){
   	var key = primer ? 
       	function(x) {return primer(x[field])} : 
       	function(x) {return x[field]};

    if (field == "timeString") reverse = !reverse;
   	reverse = !reverse ? 1 : -1;

   	return function (a, b) {
       	return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    } 
}
function getPrimer(field) {
	var primer = function(a) {
		if (!a) return "";
		return a.toLowerCase();
	};
	if (field == "fb_id") 
		primer = function(number){
			if (!number) return "";
			return parseInt(number);
		}
	return primer;
}
var static_user_list;
var static_report_list;
export default class AdminApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser 				: AppStore.getCurrentUser(),
			view 						: "user",
			user_list					: [],
			user_fields					: [],
			userSearchQuery				: "",
			userActiveSortField     	: "",
			userActiveSortDirection		: "",
			report_list 				: [],
			report_fields 				: [],
			reportSearchQuery			: "",
			reportActiveSortField   	: "",
			reportActiveSortDirection	: "",
		};
	}
	initializeUserList() {
		$.post('/getUserList', function(data){
			var user_list = [];
			var fields = [];
			data.user_list.map(function(obj) {
				user_list.unshift({
					userID 		: obj.userID,
					first_name	: obj.first_name,
					last_name	: obj.last_name,
					email		: obj.email,
					phone_number: obj.phone_number,
					fb_id		: obj.fb_id,
					timeString  : obj.timeString,
					confirmed   : obj.confirmed
				});
			});
			for (var property in user_list[0])
				fields.push(property);
			static_user_list = deepCopy(user_list);
			this.setState({user_list : user_list, user_fields : fields})
		}.bind(this));
	}
	initializeReportList(){
		$.post('/getReportList', function(data){
			var report_list = [];
			var fields = [];
			data.report_list.map(function(obj) {
				report_list.unshift({
					// comment_id	: obj.comment_id,
					// unique_id	: obj.unique_id,
					comment_id  : obj.unique_id,
					post 		: obj.body,
					reason 		: obj.reason,
					reporter 	: obj.reporting_user,
					recipient 	: obj.reported_user,
					description : obj.description,
					timeString 	: obj.timeString,
					isComment 	: obj.isComment
				});
			});
			for (var property in report_list[0])
				fields.push(property);
			static_report_list = deepCopy(report_list);
			this.setState({report_list : report_list, report_fields : fields})
		}.bind(this));
	}
	handleSelect(view) {
		this.setState({ view : view });
	}
	handleUserSearch(query) {
		this.setState({ userSearchQuery : query }, 
			this.userSortAndSearch.bind(this));
	}
	handleUserSort(field) {
		var activeSortDirection = true;
		if (this.state.userActiveSortField == field) 
			activeSortDirection = !this.state.userActiveSortDirection;
		this.setState({ userActiveSortField : field, userActiveSortDirection : activeSortDirection }, 
			this.userSortAndSearch.bind(this));
	}
	userReset() {
		this.setState({ userActiveSortField : "", userActiveSortDirection : "", userSearchQuery : "", user_list : static_user_list });
	}
	userSortAndSearch() {
		var matchingUsers = [];
		var list = deepCopy(static_user_list);
		list.sort(sort_by(this.state.userActiveSortField, 
							!this.state.userActiveSortDirection, 
							getPrimer(this.state.userActiveSortField)));
		list.map(function(user) {
			if (queryInObject(this.state.userSearchQuery, user))
				matchingUsers.push(user);
		}.bind(this));
		this.setState({ user_list : matchingUsers });
	}
	handleReportSearch(query) {
		this.setState({ reportSearchQuery : query }, 
			this.reportSortAndSearch.bind(this));
	}
	handleReportSort(field) {
		var activeSortDirection = true;
		if (this.state.reportActiveSortField == field) 
			activeSortDirection = !this.state.reportActiveSortDirection;
		this.setState({ reportActiveSortField : field, reportActiveSortDirection : activeSortDirection }, 
			this.reportSortAndSearch.bind(this));
	}
	reportReset() {
		this.setState({ reportActiveSortField : "", reportActiveSortDirection : "", reportSearchQuery : "", report_list : static_report_list });
	}
	reportSortAndSearch() {
		var matchingReports = [];
		var list = deepCopy(static_report_list);
		list.sort(sort_by(this.state.reportActiveSortField, 
							!this.state.reportActiveSortDirection, 
							getPrimer(this.state.reportActiveSortField)));
		list.map(function(report) {
			if (queryInObject(this.state.reportSearchQuery, report))
				matchingReports.push(report);
		}.bind(this));
		this.setState({ report_list : matchingReports });
	}
	componentDidMount() {
		this.initializeUserList.bind(this)()
		this.initializeReportList.bind(this)()
	}
	render() {
		var name = this.state.currentUser['first_name'] + " " + this.state.currentUser['last_name'];
		return(
			<div id="AdminApp">
				<NoSearchNavBar currentUser={this.state.currentUser} name={name}/>
				<div className="container admin-container app-container">
					<PageHeader>Admin Portal</PageHeader>
					<Nav bsStyle="tabs" activeKey={this.state.view} onSelect={this.handleSelect.bind(this)}>
						<NavItem eventKey="report">Reports</NavItem>
						<NavItem eventKey="user">Users</NavItem>
					</Nav>
					{this.state.view == "user" &&
						<AdminUserList user_list = {this.state.user_list} fields={this.state.user_fields} 
							searchQuery={this.state.userSearchQuery} handleSearch={this.handleUserSearch.bind(this)}
							handleSort={this.handleUserSort.bind(this)}
							activeSortField={this.state.userActiveSortField}
							activeSortDirection={this.state.userActiveSortDirection}
							reset={this.userReset.bind(this)}/>}
					{this.state.view == "report" &&
						<AdminReportList report_list = {this.state.report_list} fields={this.state.report_fields} 
							searchQuery={this.state.reportSearchQuery} handleSearch={this.handleReportSearch.bind(this)}
							handleSort={this.handleReportSort.bind(this)}
							activeSortField={this.state.reportActiveSortField}
							activeSortDirection={this.state.reportActiveSortDirection}
							reset={this.reportReset.bind(this)}/>}
				</div>
			</div>
			);
	}
}