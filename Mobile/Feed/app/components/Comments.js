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

	// for some reason this needs to go here
  	listViewRenderRow(input_element){
    	return input_element
  	}

	render() {
		 var feed = this.filter.bind(this)();
		 const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
   		 var dataSource = ds.cloneWithRows(feed)

    return (
			<ListView 
                style={styles.list_container}
                dataSource={dataSource}
                renderRow={this.listViewRenderRow.bind(this)}
                enableEmptySections = {true}
                removeClippedSubviews= {false}
			/>
			/* <ScrollView
	            automaticallyAdjustContentInsets={false}
	            onScroll={() => {}}
	            scrollEventThrottle={200}>
              {feed}
            </ScrollView> */
			)
	}
}

const styles = StyleSheet.create({
  list_container : {
  	flex: 1
  },
});