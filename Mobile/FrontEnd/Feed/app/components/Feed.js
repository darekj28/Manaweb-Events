
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




export default class Feed extends Component {
  constructor(props) {
    super(props)
    this.state = {
      post_list : this.props.post_list
    }
  }



  render() {
    return (
        <Text> Entire Feed Goes Here </Text>
    ) 
  }


}

const styles = StyleSheet.create({


});

