import React from 'react';
import {Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import CommentBox from './CommentBox';

export default class Comments extends React.Component {
	constructor(props) {
		super(props);
	}
	filter() {
		var feed = [];
		this.props.comments.map(function(comment, i) {
			feed.push(<CommentBox key={i} comment={comment}/>)
		}, this);
		return feed;
	}
  	listViewRenderRow(input_element){
    	return input_element
  	}
	render() {
		var feed = this.filter.bind(this)();
    	return (
			<View style={styles.list_container}>
				{feed}
			</View>
			)
	}
}

const styles = StyleSheet.create({
  list_container : {
  	flex: 1,
  },
});