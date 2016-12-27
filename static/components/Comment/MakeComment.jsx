var React = require('react');
// var $ = require('jquery');
export default class MakeComment extends React.Component {
	constructor(props) {
		super(props);
		this.handleCommentChange = this.handleCommentChange.bind(this);
		this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
	}
	componentDidMount() {
		var messageVisible = true;
		var that = this;
		$('#SubmitButtonComment').click(function() {
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
				<div id="ToggleComment"><h4>Make a comment...</h4></div>
				<div id="CommentPost">
					<textarea id="CommentInput" className="form-control" 
							value={this.props.commentText} 
							placeholder={this.props.placeholder} rows="2" ref={(input) => this.commentText = input} 
							onSubmit={this.handleCommentSubmit} onChange={this.handleCommentChange}></textarea>
					<div className="SubmitButton input-group-addon"
							onClick={this.handleCommentSubmit}>
						<span className="AppGlyphicon"><h4><b>POST!</b></h4></span>
					</div>
				</div>
			</div>);
	}
}