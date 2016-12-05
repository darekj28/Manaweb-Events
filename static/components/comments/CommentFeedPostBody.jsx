class CommentFeedPostBody extends React.Component {
	render() {
		var post = this.props.isOriginalPost ? (<h2>{this.props.content}</h2>) : <div>{this.props.content}</div>;
		return(
			<div className="CommentFeedPostBody">
				{post}
			</div>
		)
	}
}