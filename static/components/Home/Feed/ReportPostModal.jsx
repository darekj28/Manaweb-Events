var React = require('react');
export default class ReportPostModal extends React.Component {
	reportForSpam() {
		var obj = {unique_id : this.props.post.unique_id,
					reported_user : this.props.post.userID,
					reason : "Spam",
					currentUser : this.props.currentUser
				};
		$.ajax({
			type : 'POST',
			url  : '/reportPost',
			data : JSON.stringify(obj, null, '\t'),
			contentType: 'application/json;charset=UTF-8'
		});
	}
	reportForInappropriate() {
		var obj = {unique_id : this.props.post.unique_id,
					reported_user : this.props.post.userID,
					reason : "Inappropriate",
					currentUser : this.props.currentUser
				};
		$.ajax({
			type : 'POST',
			url  : '/reportPost',
			data : JSON.stringify(obj, null, '\t'),
			contentType: 'application/json;charset=UTF-8'
		});
	}
	render() {
		return(
			<div className="modal fade" id="ReportPostModal" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="close">
								<span aria-hidden="true">&times;</span>
							</button>
							<h4 className="modal-title">Report for:</h4>
						</div>
						<div className="modal-body" id="ReportPostModalBody">
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