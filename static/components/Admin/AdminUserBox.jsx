var React = require('react');
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';


export default class AdminApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			
		};
	}

	componentDidMount() {
		// this.getCurrentUserInfo.bind(this)()
	}

	selectUser(){
		this.props.selectUser(this.props.userID)
	}

	render() {
		return(
			<div id="AdminUserBox">
				<span id = "user_name" onClick = {this.selectUser.bind(this)}>
				 {this.props.userID} </span>
			</div>
			);
	}
}