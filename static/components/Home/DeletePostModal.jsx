var React = require('react');
export default class DeletePostModal extends React.Component {
	handlePostDelete() {
		var obj = {unique_id : this.props.post.unique_id};
		$.ajax({
			type : 'POST',
			url  : '/deletePost',
			data : JSON.stringify(obj, null, '\t'),
			contentType: 'application/json;charset=UTF-8'
		});
		this.props.handlePostDelete(this.props.post);
	}
	render() {
		return(
			<div className="modal fade" id="DeletePostModal" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="close">
								<span aria-hidden="true">&times;</span>
							</button>
							<h4 className="modal-title">Are you sure you want to delete?</h4>
						</div>
						<div className="modal-body" id="DeletePostModalBody">
							<button id="dpm_yes" type="button" className="btn btn-default" data-dismiss="modal" 
									onClick={this.handlePostDelete.bind(this)}>Yes</button>
							<button id="dpm_no" type="button" className="btn btn-default" data-dismiss="modal">No</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}