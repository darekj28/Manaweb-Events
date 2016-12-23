var React = require('react');
import SearchNavBar from 'SearchNavBar.jsx';
import EventName from 'EventName.jsx';
import MakePost from 'MakePost.jsx';
import Feed from 'Feed.jsx';
// var $ = require('jquery');

function toggle(collection, item) {
	var idx = collection.indexOf(item);
	if(idx !== -1) collection.splice(idx, 1);
	else collection.push(item);
	return collection;
}

function contains(collection, item) {
	if(collection.indexOf(item) !== -1) return true;
	else return false;
}
var feed_name = "BALT";
var actions = ['Trade', 'Play', 'Chill'];
export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filters : ['Trade', 'Play', 'Chill'],
			actions : [],
			search : '',
			userIdToFilterPosts : '',
			post : '',
			feed : [],
			currentUser : {},
			numUnseenPosts : -1
		};
		this.handleFilterClick = this.handleFilterClick.bind(this);
		this.handleFilterUser = this.handleFilterUser.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleTypingPost = this.handleTypingPost.bind(this);
		this.handlePostSubmit = this.handlePostSubmit.bind(this);
		this.handlePostEdit = this.handlePostEdit.bind(this);
		this.handlePostDelete = this.handlePostDelete.bind(this);
		this.getCurrentUserInfo = this.getCurrentUserInfo.bind(this);
		this.markPostFeedAsSeen = this.markPostFeedAsSeen.bind(this);
		this.setNumUnseenPosts = this.setNumUnseenPosts.bind(this);
		this.refreshFeed = this.refreshFeed.bind(this);
	}
	getCurrentUserInfo() {
		$.post('/getCurrentUserInfo', function(data) {
			this.setState({currentUser : data.thisUser});
		}.bind(this));
	}

	markPostFeedAsSeen() {
		$.post('/markPostFeedAsSeen', {feed_name: feed_name});
	}

	setNumUnseenPosts(){
		$.post('getNumUnseenPosts', {feed_name: feed_name},
			function(data){
				this.setState({numUnseenPosts : data['numUnseenPosts']})
			}.bind(this));
	}

	refreshFeed() {
		var that = this;
		$.post('/getPosts', function(data){
			var feed = [];
			data.post_list.map(function(obj) {
				feed.unshift({
					postContent : obj['body'],
					avatar 		: obj['avatar_url'],
					name 		: obj['first_name'] + ' ' + obj['last_name'],
					userID 		: obj['poster_id'],
					time  		: obj['time'],
					isTrade 	: obj['isTrade'],
					isPlay 		: obj['isPlay'],
					isChill 	: obj['isChill'],
					comment_id  : obj['comment_id'],
					unique_id   : obj['unique_id'],
					numberOfComments : obj['numComments']
				});
				
			});
			this.setState({feed : feed});
		}.bind(this));
	}

	handleFilterClick(filter, isSearch) {
		if (isSearch) {
			var newFilters = toggle(this.state.filters, filter);
			this.setState({filters : newFilters});
		}
		else {
			var newFilters = toggle(this.state.actions, filter);
			this.setState({actions : newFilters});
			if (this.state.actions.length != 0) this.setState({alert : false});
		}
		$('html, body').animate({scrollTop: 0}, 300);
	}
	handleFilterUser(user) {
		if (user != this.state.userIdToFilterPosts) this.setState({ userIdToFilterPosts : user });
		else this.setState({ userIdToFilterPosts : ''});
	}
	handleSearch(searchText) { 
		$('html, body').animate({scrollTop: 0}, 300);
		this.setState({search : searchText});
	}
	handleTypingPost(postText) {this.setState({post : postText});}
	handlePostSubmit(postText) {
		var feed = this.state.feed;
		if (this.state.actions.length == 0) this.setState({alert : true});
		else {
			this.setState({alert : false});
			feed.unshift({ postContent: postText, 
						avatar  : this.state.currentUser['avatar_url'], 
						name    : this.state.currentUser['first_name'] + " " + this.state.currentUser['last_name'],
						userID  : this.state.currentUser['userID'], 
						time	: "just now", 
						isTrade : contains(this.state.actions, "Trade"),
						isPlay  : contains(this.state.actions, "Play"), 
						isChill : contains(this.state.actions, "Chill"),
						numberOfComments : 0,
					});
			var obj = {postContent : postText, 
						isTrade : contains(this.state.actions, "Trade"),
						isPlay  : contains(this.state.actions, "Play"), 
						isChill : contains(this.state.actions, "Chill"),
						numberOfComments : 0
					};
			$.ajax({
				type : 'POST',
				url  : '/makePost',
				data : JSON.stringify(obj, null, '\t'),
			    contentType: 'application/json;charset=UTF-8'
			});
			this.setState({feed : feed, post: ''});
			$('html, body').animate({scrollTop: 0}, 300);
		}
		this.refreshFeed();
	}
	handlePostEdit(post, editedContent) {
		var feed = this.state.feed;
		for (var i = 0; i < feed.length; i++) {
			if (feed[i].comment_id == post.comment_id) {
				post['postContent'] = editedContent;
				feed[i] = post;
				break;
			}
		}
		this.setState({ feed : feed });
	}
	handlePostDelete(post) {
		var feed = this.state.feed;
		var index;
		for (var i = 0; i < feed.length; i++) {
			if (feed[i].comment_id == post.comment_id) {
				index = i;
				break;
			}
		}
		feed.splice(index, 1);
		this.setState({ feed : feed });
	}
	componentDidMount() {
		this.refreshFeed();
		this.markPostFeedAsSeen();
		this.getCurrentUserInfo();
		this.setNumUnseenPosts();

		$('.filterButton').click(function(e) {
			$(this).toggleClass('icon-danger');
			$(this).toggleClass('icon-success');
			$(this).blur();
			e.preventDefault();
		});
	}
	render() {
		var name = this.state.currentUser['first_name'] + " " + this.state.currentUser['last_name'];
		var alert;
		if ((this.state.alert)) {
			alert = <div className="alert alert-danger">
			  			<strong>Bro!</strong> You must select something to do before you post man!
					</div>;
		}
		return (<div>
			<SearchNavBar searchText={this.state.search} onSearch={this.handleSearch} onClick={this.handleFilterClick} 
							actions={actions} name={name} currentUser={this.state.currentUser}
							handleFilterClick={this.handleFilterClick} handleFilterUser={this.handleFilterUser}
							userIdToFilterPosts={this.state.userIdToFilterPosts} filters={this.state.filters}/>
			<div className="container">
				<div className="app row">
					<EventName name= {feed_name} numUnseenPosts = {this.state.numUnseenPosts} />
				</div>
				<div className="app row">
					<MakePost placeholder="What's happening?" postText={this.state.post} 
							onClick={this.handleFilterClick}
							onPostChange={this.handleTypingPost} 
							onPostSubmit={this.handlePostSubmit} 
							actions={actions}/>
				</div>
				{alert}
				<div className="app row">
				<Feed currentUser={this.state.currentUser} searchText={this.state.search} 
						filters={this.state.filters} posts={this.state.feed} actions={actions}
						handleFilterUser={this.handleFilterUser}
						userIdToFilterPosts={this.state.userIdToFilterPosts}
						handlePostEdit={this.handlePostEdit}
						handlePostDelete={this.handlePostDelete} />
				</div>
			</div>
		</div>);
	}
}
