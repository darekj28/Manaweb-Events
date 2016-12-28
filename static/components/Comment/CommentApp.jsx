var React = require('react');
import CommentNavBar from "./CommentNavBar.jsx";
import CommentFeedPost from "./CommentFeedPost.jsx";
import CommentFeed from "./CommentFeed.jsx";
import MakeComment from "./MakeComment.jsx";
// var $ = require('jquery');

export default class CommentApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			search : '',
			comment : '',
			feed : [],
			currentUser : '',
			comment_id : this.props.params.comment_id,
			unique_id : '',
			original_post : []
		};
	}
	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', function(data) {
			this.setState({currentUser : data.thisUser});
		}.bind(this));
	}
	getPostById(comment_id) {
		$.post('/getPostById', {comment_id : comment_id}, 
			function(data) {
				if (!data.this_post) {
					$('#MakeComment').hide();
					$('#OriginalPost').hide();
					this.setState({ original_post : [], feed : [], deleted : true });
				}
				else {
					$('#MakeComment').show();
					$('#OriginalPost').show();
					this.setState({ deleted : false });
					var this_post = {
						commentContent : data.this_post['body'],
						avatar 		: data.this_post['avatar_url'],
						name 		: data.this_post['first_name'] + ' ' + data.this_post['last_name'],
						userID 		: data.this_post['poster_id'],
						time  		: data.this_post['time'],
						timeString  : data.this_post['timeString']
					}
					this.setState({original_post : this_post});
				}
			}.bind(this));
	}
	
	refreshFeed(comment_id) {
		$.post('/getComments', {comment_id : comment_id}, function(data) {
			if (data.comment_list) {
				var feed = [];
				data.comment_list.map(function(obj) {
					feed.push({
						commentContent : obj['body'],
						avatar 		: obj['avatar_url'],
						name 		: obj['first_name'] + ' ' + obj['last_name'],
						userID 		: obj['poster_id'],
						time  		: obj['time'],
						comment_id  : obj['comment_id'],
						unique_id	: obj['unique_id'],
						timeString  : obj['timeString']
					});
				});
				this.setState({feed : feed});
			}
		}.bind(this));
	}
	handleSearch(searchText) { 
		$("html, body").animate({ scrollTop: $('#CommentFeed').prop('scrollHeight') }, 300);
		this.setState({search : searchText}); 
	}
	handleTypingComment(commentText) { this.setState({comment : commentText}); }
	handleCommentSubmit(commentText) {
		var feed = this.state.feed;
		feed.push({ commentContent: commentText, 
					avatar  : this.state.currentUser['avatar_url'], 
					name    : this.state.currentUser['first_name'] + " " + this.state.currentUser['last_name'],
					userID  : this.state.currentUser['userID'], 
					time	: "just now", 
					comment_id : this.state.comment_id
				});

		var obj = {commentContent : commentText, 
					comment_id : this.state.comment_id
				};

		$.ajax({
			type : 'POST',
			url  : '/makeComment',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8'
		});
		this.setState({feed : feed, comment: ''});
		$("html, body").animate({ scrollTop: $('#CommentFeed').prop('scrollHeight') }, 300);
	}
	handleCommentEdit(post, editedContent) {
		var feed = this.state.feed;
		for (var i = 0; i < feed.length; i++) {
			if (feed[i].unique_id == post.unique_id) {
				post['commentContent'] = editedContent;
				feed[i] = post;
				break;
			}
		}
		this.setState({ feed : feed });
	}
	handleCommentDelete(post) {
		var feed = this.state.feed;
		var index;
		for (var i = 0; i < feed.length; i++) {
			if (feed[i].unique_id == post.unique_id) {
				index = i;
				break;
			}
		}
		feed.splice(index, 1);
		this.setState({ feed : feed });
	}
	componentWillReceiveProps(nextProps) {
		this.setState({ comment_id : nextProps.params.comment_id });
		this.refreshFeed.bind(this)(nextProps.params.comment_id);
		this.getPostById.bind(this)(nextProps.params.comment_id);
	}
	componentDidMount() {
		this.getCurrentUserInfo.bind(this)();
		this.refreshFeed.bind(this)(this.state.comment_id);
		this.getPostById.bind(this)(this.state.comment_id);
		$('#MakeComment').hide();
		$('#OriginalPost').hide();
	}
	render() {
		var name = this.state.currentUser['first_name'] + " " + this.state.currentUser['last_name'];
		return (<div id="CommentApp">
					<CommentNavBar 
						 searchText={this.state.search} onSearch={this.handleSearch.bind(this)} currentUser={this.state.currentUser}
								name={name}/>
					<div className="container app-container">
						{this.state.deleted && 
						<div className="alert alert-danger">
				  			<strong>Bro!</strong> This post is deleted.
						</div>}
						<div id="OriginalPost" className="app row">
							<CommentFeedPost comment={this.state.original_post} isOriginalPost={true}/>
						</div>
						<div className="app row">
							<MakeComment placeholder="What's up bro?" commentText={this.state.comment} 
								onCommentChange ={this.handleTypingComment.bind(this)} onCommentSubmit={this.handleCommentSubmit.bind(this)}/>
						</div>
						<div className="app row">
							<CommentFeed currentUser={this.state.currentUser} searchText={this.state.search} 
									filters={this.state.filters} 
									handleCommentEdit={this.handleCommentEdit.bind(this)}
									handleCommentDelete={this.handleCommentDelete.bind(this)}
									comments={this.state.feed} />
						</div>
					</div>
				</div>);
	}
}
