var React = require('react');
import CommentFeedPost from "./CommentFeedPost.jsx";
import EditCommentModal from "./EditCommentModal.jsx";
import DeleteCommentModal from "./DeleteCommentModal.jsx";
import ReportCommentModal from "./ReportCommentModal.jsx";

export default class CommentFeed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {commentInModal : ''};
	}
	refreshCommentDisplayedInModal(comment) {
		this.setState({commentInModal : comment});
	}
	filter() {
		var rows = [];
		var that = this;
		this.props.comments.map(function(comment, i) {
			function contains(collection, item) {
				if(collection.indexOf(item) !== -1) return true;
				else return false;
			}
			function doesCommentMatchSearch() {
				if ((comment["commentContent"].toLowerCase().indexOf(that.props.searchText.toLowerCase()) === -1 &&
						comment["userID"].toLowerCase().indexOf(that.props.searchText.toLowerCase()) === -1) && 
						comment["name"].toLowerCase().indexOf(that.props.searchText.toLowerCase()) === -1) 
					return false;
				else return true;
			}

			if (!doesCommentMatchSearch())
				return;
			else 
				rows.push(<CommentFeedPost key={i} comment={comment} 
						isOP={this.props.currentUser['userID']==comment.userID}
						isAdmin={this.props.currentUser['isAdmin']} isOriginalPost={false} 
						refreshCommentDisplayedInModal={this.refreshCommentDisplayedInModal.bind(this)}/>);
		}, this);
		return rows;
	}
	render() {
		var rows = this.filter.bind(this)();
		return (<ul id="CommentFeed">{rows}
					<EditCommentModal comment={this.state.commentInModal} 
										handleCommentEdit={this.props.handleCommentEdit} />
					<DeleteCommentModal comment={this.state.commentInModal} 
										handleCommentDelete={this.props.handleCommentDelete}/>
					<ReportCommentModal comment={this.state.commentInModal}/>
			</ul>);
	}
}