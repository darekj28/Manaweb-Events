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
export default class AdminApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser 		: AppStore.getCurrentUser(),
			user_list			: [],
			view 				: "user",
			report_list 		: [],
			user_fields			: [],
			searchQuery			: "",
			activeSortField     : "",
			activeSortDirection	: ""
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
			data.report_list.map(function(obj) {
				report_list.unshift(obj);
			});
			this.setState({report_list : report_list})
		}.bind(this));
	}
	handleSelect(view) {
		this.setState({ view : view });
	}
	handleSearch(query) {
		this.setState({ searchQuery : query }, this.sortAndSearch.bind(this));
	}
	handleSort(field) {
		var activeSortDirection = true;
		if (this.state.activeSortField == field) 
			activeSortDirection = !this.state.activeSortDirection;
		this.setState({ activeSortField : field, activeSortDirection : activeSortDirection }, this.sortAndSearch.bind(this));
	}
	reset() {
		this.setState({ activeSortField : "", activeSortDirection : "", searchQuery : "", user_list : static_user_list });
	}
	sortAndSearch() {
		var matchingUsers = [];
		var list = deepCopy(static_user_list);
		list.sort(sort_by(this.state.activeSortField, 
							!this.state.activeSortDirection, 
							getPrimer(this.state.activeSortField)));
		list.map(function(user) {
			if (queryInObject(this.state.searchQuery, user))
				matchingUsers.push(user);
		}.bind(this));
		this.setState({ user_list : matchingUsers });
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
				<div className="container app-container">
					<PageHeader>Admin Portal</PageHeader>
					<Nav bsStyle="tabs" activeKey={this.state.view} onSelect={this.handleSelect.bind(this)}>
						<NavItem eventKey="user">Users</NavItem>
						<NavItem eventKey="report">Reports</NavItem>
					</Nav>
					{this.state.view == "user" &&
						<AdminUserList user_list = {this.state.user_list} fields={this.state.user_fields} 
							searchQuery={this.state.searchQuery} handleSearch={this.handleSearch.bind(this)}
							handleSort={this.handleSort.bind(this)}
							activeSortField={this.state.activeSortField}
							activeSortDirection={this.state.activeSortDirection}
							reset={this.reset.bind(this)}/>}
					{this.state.view == "report" &&
						<AdminReportList report_list = {this.state.report_list}/>}
				</div>
			</div>
			);
	}
}