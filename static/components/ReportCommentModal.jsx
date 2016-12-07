var React = require('react');
export default class ReportCommentModal extends React.Component {
	constructor(props) {
		super(props);
		this.reportForSpam = this.reportForSpam.bind(this);
		this.reportForInappropriate = this.reportForInappropriate.bind(this);
	}
	reportForSpam() {
		var obj = {unique_id : this.props.comment.unique_id,
					reported_user : this.props.comment.userID,
					reason : "Spam"};
		$.ajax({
			type : 'POST',
			url  : '/reportComment',
			data : JSON.stringify(obj, null, '\t'),
			contentType: 'application/json;charset=UTF-8'
		});
	}
	reportForInappropriate() {
		var obj = {unique_id : this.props.comment.unique_id,
					reported_user : this.props.comment.userID,
					reason : "Inappropriate"};
		$.ajax({
			type : 'POST',
			url  : '/reportComment',
			data : JSON.stringify(obj, null, '\t'),
			contentType: 'application/json;charset=UTF-8'
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
							<button type="button" className="btn btn-default" data-dismiss="modal" 
									onClick={this.reportForSpam}>Spam</button>
							<button type="button" className="btn btn-default" data-dismiss="modal"
									onClick={this.reportForInappropriate}>Inappropriate</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

}