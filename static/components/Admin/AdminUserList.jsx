var React = require('react');
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';
import AdminUserBox from './AdminUserBox.jsx'
import AdminModal from './AdminModal'

export default class AdminApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_username		: ""
		};
	}

	componentDidMount() {
		this.generateUserList.bind(this)()
	}

	generateUserList(){
		var user_list = []
		this.props.user_list.map(function(obj) {
			var element = <AdminUserBox userID = {obj}
							selectUser = {this.selectUser.bind(this)}
							/>
			user_list.push(element)
		}.bind(this))
		return user_list
	}

	selectUser(userID) {
		if (this.state.selected_username == userID) {
			this.setState({selected_username : ""})
		}
		else {
			this.setState({selected_username : userID})			
		}
	}

	render() {
		var user_list = this.generateUserList.bind(this)()
		return(
			<div id="AdminUserList">
				<div className = "col-sm-3" id = "UserListTitle">
					{user_list}
				</div>
				{this.state.selected_username &&
					<AdminModal userID = {this.state.selected_username}/>
				}
			</div>
			);
	}
}