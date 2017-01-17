import React from 'react';
import {Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Comments from '../components/Comments';
import CommentBox from '../components/CommentBox';
import MakeCommentBox from '../components/MakeCommentBox';

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
	handlePostSubmit() {
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
		    	feed.push({ commentContent: this.state.newPostContent, 
					avatar  : this.state.current_user['avatar_url'], 
					name    : this.state.current_user['first_name'] + " " + this.state.current_user['last_name'],
					userID  : this.state.current_user['userID'], 
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
	      		body: JSON.stringify({ comment_id : this.props.comment_id,
	      			username : this.state.current_user.userID,
	      			commentContent : this.state.newPostContent
	      		 })
	    	}
	    ).then((response) => response.json())
	    .then((responseData) => {
		    if (responseData.comment_list.length > 0) {
	          	var feed = []
	          	for (var i = 0; i < responseData['comment_list'].length; i++) {
	            	var obj = responseData['comment_list'][i]
	            		feed.unshift({
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
	          	console.log(obj)
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
		return (
			<View style = {styles.container}>
              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {30} />
              </TouchableOpacity>
              <CommentBox comment={this.state.original_post} isOriginalPost={true}/> 
              <MakeCommentBox onClick={(event) => this.postMessagePressed.bind(this)()}
             		animateDuration={ANIMATE_DURATION}
                    post_message_expanded={this.state.post_message_expanded}
                    newPostContent = {this.state.newPostContent}
                    handlePostTyping = {this.handlePostTyping.bind(this)}
                    handlePostSubmit = {this.handlePostSubmit.bind(this)}/>
              <Comments comments={this.state.comments} comment_id={this.props.comment_id}/>
            </View>
			);
	}
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'flex-start',
    padding : 10,
    paddingTop: 40
  }
});