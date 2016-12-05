class DeleteCommentModal extends React.Component {
	constructor(props) {
		super(props);
		this.handleCommentDelete = this.handleCommentDelete.bind(this);
	}
	handleCommentDelete() {
		var obj = {feed_name : "BALT", unique_id : this.props.comment.unique_id};
		$.ajax({
			type : 'POST',
			url  : '/deleteComment',
			data : JSON.stringify(obj, null, '\t'),
			contentType: 'application/json;charset=UTF-8'
		});
		this.props.refreshFeed();
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
							<button type="button" className="btn btn-default" data-dismiss="modal" 
									onClick={this.handleCommentDelete}>Yes</button>
							<button type="button" className="btn btn-default" data-dismiss="modal">No</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}