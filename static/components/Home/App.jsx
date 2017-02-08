var React = require('react');
import SearchNavBar from './SearchNavBar.jsx';
import EventName from './EventName.jsx';
import MakePost from './MakePost.jsx';
import Feed from './Feed/Feed.jsx';
import AppStore from '../../stores/AppStore.jsx';
import LoginApp from '../Login/LoginApp.jsx';
import ViewMoreButton from './ViewMoreButton.jsx';
import ExtendFeedButton from './ExtendFeedButton.jsx';

var feed_name = "BALT";
var actions = ['Play', 'Trade', 'Chill'];
export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			filters : ['Play', 'Trade', 'Chill'],
			actions : [],
			search : '',
			userIdToFilterPosts : '',
			post : '',
			feed : [],
			currentUser : AppStore.getCurrentUser(),
			numUnseenPosts: 0,
			numMorePosts : 0,
			numShownPosts : 50
		};
	}

	markPostFeedAsSeen() {
		$.post('/markPostFeedAsSeen', {feed_name: feed_name, currentUser : this.state.currentUser});
	}

	refreshFeed() {
		this.setState({ numUnseenPosts : 0, numShownPosts : this.state.numShownPosts + this.state.numUnseenPosts });
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
			this.setState({feed : feed.slice(0, this.state.numShownPosts),
							numMorePosts : (feed.length - this.state.numShownPosts >= 50 ? 50 : feed.length - this.state.numShownPosts)});
			this.markPostFeedAsSeen.bind(this)();
		}.bind(this));
	}
	extendFeed() {
		this.setState({ numShownPosts : (this.state.numShownPosts + 50) }, this.refreshFeed.bind(this));;
	}
	refreshNumUnseenPosts() {
		$.post('/getNumUnseenPosts', 
			{feed_name: feed_name, currentUser : this.state.currentUser, numUnseenPosts : this.state.numUnseenPosts},
			function(data){
				this.setState({numUnseenPosts :  data['numUnseenPosts'], 
								timer : setTimeout(this.refreshNumUnseenPosts.bind(this), 1000) });
			}.bind(this)
		);
	}
	
	handleFilterClick(filter, isSearch) {
		if (isSearch) {
			var newFilters = toggle(this.state.filters, filter);
			this.setState({filters : newFilters});
		}
		else {
			var newFilters = toggle(this.state.actions, filter);
			this.setState({actions : newFilters});
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

	handlePostSubmit(postText, callback) {
		var feed = this.state.feed;
		if (this.state.actions.length == 0) { 
			callback();
			swal("Oops...", "You must select something to do!", "error");
		}
		else {
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
						numberOfComments : 0,
						currentUser : this.state.currentUser
					};
			this.setState({feed : feed, post: ''});
			$('html, body').animate({scrollTop: 0}, 300);

			$.ajax({
				type : 'POST',
				url  : '/makePost',
				data : JSON.stringify(obj, null, '\t'),
			    contentType: 'application/json;charset=UTF-8',
			    success: function () {
					this.refreshFeed.bind(this)();	    	
			    }.bind(this)
			});	
		}
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
		AppStore.addUserChangeListener(this._onChange.bind(this));
		if (this.state.currentUser['userID']) {
			this.refreshFeed.bind(this)();
			this.refreshNumUnseenPosts.bind(this)();
		}
	}
	componentWillUnmount() {
		clearTimeout(this.state.timer);
		AppStore.removeUserChangeListener(this._onChange.bind(this));
	}
	_onChange() {
		this.setState({ currentUser : AppStore.getCurrentUser() });
		if (!this.state.currentUser) {
			clearTimeout(this.state.timer);
		}
		else {
			this.refreshFeed.bind(this)();
			this.refreshNumUnseenPosts.bind(this)();
		}
	}
	render() {
		if (this.state.currentUser['userID'] && this.state.currentUser['confirmed']) {
			var name = this.state.currentUser['first_name'] + " " + this.state.currentUser['last_name'];
			return (<div>
					<SearchNavBar searchText={this.state.search} 
									onSearch={this.handleSearch.bind(this)} 
									actions={actions} 
									name={name} 
									currentUser={this.state.currentUser}
									handleFilterClick={this.handleFilterClick.bind(this)} 
									handleFilterUser={this.handleFilterUser.bind(this)}
									userIdToFilterPosts={this.state.userIdToFilterPosts} 
									filters={this.state.filters}/>
					<div className="container app-container">
						<div className="app row">
							<center><EventName name="Grand Prix San Jose"/></center>
						</div>
						<div className="app row">
							<MakePost placeholder="What's happening?" postText={this.state.post} 
									onClick={this.handleFilterClick.bind(this)}
									onPostChange={this.handleTypingPost.bind(this)} 
									onPostSubmit={this.handlePostSubmit.bind(this)} 
									actions={actions}/>
						</div>
						{this.state.numUnseenPosts > 0 &&
						<div className="feed row">
							<ViewMoreButton numUnseenPosts={this.state.numUnseenPosts} 
											refreshFeed={this.refreshFeed.bind(this)}/>
						</div>}
						<div className="feed row">
						<Feed currentUser={this.state.currentUser} searchText={this.state.search} 
								filters={this.state.filters} posts={this.state.feed} 
								actions={actions}
								handleFilterUser={this.handleFilterUser.bind(this)}
								userIdToFilterPosts={this.state.userIdToFilterPosts}
								handlePostEdit={this.handlePostEdit.bind(this)}
								handlePostDelete={this.handlePostDelete.bind(this)} />
						</div>
						{this.state.numMorePosts > 0 &&
							<div className="feed row">
							<ExtendFeedButton numMorePosts={this.state.numMorePosts}
							extendFeed={this.extendFeed.bind(this)}/>
						</div>}
					</div>
				</div>);
		}
		else {
			return <LoginApp/>;
		}
	}
}
// 