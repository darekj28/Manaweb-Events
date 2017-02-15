var React = require('react');
import {Button, Table} from 'react-bootstrap';
import AppStore from '../../stores/AppStore.jsx';
function createHeader(field) {
	if (field == "userID") return "Username";
	else if (field == "first_name") return "First Name";
	else if (field == "last_name") return "Last Name";
	else if (field == "email") return "Email Address";
	else if (field == "phone_number") return "Phone Number";
	else if (field == "fb_id") return "Facebook ID";
	else if (field == "timeString") return "Date Created";
	else if (field == "confirmed") return "Confirmed?";
}
export default class AdminUserList extends React.Component {
	constructor(props) {
		super(props);
	}
	deleteAccount(userIdToDelete) {
		swal({title : "Hold on...", 
						showConfirmButton : false});
		var obj = { username : userIdToDelete, jwt : localStorage.jwt  };
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
	clickDeleteAccount(userIdToDelete) {
		if (userIdToDelete != AppStore.getCurrentUser()['userID'])
			swal({
		      	title: "Are you sure you want to delete this account (" + userIdToDelete + ")?", 
			    text: "If you are sure, type in your password:", 
			    type: "input",
			    inputType: "password",
			    showCancelButton: true,
		      	closeOnConfirm: false,
		      	confirmButtonText: "Delete account",
		      	confirmButtonColor: "#f44336"}, 
		    function(password) {
		    	this.verifyOldPasswordForDelete.bind(this)(password, userIdToDelete);
		    }.bind(this));
		else 
			swal("Sorry!", "You can delete your own account in Account Settings.", "warning");
	}
	verifyOldPasswordForDelete(password, userIdToDelete) {
		var obj = { password : password, currentUser : AppStore.getCurrentUser() };
		$.ajax({
			type: 'POST',
			url: '/verifyOldPassword',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8',
		    success : function(res) {
		    	if (!res['error']) {
		    		this.deleteAccount.bind(this)(userIdToDelete);
		    	}
		    	else {
		    		swal("Oops...", "Incorrect password.", "error");
		    	}
		    }.bind(this)
		});
	}
	handleSearch(e) {
		this.props.handleSearch(e.target.value);
	}
	handleSort(e) {
		this.props.handleSort(e.target.id);
	}
	render() {
		var icon = this.props.activeSortDirection ? "fa fa-sort-asc" : "fa fa-sort-desc";
		return(
			<div className="admin-container">
				<Button className="admin-user-reset" bsStyle="info" onClick={this.props.reset}>Reset</Button>
				<input className="form-control pull-right admin-user-search" placeholder="Search" 
							onChange={this.handleSearch.bind(this)}></input>
				<Table striped condensed hover>
					<thead>
						<tr>
							{this.props.fields.map(function(field) {
								if (field == this.props.activeSortField)
									return <th className="admin-user-sort-header admin-user-active-sort-header"
												onClick={this.handleSort.bind(this)} id={field}>
											{createHeader(field)}<span className={"pull-right " + icon}></span></th>
								else return <th className="admin-user-sort-header" 
											onClick={this.handleSort.bind(this)} id={field}>{createHeader(field)}</th>
							}.bind(this))}
						</tr>
					</thead>
					<tbody>
						{this.props.user_list.map(function(user) {
							var vals = [];
							for (var property in user) {
								vals.push(user[property])
							}
							return <tr className="admin-user-table-row" 
										onClick={() => {this.clickDeleteAccount.bind(this)(user['userID'])}}>
								{vals.map(function(val) {
								return <td>{val}</td>
								})}</tr>
						}.bind(this))}
					</tbody>
				</Table>
			</div>
		);
	}
}

