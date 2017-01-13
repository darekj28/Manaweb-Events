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
			newPostContent: ""
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

	}
	async getComments() {
		let url = "https://manaweb-events.herokuapp.com"
	    let test_url = "http://0.0.0.0:5000"
	    let response = await fetch(url + "/mobileGetComments", 
	    	{method: "POST",
	          	headers: {
	          		'Accept': 'application/json',
	          		'Content-Type': 'application/json',
	        	},
	      	body: JSON.stringify({ comment_id : this.props.comment_id })
	    	}
	    );
	    let responseData = await response.json();
	    if (responseData['result'] == 'success'){
	      	if (responseData.comment_list.length > 0) {
	          	var feed = []
	          	for (var i = 0; i < responseData['comment_list'].length; i++) {
	            	var obj = responseData['comment_list'][i]
	            		feed.unshift({
	              		commentContent : obj['body'],
						avatar 		: obj['avatar_url'],
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
	    }
	}

	getPostById() {

	}
	componentDidMount() {
		this.getComments.bind(this)();
	}
	render() {
		return (
			<View style = {styles.container}>
              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {30} />
              </TouchableOpacity>
              <CommentBox comment={this.state.original_post} original_post={true}/> 
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