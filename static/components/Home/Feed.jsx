var React = require('react');
import FeedPost from "./FeedPost.jsx";
import EditPostModal from "./EditPostModal.jsx";
import DeletePostModal from "./DeletePostModal.jsx";
import ReportPostModal from "./ReportPostModal.jsx";

export default class Feed extends React.Component {
	constructor(props) {
		super(props);
		this.state = { postInModal : '' };
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
				rows.push(<FeedPost key={i} post={post} 
						isOP={this.props.currentUser['userID'] == post.userID}
						isAdmin={this.props.currentUser['isAdmin']} 
						refreshPostDisplayedInModal={this.refreshPostDisplayedInModal.bind(this)}
						handleFilterUser={this.props.handleFilterUser}/>);
		}, this);
		return rows;
	}
	render() {
		var rows = this.filter.bind(this)();
		return (
				<div>
					<ul id="Feed" > {rows} </ul>
					<EditPostModal post={this.state.postInModal} 
									handlePostEdit={this.props.handlePostEdit}/>
					<DeletePostModal post={this.state.postInModal} 
									handlePostDelete={this.props.handlePostDelete}/>
					<ReportPostModal post={this.state.postInModal}/>
				</div>
			);
	}
}