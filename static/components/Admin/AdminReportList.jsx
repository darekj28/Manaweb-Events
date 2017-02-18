var React = require('react');
var browserHistory = require('react-router').browserHistory;
import {Button, Table} from 'react-bootstrap';
import EditPostModal from '../Home/Feed/EditPostModal.jsx';
import EditCommentModal from '../Comment/EditCommentModal.jsx';
import AppStore from '../../stores/AppStore.jsx';
function createHeader(field) {
	if (field == "post") return "Reported Post";
	else if (field == "reason") return "Violation";
	else if (field == "reporter") return "Reporter ID";
	else if (field == "recipient") return "Recipient ID";
	else if (field == "description") return "Additional Comments";
	else if (field == "timeString") return "Date Reported";
	else if (field == "isComment") return "Type";
}
export default class AdminReportList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			postInModal : {},
			commentInModal : {}
		}
	}
	handleSearch(e) {
		this.props.handleSearch(e.target.value);
	}
	handleSort(e) {
		this.props.handleSort(e.target.id);
	}
	goToPost(comment_id) {	
		browserHistory.push('/comment/' + comment_id);
	}
	editPost(content, unique_id) {
		var obj = {postContent : content, unique_id : unique_id};
		this.setState({postInModal : obj});
		$('#EditPostModal').modal('show');
	}
	editComment(content, unique_id) {
		var obj = {commentContent : content, unique_id : unique_id};
		this.setState({commentInModal : obj});
		$('#EditCommentModal').modal('show');
	}
	deletePost(comment_id, recipient) {
		swal({
	      	title: "Are you sure you want to delete " + recipient + "'s post?", 
		    showCancelButton: true,
	      	closeOnConfirm: false,
	      	confirmButtonText: "Yes, I'm sure!",
	      	confirmButtonColor: "#80CCEE"}, 
	    	function() {
	    	var obj = {unique_id : comment_id,
	    			userID : AppStore.getCurrentUser()['userID'],
					jwt: localStorage.jwt};
			$.ajax({
				type : 'POST',
				url  : '/deletePost',
				data : JSON.stringify(obj, null, '\t'),
				contentType: 'application/json;charset=UTF-8',
				success: function(data) {
					if (data['result'] == 'success')
						swal({title : "Success!", 
							text: "The post has been deleted.", 
							type: "success",
							confirmButtonColor: "#80CCEE",
			  				confirmButtonText: "OK"
						});
					else
						swal({title : "Sorry!", 
							text: "This post was already deleted.", 
							type: "error",
							confirmButtonColor: "#80CCEE",
			  				confirmButtonText: "OK"
						});
				}.bind(this),
				error : function() {
					swal({title : "Sorry!", 
						text: "This post was already deleted.", 
						type: "error",
						confirmButtonColor: "#80CCEE",
		  				confirmButtonText: "OK"
					});
				}
			});
	    }.bind(this));
	}
	deleteComment(comment_id, unique_id, recipient) {
		if (!unique_id) {
			swal("Comments don't have sufficient fields in the report table!");
			return;
		}
		swal({
	      	title: "Are you sure you want to delete " + recipient + "'s comment?", 
		    showCancelButton: true,
	      	closeOnConfirm: false,
	      	confirmButtonText: "Yes, I'm sure!",
	      	confirmButtonColor: "#80CCEE"}, 
	    	function() {
	    	var obj = {feed_name : "BALT", 
					comment_id : comment_id,
					unique_id : unique_id}
			$.ajax({
				type : 'POST',
				url  : '/deleteComment',
				data : JSON.stringify(obj, null, '\t'),
				contentType: 'application/json;charset=UTF-8',
				success: function(data) {
					if (data['result'] == 'success')
						swal({title : "Success!", 
							text: "The comment has been deleted.", 
							type: "success",
							confirmButtonColor: "#80CCEE",
			  				confirmButtonText: "OK"
						});
					else
						swal({title : "Sorry!", 
							text: "This comment was already deleted.", 
							type: "error",
							confirmButtonColor: "#80CCEE",
			  				confirmButtonText: "OK"
						});
				}.bind(this),
				error : function() {
					swal({title : "Sorry!", 
						text: "This comment was already deleted.", 
						type: "error",
						confirmButtonColor: "#80CCEE",
		  				confirmButtonText: "OK"
					});
				}
			});
	    }.bind(this));
	}
	render() {
		var icon = this.props.activeSortDirection ? "fa fa-sort-asc" : "fa fa-sort-desc";
		return(
			<div className="admin-tab-container">
				<Button className="admin-user-reset" bsStyle="info" onClick={this.props.reset}>Reset</Button>
				<input className="form-control pull-right admin-user-search" placeholder="Search" value={this.props.searchQuery}
							onChange={this.handleSearch.bind(this)}></input>
				<Table striped condensed hover>
					<thead>
						<tr>
							{this.props.fields.map(function(field) {
								if (field == "comment_id" || field == "unique_id") return;
								if (field == this.props.activeSortField)
									return <th className="admin-user-sort-header admin-user-active-sort-header"
												onClick={this.handleSort.bind(this)} id={field}>
											{createHeader(field)}<span className={"pull-right " + icon}></span></th>
								else return <th className="admin-user-sort-header" 
											onClick={this.handleSort.bind(this)} id={field}>{createHeader(field)}</th>
							}.bind(this))}
							<th/>
							<th/>
							<th/>
						</tr>
					</thead>
					<tbody>
						{this.props.report_list.map(function(report) {
							var vals = [];
							for (var property in report) {
								if (property != "comment_id" && property != "unique_id")
									vals.push(report[property])
							}
							if (report['isComment'] == 'Post')
								return <tr>
									{vals.map(function(val) {
									return <td className="admin-table-data">{val}</td>
									})}
									<td className="admin-table-icon" onClick={() => {this.goToPost(report['comment_id'])}}><span className="fa fa-share"></span></td>
									<td className="admin-table-icon" onClick={() => {this.editPost.bind(this)(report['post'], report['comment_id'])}}><span className="fa fa-edit"></span></td>
									<td className="admin-table-icon" onClick={() => {this.deletePost.bind(this)(report['comment_id'], report['recipient'])}}><span className="fa fa-trash-o"></span></td>
									</tr>
							else if (report['isComment'] == 'Comment')
								return <tr>
									{vals.map(function(val) {
									return <td className="admin-table-data">{val}</td>
									})}
									<td className="admin-table-icon" onClick={() => {this.goToPost(report['comment_id'])}}><span className="fa fa-share"></span></td>
									<td className="admin-table-icon" onClick={() => {this.editComment.bind(this)(report['post'], report['unique_id'])}}><span className="fa fa-edit"></span></td>
									<td className="admin-table-icon" onClick={() => {this.deleteComment.bind(this)(report['comment_id'], report['unique_id'], report['recipient'])}}><span className="fa fa-trash-o"></span></td>
									</tr>
						}.bind(this))}
					</tbody>
				</Table>
				<EditPostModal post={this.state.postInModal}/>
				<EditCommentModal comment={this.state.commentInModal}/>
			</div>
		);
	}
}

