var React = require('react');
// var $ = require('jquery');
export default class MakeComment extends React.Component {
	constructor(props) {
		super(props);
		this.handleCommentChange = this.handleCommentChange.bind(this);
		this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
		this.handleEnterPress = this.handleEnterPress.bind(this);
	}
	componentDidMount() {
		var messageVisible = true;
		var that = this;
		$('#SubmitButtonComment').click(function() {
			$(this).blur();
		});
		$('#StartButtonComment').click(function(){
			$(this).blur();
	        if(!messageVisible){
	            messageVisible = !messageVisible;
	            $(this).siblings('#CommentComment').fadeIn(function(){
	                $(this).children('#CommentTextComment').focus();
	            });
	        } else {
	            messageVisible = !messageVisible;
	            $(this).siblings('#CommentComment').fadeOut(function(){
	                $(this).children('#CommentTextComment').blur();
	            });
	        } 
	    });  
	}
	handleCommentSubmit() {
		if (this.commentText.value.length > 0)
			this.props.onCommentSubmit(this.commentText.value);
	}
	handleCommentChange() {
		this.props.onCommentChange(this.commentText.value);
	}
	handleEnterPress(target) {
		if (this.commentText.value.length > 0)
		    if (target.charCode==13)
		        this.props.onCommentSubmit(this.commentText.value); 
	}
	render() {
		return(
			<div> 
				<a id="StartButtonComment" className="StartButton">
					<span className="glyphicon glyphicon-pencil AppGlyphicon"></span>
				</a>
				<div id="CommentComment" className="Message pull-right input-group input-group-unstyled">
					<input id="CommentTextComment" type="text" className="CommentText form-control" 
							onKeyPress={this.handleEnterPress} value={this.props.commentText} 
							placeholder={this.props.placeholder} ref={(input) => this.commentText = input} 
							onSubmit={this.handleCommentSubmit} onChange={this.handleCommentChange}></input>
				
					<a className="SubmitButton input-group-addon" id="SubmitButtonComment"
							onClick={this.handleCommentSubmit}>
						<span className="glyphicon glyphicon-send AppGlyphicon"></span>
					</a>
				
				</div>
			</div>);
	}
}