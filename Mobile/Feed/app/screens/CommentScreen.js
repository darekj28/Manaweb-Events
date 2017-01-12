import React from 'react';
import {Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Comments from '../components/Comments';
import CommentBox from '../components/CommentBox';

export default class CommentScreen extends React.Component {
	constructor() {
		super();
		this.state = {
			comments : [],
			original_post : {}
		}
	}
	// method to fill this.state.comments using this.props.commentid
	getComments() {

	}
	// method to get this.state.original_post using this.props.commentid
	getPostById() {

	}
	render() {
		return (
			<View style = {styles.container}>
              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {30} />
              </TouchableOpacity>
              <CommentBox comment={this.state.original_post} original_post={true}/> 
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