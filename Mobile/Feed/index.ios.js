/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {AppState, AppRegistry, StyleSheet, TabBarIOS, View} from 'react-native';
import Index from './app/Index'




class Feed extends Component {

  constructor(props){
    super(props)
    this.state = {
      selectedTab : "tab1"
    }
  }



  render() {
    return (
        <Index />
      )
  }
}

const styles = StyleSheet.create({
  contianer: {
    flex: 1,
    backgroundColor : "#F5FCFF"
  }
});

AppRegistry.registerComponent('Feed', () => Feed);
