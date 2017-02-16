var React = require('react');
export default class EditCommentModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {commentContent : this.props.comment.commentContent};
	}
	handleCommentEditChange(e) {
		this.setState({ commentContent : e.target.value});
	}
	handleCommentEditSubmit() {
		var obj = {unique_id : this.props.comment.unique_id,
						field_name : "body", 
						field_data : this.state.commentContent};

		$.ajax({
			type : 'POST',
			url  : '/editComment',
			data : JSON.stringify(obj, null, '\t'),
			contentType: 'application/json;charset=UTF-8'
		});
		this.props.handleCommentEdit(this.props.comment, this.state.commentContent);
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ commentContent : nextProps.comment.commentContent });
	}
	render() {
		return(
			<div className="modal fade" id="EditCommentModal" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="close">
								<span aria-hidden="true">&times;</span>
							</button>
							<div className="modal-title">Edit Comment</div>
						</div>
						<div className="modal-body" id="EditCommentModalBody">
							<textarea className="form-control edit-post" id="FeedCommentBody" 
									value={this.state.commentContent} 
									onChange={this.handleCommentEditChange.bind(this)}></textarea>
						</div>
						<div className="modal-footer">
							<button id="ecm_submit" type="button" className="btn post-button" data-dismiss="modal" 
									onClick={this.handleCommentEditSubmit.bind(this)}>Submit</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}