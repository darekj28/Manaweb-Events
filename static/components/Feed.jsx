var React = require('react');
import FeedPost from "./FeedPost.jsx";
import EditPostModal from "./EditPostModal.jsx";
import DeletePostModal from "./DeletePostModal.jsx";
import ReportPostModal from "./ReportPostModal.jsx";

export default class Feed extends React.Component {
	constructor(props) {
		super(props);
		this.state = { postInModal : '' };
		this.filter= this.filter.bind(this);
		this.refreshPostDisplayedInModal = this.refreshPostDisplayedInModal.bind(this);
	}
	refreshPostDisplayedInModal(post) {
		this.setState({ postInModal : post});
	}
	filter() {
		var rows = [];
		var that = this;
		this.props.posts.map(function(post, i) {
			function contains(collection, item) {
				if(collection.indexOf(item) !== -1) return true;
				else return false;
			}
			function doesPostMatchFilter() {
				var arr = that.props.filters;
				if (arr.length > 0) {
					if (post['isTrade'] && contains(arr, "Trade")) return true;
					if (post['isPlay'] && contains(arr, "Play")) return true;
					if (post['isChill'] && contains(arr, "Chill")) return true;
					return false;
				}
				else return false;
			}
			function doesPostMatchSearch() {
				if ((post["postContent"].toLowerCase().indexOf(that.props.searchText.toLowerCase()) === -1 &&
						post["userID"].toLowerCase().indexOf(that.props.searchText.toLowerCase()) === -1) && 
						post["name"].toLowerCase().indexOf(that.props.searchText.toLowerCase()) === -1) 
					return false;
				else return true;
			}
			function doesPostMatchSelectedUser() {
				console.log(that.props.userIdToFilterPosts);
				if (that.state.userIdToFilterPosts != '') {
					if (post["userID"].toLowerCase().indexOf(that.props.userIdToFilterPosts.toLowerCase()) === -1)
						return false;
					else return true;
				}
				else return true;
			}
			if ((!doesPostMatchFilter() || !doesPostMatchSearch()) || !doesPostMatchSelectedUser())
				return;
			else 
				rows.push(<FeedPost key={i} post={post} isOP={that.props.currentUser['userID'] == post.userID}
						isAdmin={that.props.currentUser['isAdmin']} 
						refreshFeed={that.props.refreshFeed} 
						refreshPostDisplayedInModal={that.refreshPostDisplayedInModal}
						handleFilterUser={that.props.handleFilterUser}/>);
		});
		return rows;
	}
	render() {
		var rows = this.filter();
		return (
				<div>
					<ul id="Feed" > {rows} </ul>
					<EditPostModal post={this.state.postInModal} refreshFeed={this.props.refreshFeed}/>
					<DeletePostModal post={this.state.postInModal} refreshFeed={this.props.refreshFeed}/>
					<ReportPostModal post={this.state.postInModal}/>
				</div>
			);
	}
}