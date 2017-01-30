import React from 'react';
import {Platform, Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
		  Alert, Image, Animated, TouchableWithoutFeedback, ScrollView, Easing, Keyboard} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Comments from '../components/comments/Comments';
import CommentBox from '../components/comments/CommentBox';
import MakeCommentBox from '../components/comments/MakeCommentBox';
import OriginalPost from '../components/comments/OriginalPost';
import dismissKeyboard from 'react-native-dismiss-keyboard';

const NAVIGATOR_BACK_ICON_HEIGHT = 30

export default class CommentScreen extends React.Component {
	constructor() {
		super();
		this.state = {
			post_message_expanded: false,
			comments : [],
			original_post : {},
			newPostContent: "",
			current_user: {'userID' : 'not initialized'},
			canPost : true
		}
		this.spamTimer
	}
	handlePostTyping(newPostContent) {
		this.setState({ newPostContent : newPostContent });
	}
	postMessagePressed() {
		this.setState({ post_message_expanded : !this.state.post_message_expanded });
	}
	handleCommentSubmit() {
		let url = "https://manaweb-events.herokuapp.com"
		let test_url = "http://0.0.0.0:5000"
		fetch(url + "/mobileMakeComment",
			{method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					comment_id : this.props.comment_id,
					username : this.props.current_username,
					commentContent : this.state.newPostContent
				 })
			}
		).then((response) => response.json())
		.then((responseData) => {
			if (responseData['result'] == 'success') {
				var feed = this.state.comments;
				feed.push({
					postContent: this.state.newPostContent,
					avatar  : this.props.current_user['avatar_name'],
					name    : this.props.current_user['first_name'] + " " + this.props.current_user['last_name'],
					userID  : this.props.current_user['userID'],
					time	: "just now",
					comment_id : this.props.comment_id
				});
				this.setState({ comments: feed, newPostContent : '', canPost: false});
			}
		})
		.catch((error) => {
			console.log(error);
		});
		this.spamTimer = setTimeout(() => {this.setState({ canPost: true })}, 10000);
	}
	getComments() {
		let url = "https://manaweb-events.herokuapp.com"
		let test_url = "http://0.0.0.0:5000"
		fetch(url + "/mobileGetComments",
			{method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ comment_id : this.props.comment_id
				 })
			}
		).then((response) => response.json())
		.then((responseData) => {
			if (responseData.comment_list.length > 0) {
				var feed = []
				for (var i = 0; i < responseData['comment_list'].length; i++) {
					var obj = responseData['comment_list'][i]
						feed.push({
						postContent : obj['body'],
						avatar 		: obj['avatar'],
						name 		: obj['first_name'] + ' ' + obj['last_name'],
						userID 		: obj['poster_id'],
						time  		: obj['time'],
						comment_id  : obj['comment_id'],
						unique_id	: obj['unique_id'],
						timeString  : obj['timeString']
					})
				}
				this.setState({comments: feed})
			}
		})
		.catch((error) => {
			console.log(error);
		});
	}

	listViewRenderRow(input_element){
		return input_element
	}
	collapseMessageBox() {
		dismissKeyboard();
		this.setState({ post_message_expanded : false });
	}
	componentDidMount() {
		this.getComments.bind(this)();
		this.setState({current_user : this.props.current_user});
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.collapseMessageBox());
	}
	componentWillUnmount(){
		clearTimeout(this.spamTimer)
		this.props.getPosts();
		this.keyboardDidHideListener.remove();
	}
	render() {
		var op = this.props.original_post['name'] ? this.props.original_post['name'].split(' ')[0] : "";
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		var scrollable_section = [
			<View>
				<View style={{flexDirection : 'row'}}>
					<OriginalPost post={this.props.original_post}/>
				</View>
				<TouchableWithoutFeedback onPress={() => this.postMessagePressed.bind(this)()}>
					<View style = {{flexDirection: 'row', borderTopColor: 'silver', borderTopWidth: 1}}>
						<Text style = {{padding: 3, fontSize: 14, color: 'black'}}>
							Reply to {op}...
						</Text>
					</View>
				</TouchableWithoutFeedback>
				<View style={{flex : 1, flexDirection : 'row'}}>
					<Comments comments={this.state.comments} comment_id={this.props.comment_id}/>
				</View>
				{this.state.post_message_expanded && <View style={{flex : 0}}>
				<MakeCommentBox onClick={(event) => this.postMessagePressed.bind(this)()}
						post_message_expanded = {this.state.post_message_expanded}
						newPostContent = {this.state.newPostContent}
						handlePostTyping = {this.handlePostTyping.bind(this)}
						handlePostSubmit = {this.handleCommentSubmit.bind(this)}
						op = {op} 
						canPost={this.state.canPost}/></View>}
			</View>
			];
		var dataSource = ds.cloneWithRows(scrollable_section);
		return (
			<View style = {styles.container}>
				<View style={styles.top_bar}>
					<View style={{flex: 0.2}}>
						<TouchableOpacity onPress = {() => this.props.navigator.pop()}>
							<Icon name = "chevron-left" size = {20} color = '#90D7ED'/>
						</TouchableOpacity>
					</View>
					<View style={{flex: 0.6}}>
					</View>
					<View style={{flex: 0.2, justifyContent : 'flex-end', flexDirection : 'row'}}>
					</View>
				</View>
				{this.props.original_post.name && <ListView
                	style={styles.list_container}
                	dataSource={dataSource}
                	renderRow={this.listViewRenderRow.bind(this)}
                	enableEmptySections = {true}
                	removeClippedSubviews= {false}/>}
                {!this.props.original_post.name && 
                	<View style={styles.list_container}/>}
            </View>
		)
	}
}
const styles = StyleSheet.create({
	container: {
		flex:1,
		justifyContent: 'flex-start',
		backgroundColor : 'white'
	},
	list_container : {
  		flex: 1
  	},
  	top_bar : {
		flex : 0.1,
		paddingLeft : 10,
		paddingRight : 10,
		flexDirection : "row",
		justifyContent: "space-around",
		borderBottomColor : '#e1e1e1',
		borderBottomWidth : 1,
		alignItems : 'center'
	},
});
