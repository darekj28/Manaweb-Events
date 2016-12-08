var React = require('react');
var $ = require('jquery');
export default class EditCommentModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {commentContent : this.props.comment.commentContent};
		this.handleCommentEditChange = this.handleCommentEditChange.bind(this);
		this.handleCommentEditSubmit = this.handleCommentEditSubmit.bind(this);
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
		this.props.refreshFeed();
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
							<h4 className="modal-title">Edit Comment</h4>
						</div>
						<div className="modal-body" id="EditCommentModalBody">
							<textarea className="form-control EditFeedCommentBody" id="FeedCommentBody" 
									value={this.state.commentContent} 
									onChange={this.handleCommentEditChange}></textarea>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal" 
									onClick={this.handleCommentEditSubmit}>Submit</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}