var React = require('react');
export default class ReportCommentModal extends React.Component {
	reportForSpam() {
		var obj = { comment_id : this.props.comment.comment_id,
					unique_id : this.props.comment.unique_id,
					reported_user : this.props.comment.userID,
					reason : "Spam",
					currentUser : this.props.currentUser
				};
		$.ajax({
			type : 'POST',
			url  : '/reportComment',
			data : JSON.stringify(obj, null, '\t'),
			contentType: 'application/json;charset=UTF-8',
			success : function(data) {
				swal("Thank you!", "Your report has been sent.");
			}
		});
	}
	reportForInappropriate() {
		var obj = { comment_id : this.props.comment.comment_id,
					unique_id : this.props.comment.unique_id,
					reported_user : this.props.comment.userID,
					reason : "Inappropriate",
					currentUser : this.props.currentUser
				};
		$.ajax({
			type : 'POST',
			url  : '/reportComment',
			data : JSON.stringify(obj, null, '\t'),
			contentType: 'application/json;charset=UTF-8',
			success : function(data) {
				swal("Thank you!", "Your report has been sent.");
			}
		});
	}
	render() {
		return(
			<div className="modal fade" id="ReportCommentModal" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="close">
								<span aria-hidden="true">&times;</span>
							</button>
							<h4 className="modal-title">Report for :</h4>
						</div>
						<div className="modal-body" id="ReportCommentModalBody">
							<button type="button" className="btn btn-default modal-button" data-dismiss="modal" 
									onClick={this.reportForSpam.bind(this)}>Spam</button>
							<button type="button" className="btn btn-default modal-button" data-dismiss="modal"
									onClick={this.reportForInappropriate.bind(this)}>Inappropriate</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

}