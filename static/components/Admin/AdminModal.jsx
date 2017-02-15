var React = require('react');
import AppActions from '../../actions/AppActions.jsx';
import AppStore from '../../stores/AppStore.jsx';


export default class AdminModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selected_user : {}
		};
	}

	getCurrentUserInfo(userID) {
		$.post('/getCurrentUserInfo', {userID : userID, jwt : localStorage.jwt }, 
			function(data) {
			this.setState({
				selected_user : data.thisUser
			})
		}.bind(this));
	}

	componentDidMount() {
		if (this.props.userID){
			this.getCurrentUserInfo.bind(this)(this.props.userID)
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.userID != this.props.userID){
			this.getCurrentUserInfo.bind(this)(nextProps.userID)
		}
	}

	deleteAccount() {
		swal({title : "Hold on...", 
						showConfirmButton : false});
		var obj = { username : this.props.userID, jwt : localStorage.jwt  };
		$.ajax({
	    	type : 'POST',
	    	url: "/softDeleteAccount",
	    	data: JSON.stringify(obj, null, '\t'),
	    	contentType: 'application/json;charset=UTF-8',
	    	success : function(data) {
	    		swal({title : "Success!", 
				text: "This account has been deleted.", 
				type: "success",
				confirmButtonColor: "#80CCEE",
  				confirmButtonText: "OK",
  				closeOnConfirm: false}, function() { location.reload(); });
	    	},
	    	error : function(data) {
	    		swal("Oops", "We couldn't connect to the server!", "error");
	    	}
	    });

	}
	clickDeleteAccount() {
		swal({
	      	title: "Are you sure you want to delete this account?", 
		    text: "If you are sure, type in your password:", 
		    type: "input",
		    inputType: "password",
		    showCancelButton: true,
	      	closeOnConfirm: false,
	      	confirmButtonText: "Delete account",
	      	confirmButtonColor: "#f44336"}, 
	    function(password) {
	    	this.deleteAccount.bind(this)();
	    }.bind(this));
	}

	render() {
		if (!this.state.selected_user) {
			return null;
		}

		return(
			<div className = "col-sm-9" id="AdminModal">
				<span> Username : {this.state.selected_user.userID} </span> 
				<br/>
				<span> First Name : {this.state.selected_user.first_name} </span>
				<br/>
				<span> Last Name : {this.state.selected_user.last_name} </span>
				<br/>
				<span> Phone Number : {this.state.selected_user.phone_number} </span>
				<br/>
				<span> Email : {this.state.selected_user.email} </span>
				<br/>
				<div className="form-group">
					<button className="btn btn-default post-button settings-button"
					onClick={this.clickDeleteAccount.bind(this)}><b>Delete Account</b></button>
				</div>

			</div>
		);
	}
}