var React = require('react');
// var $ = require('jquery');
export default class EditPostModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {postContent : this.props.post.postContent};
		this.handlePostEditChange = this.handlePostEditChange.bind(this);
		this.handlePostEditSubmit = this.handlePostEditSubmit.bind(this);
	}
	handlePostEditChange(e) {
		this.setState({ postContent : e.target.value});
	}
	handlePostEditSubmit() {
		var obj = {unique_id : this.props.post.unique_id,
						field_name : "body", 
						field_data : this.state.postContent};

		$.ajax({
			type : 'POST',
			url  : '/editPost',
			data : JSON.stringify(obj, null, '\t'),
			contentType: 'application/json;charset=UTF-8'
		});
		this.props.refreshFeed();
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ postContent : nextProps.post.postContent });
	}
	render() {
		return(
			<div className="modal fade" id="EditPostModal" aria-hidden="true">
				<div className="modal-dialog" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal" aria-label="close">
								<span aria-hidden="true">&times;</span>
							</button>
							<h4 className="modal-title">Edit Post</h4>
						</div>
						<div className="modal-body" id="EditPostModalBody">
							<textarea className="form-control EditFeedPostBody" id="FeedPostBody" 
									value={this.state.postContent} 
									onChange={this.handlePostEditChange}></textarea>
						</div>
						<div className="modal-footer">
							<button id="epm_submit" type="button" className="btn btn-default" data-dismiss="modal" 
									onClick={this.handlePostEditSubmit}>Submit</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}