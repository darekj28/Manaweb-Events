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
var static_user_list;
export default class AdminApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentUser 		: AppStore.getCurrentUser()	,
			user_list			: []						,
			view 				: "user"					,
			report_list 		: []						,
			user_fields			: []						,
			searchQuery			: ""
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
					timeString  : obj.timeString
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
		this.setState({ searchQuery : query }, this.filter.bind(this));
	}
	filter() {
		var matchingUsers = [];
		static_user_list.map(function(user) {
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
					<PageHeader>Admin Tools</PageHeader>
					<Nav bsStyle="tabs" activeKey={this.state.view} onSelect={this.handleSelect.bind(this)}>
						<NavItem eventKey="user">Users</NavItem>
						<NavItem eventKey="report">Reports</NavItem>
					</Nav>
					{this.state.view == "user" &&
						<AdminUserList user_list = {this.state.user_list} fields={this.state.user_fields} 
							searchQuery={this.state.searchQuery} handleSearch={this.handleSearch.bind(this)}/>}
					{this.state.view == "report" &&
						<AdminReportList report_list = {this.state.report_list}/>}
				</div>
			</div>
			);
	}
}