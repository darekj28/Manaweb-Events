
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {ScrollView, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../components/ViewContainer';
import HomeStatusBar from '../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import FeedBox from './FeedBox'




export default class Feed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts : [],
    }
    this.filter = this.filter.bind(this);
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
      else if (i < 5)
        rows.push(<FeedBox key={i} post = {post} handleFilterUser={this.props.handleFilterUser}
            image_ID = {i % 3} navigator = {this.props.navigator} username = {this.props.username}
            // isOP={this.props.currentUser['userID'] == post.userID}
            // isAdmin={this.props.currentUser['isAdmin']} 
            // refreshPostDisplayedInModal={this.refreshPostDisplayedInModal}
            // handleFilterUser={this.props.handleFilterUser}
            />);
       }, this);
    return rows;
  }

  componentDidMount(){
    this.setState({posts: this.props.posts})
  }

  render() {
    var feed = this.filter()
    return (
             <ScrollView
            // ref={(scrollView) => { _scrollView = scrollView; }}
            automaticallyAdjustContentInsets={false}
            onScroll={() => {}}
            scrollEventThrottle={200}
            onPress={() => {Alert.alert('Scroll clicked')}}
            >
              {feed}
            </ScrollView>
        
    ) 
  }


}

const styles = StyleSheet.create({


});

