/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {AppRegistry, StyleSheet, TabBarIOS, View} from 'react-native';
import ViewContainer from './app/components/ViewContainer'
import StartNavigator from './app/navigation/StartNavigator'





class Feed extends Component {

  constructor(props){
    super(props)
    this.state = {
      selectedTab : "tab1"
    }
  }
  render() {
    return (
        <View style = {styles.contianer}>
          <StartNavigator /> 
        </View>

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
