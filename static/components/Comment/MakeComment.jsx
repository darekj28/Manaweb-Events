var React = require('react');
export default class MakeComment extends React.Component {
	componentDidMount() {
		var messageVisible = true;
		var that = this;
		$('.post-button').click(function() {
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
		if (this.commentText.value.trim().length > 0)
			this.props.onCommentSubmit(this.commentText.value);
	}
	handleCommentChange() {
		this.props.onCommentChange(this.commentText.value);
	}
	render() {
		return(
			<div id="MakeComment"> 
				<div id="ToggleComment"><h4>Reply to {this.props.op}...</h4></div>
				<div id="CommentPost">
					<textarea id="CommentInput" className="form-control" 
							value={this.props.commentText} 
							placeholder={this.props.placeholder} rows="2" ref={(input) => this.commentText = input} 
							onChange={this.handleCommentChange.bind(this)}></textarea>
					<div className="SubmitButton input-group-addon"
							onClick={this.handleCommentSubmit.bind(this)}>
						<button className="btn post-button">COMMENT!</button>
					</div>
				</div>
			</div>);
	}
}