var React = require('react');
import AppStore from '../../../stores/AppStore.jsx';

export default class EditPostModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {postContent : this.props.post.postContent};
	}
	handlePostEditChange(e) {
		this.setState({ postContent : e.target.value});
	}
	handlePostEditSubmit() {
		var obj = {unique_id : this.props.post.unique_id,
					userID : AppStore.getCurrentUser()['userID'],
						field_name : "body", 
						field_data : this.state.postContent,
						jwt : localStorage.jwt};
		
		$.ajax({
			type : 'POST',
			url  : '/editPost',
			data : JSON.stringify(obj, null, '\t'),
			contentType: 'application/json;charset=UTF-8',
			success : function(data) {
				if (data['result'] == 'success')
					swal({title : "Success!", 
						text: "The post has been edited.", 
						type: "success",
						confirmButtonColor: "#80CCEE",
							confirmButtonText: "OK"
					});
				else 
					swal({title : "Sorry!", 
						text: "This post was deleted.", 
						type: "error",
						confirmButtonColor: "#80CCEE",
							confirmButtonText: "OK"
					});
			},
			error : function(data) {
				swal({title : "Sorry!", 
					text: "This post was deleted.", 
					type: "error",
					confirmButtonColor: "#80CCEE",
						confirmButtonText: "OK"
				});
			}
		});
		if (this.props.handlePostEdit)
			this.props.handlePostEdit(this.props.post, this.state.postContent);
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
							<div className="modal-title">Edit Post</div>
						</div>
						<div className="modal-body" id="EditPostModalBody">
							<textarea className="form-control edit-post" id="FeedPostBody" 
									value={this.state.postContent} 
									onChange={this.handlePostEditChange.bind(this)}></textarea>
						</div>
						<div className="modal-footer">
							<button id="epm_submit" type="button" className="btn post-button" data-dismiss="modal" 
									onClick={this.handlePostEditSubmit.bind(this)}>Submit</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}