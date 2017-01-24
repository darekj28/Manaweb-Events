import React from 'react';
import {Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Comments from '../components/comments/Comments';
import CommentBox from '../components/comments/CommentBox';
import MakeCommentBox from '../components/comments/MakeCommentBox';
import OriginalPost from '../components/comments/OriginalPost';

const POST_MESSAGE_HEIGHT_SHORT = 50
const POST_MESSAGE_HEIGHT_TALL = 150
const ANIMATE_DURATION = 700

export default class CommentScreen extends React.Component {
	constructor() {
		super();
		this.state = {
			post_message_expanded: false,
      		post_message_height: new Animated.Value(50),
			comments : [],
			original_post : {},
			newPostContent: "",
			current_user: {'userID' : 'not initialized'}
		}
	}
	handlePostTyping(newPostContent) {
		this.setState({ newPostContent : newPostContent });
	}
	postMessagePressed() {
	      let initial = this.state.post_message_expanded ? POST_MESSAGE_HEIGHT_TALL : POST_MESSAGE_HEIGHT_SHORT
	      let final = this.state.post_message_expanded ? POST_MESSAGE_HEIGHT_SHORT : POST_MESSAGE_HEIGHT_TALL
	      this.setState({
	          post_message_expanded : !this.state.post_message_expanded  //Step 2
	      });
	      this.state.post_message_height.setValue(initial)
	      Animated.timing(          // Uses easing functions
	          this.state.post_message_height, {toValue: final, duration: ANIMATE_DURATION}
	      ).start();
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
					comment_id : this.state.comment_id
				});
		    	this.setState({ comments: feed, newPostContent : '' });	
		    }
		})
		.catch((error) => {
			console.log(error);
		});
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

	getPostById() {
		let url = "https://manaweb-events.herokuapp.com"
	    let test_url = "http://0.0.0.0:5000"
	    fetch(url + "/mobileGetPostById", 
	    	{method: "POST",
	          	headers: {
	          		'Accept': 'application/json',
	          		'Content-Type': 'application/json'
	        	},
	      		body: JSON.stringify({ comment_id : this.props.comment_id })
	    	}
	    ).then((response) => response.json())
	    .then((responseData) => {
		    this.setState({ original_post : 
		    	{postContent: responseData.post['body'],
				avatar 		: responseData.post['avatar'],
				name 		: responseData.post['first_name'] + ' ' + responseData.post['last_name'],
				userID 		: responseData.post['poster_id'],
				time  		: responseData.post['time'],
				comment_id  : responseData.post['comment_id'],
				unique_id	: responseData.post['unique_id'],
				timeString  : responseData.post['timeString']} });
		})
		.catch((error) => {
			console.log(error);
		});
	}
	componentDidMount() {
		this.getComments.bind(this)();
		this.getPostById.bind(this)();
		this.setState({current_user : this.props.current_user})
	}
	render() {
		var op = this.state.original_post['name'] ? this.state.original_post['name'].split(' ')[0] : "";
		return (
			<View style = {styles.container}>
	            <View style={{flexDirection : 'row', justifyContent : 'space-around', paddingLeft : 10, paddingRight : 10,
	            paddingBottom : 10}}>
		            <View style={{flex: 0.2}}>
		                <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
		                    <Icon name = "chevron-left" size = {20} color = '#90D7ED'/>
		                </TouchableOpacity>
		            </View>
		        </View>
	            <View style={{flexDirection : 'row'}}>
	              	<OriginalPost post={this.state.original_post}/> 
	            </View>
	            <View style={{flexDirection : 'row'}}>
	            	<MakeCommentBox onClick={(event) => this.postMessagePressed.bind(this)()}
	             		animateDuration={ANIMATE_DURATION}
	                    post_message_expanded={this.state.post_message_expanded}
	                    newPostContent = {this.state.newPostContent}
	                    handlePostTyping = {this.handlePostTyping.bind(this)}
	                    handlePostSubmit = {this.handleCommentSubmit.bind(this)}
	                    op = {op}/>
	            </View>
	            <View style={{flex : 1, flexDirection : 'row'}}>
              		<Comments comments={this.state.comments} comment_id={this.props.comment_id}/>
              	</View>
            </View>
			);
	}
}
const styles = StyleSheet.create({
    container: {
      	flex:1,
      	justifyContent: 'flex-start',
      	paddingTop: 30,
      	backgroundColor : 'white'
    }
});