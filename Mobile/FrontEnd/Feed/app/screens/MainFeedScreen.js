
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../components/ViewContainer';
import HomeStatusBar from '../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Feed from '../components/Feed'
import MakePost from '../components/MakePost'

var SearchBar =  require('react-native-search-bar');

function toggle(collection, item) {
  var idx = collection.indexOf(item);
  if(idx !== -1) collection.splice(idx, 1);
  else collection.push(item);
  return collection;
}

function contains(collection, item) {
  if(collection.indexOf(item) !== -1) return true;
  else return false;
}

export default class MainFeedScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filters : ['Trade', 'Play', 'Chill'],
      actions : ['Trade'],
      search : '',
      post : '',
      feed : [],
      currentUser : '',
      alert : false,
      unique_id : ''
    }
  }

  handleSearchPress() {
    var that = this;
    console.log(that.state.search);
  }

  handleCancelPress() {
    this.setState({search : ""})
  }


  render() {
    return ( 
      <View>
        <HomeStatusBar />
        <SearchBar
        ref='searchBar'
        placeholder='Search'
        onChangeText={(val) => this.setState({search : val})}
        onSearchButtonPress = {this.handleSearchPress}
        onCancelButtonPress={this.handleCancelPress}
        style = {styles.searchBar}
       
        />
        <MakePost />
        <Feed style = {styles.postFeed} post_list = {this.state.post_list}/>
      </View>
    ) 
  }


}

const styles = StyleSheet.create({
  postFeed: {
    justifyContent: 'center'
  },
  searchBar : {
    padding : 20
  }

});

