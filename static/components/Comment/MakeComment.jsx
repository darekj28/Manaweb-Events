var React = require('react');
export default class MakeComment extends React.Component {
	constructor(props) {
		super(props);
		this.state = { canPost : true };
	}
	componentDidMount() {
		var messageVisible = true;
		var that = this;
		$('.post-button').click(function() {
			$(this).blur();
		});
		$('.post-button').focus(function() {
			$(this).blur();
		});
		$('#CommentPost').hide();
		$('#ToggleComment').click(function() {
			$('#CommentPost').slideToggle(function() {
				$('#CommentInput').focus();
			});
		})
	}
	handleCommentSubmit() {
		if (!this.state.canPost) swal("Yo!", "Please wait 10 seconds between comments.", "warning");
		else {
			if (this.commentText.value.trim().length > 0) {
				this.setState({ canPost : false, timeout : setTimeout(this.allowPost.bind(this), 10000) });
				this.props.onCommentSubmit(this.commentText.value);
			}
			else 
				swal("Oops...", "You can't post an empty message!", "error");
		}
	}
	allowPost() {
		clearTimeout(this.state.timeout);
		this.setState({ canPost : true });
	}
	handleCommentChange() {
		this.props.onCommentChange(this.commentText.value);
	}
	componentWillUnmount() {
		clearTimeout(this.state.timeout);
	}
	render() {
		return(
			<div id="MakeComment"> 
				<div id="ToggleComment" className="important-text">Reply to {this.props.op}...</div>
				<div id="CommentPost">
					<textarea id="CommentInput" className="form-control important-text" 
							value={this.props.commentText} 
							placeholder={this.props.placeholder} rows="4" ref={(input) => this.commentText = input} 
							onChange={this.handleCommentChange.bind(this)}></textarea>
					<div className="input-group-addon">
						<button className="btn post-button SubmitButton" onClick={this.handleCommentSubmit.bind(this)}><b>Comment</b></button>
					</div>
				</div>
			</div>);
	}
}