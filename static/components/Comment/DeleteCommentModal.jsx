var React = require('react');

export default class DeleteCommentModal extends React.Component {
	handleCommentDelete() {
		var obj = {feed_name : "BALT", 
					comment_id : this.props.comment.comment_id,
					unique_id : this.props.comment.unique_id};
		$.ajax({
			type : 'POST',
			url  : '/deleteComment',
			data : JSON.stringify(obj, null, '\t'),
			contentType: 'application/json;charset=UTF-8'
		});
		this.props.handleCommentDelete(this.props.comment);
	}
	render() {
		return(
			<div className="modal fade" id="DeleteCommentModal" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="close">
								<span aria-hidden="true">&times;</span>
							</button>
							<h4 className="modal-title">Are you sure you want to delete?</h4>
						</div>
						<div className="modal-body" id="DeleteCommentModalBody">
							<button id='dcm_yes' type="button" className="btn btn-default" data-dismiss="modal" 
									onClick={this.handleCommentDelete.bind(this)}>Yes</button>
							<button id="dcm_no" type="button" className="btn btn-default" data-dismiss="modal">No</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}