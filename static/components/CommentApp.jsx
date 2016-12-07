var React = require('react');
import CommentNavBar from "CommentNavBar.jsx";
import CommentFeedPost from "CommentFeedPost.jsx";
import CommentFeed from "CommentFeed.jsx";
import MakeComment from "MakeComment.jsx";

function getParameterByName(name, url) {
  	if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export default class CommentApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			actions : [],
			search : '',
			comment : '',
			feed : [],
			currentUser : '',
			comment_id : getParameterByName('id', window.location.href),
			unique_id : '',
			original_post : []
		};
		// this.handleFilterClick = this.handleFilterClick.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleCommentChange = this.handleCommentChange.bind(this);
		this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
		this.getNextUniqueId = this.getNextUniqueId.bind(this);
		this.getCurrentUserInfo = this.getCurrentUserInfo.bind(this);
		this.getPostById = this.getPostById.bind(this);
		this.refreshFeed = this.refreshFeed.bind(this);
	}
	getNextUniqueId() {
		$.post('/generateUniqueId', function(data) {
			this.setState({ unique_id : data.unique_id });
		}.bind(this));
	}
	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', function(data) {
			this.setState({currentUser : data.thisUser});
		}.bind(this));
	}
	getPostById() {
		$.post('/getPostById', {comment_id : this.state.comment_id}, 
			function(data) {
				var this_post = this.state.original_post;
					this_post = {
						commentContent : data.this_post['body'],
						avatar 		: data.this_post['avatar_url'],
						name 		: data.this_post['first_name'] + ' ' + data.this_post['last_name'],
						userID 		: data.this_post['poster_id'],
						time  		: data.this_post['time']
					}
				this.setState({original_post : this_post});
			}.bind(this));

	}
	refreshFeed() {
		$.post('/getComments', {comment_id : this.state.comment_id}, function(data) {
			var feed = [];
			data.comment_list.map(function(obj) {
				feed.push({
					commentContent : obj['body'],
					avatar 		: obj['avatar_url'],
					name 		: obj['first_name'] + ' ' + obj['last_name'],
					userID 		: obj['poster_id'],
					time  		: obj['time'],
					unique_id	: obj['unique_id']
				});
			});
			this.setState({feed : feed});
		}.bind(this));
	}
	handleSearch(searchText) { this.setState({search : searchText}); }
	handleCommentChange(commentText) { this.setState({comment : commentText}); }
	handleCommentSubmit(commentText) {
		var feed = this.state.feed;
		feed.push({ commentContent: commentText, 
					avatar  : this.state.currentUser['avatar_url'], 
					name    : this.state.currentUser['first_name'] + " " + this.state.currentUser['last_name'],
					userID  : this.state.currentUser['userID'], 
					time	: "just now", 
					unique_id : this.state.unique_id
				});

		var obj = {commentContent : commentText, 
					comment_id : this.state.comment_id,
					unique_id : this.state.unique_id};

		$.ajax({
			type : 'POST',
			url  : '/makeComment',
			data : JSON.stringify(obj, null, '\t'),
		    contentType: 'application/json;charset=UTF-8'
		});
		this.setState({feed : feed, comment: ''});
		$('#CommentFeed').animate({scrollTop: $('#CommentFeed').prop("scrollHeight")}, 300);
		this.getNextUniqueId();
		this.refreshFeed();
	}
	componentDidMount() {
		this.refreshFeed();
		this.getCurrentUserInfo();
		this.getPostById();
		this.getNextUniqueId();

		$('.filterButton').click(function(e) {
			$(this).toggleClass('icon-danger');
			$(this).toggleClass('icon-success');
			$(this).blur();
			e.preventDefault();
		});
	}
	render() {
		return (<div id="CommentApp">
			<CommentNavBar searchText={this.state.search} onSearch={this.handleSearch} />
			<div className="container">
				<CommentFeedPost comment={this.state.original_post} isOriginalPost={true}/>
				<CommentFeed currentUser={this.state.currentUser} searchText={this.state.search} filters={this.state.filters} 
							refreshFeed={this.refreshFeed} comments={this.state.feed} />
				<MakeComment placeholder="What's up bro?" commentText={this.state.comment} 
						onCommentChange ={this.handleCommentChange} onCommentSubmit={this.handleCommentSubmit}/>
			</div>
		</div>);
	}
}
