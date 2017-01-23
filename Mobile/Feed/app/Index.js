/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {AsyncStorage, Platform, AppState, AppRegistry, StyleSheet, TabBarIOS, View} from 'react-native';
import ViewContainer from './components/ViewContainer'
import StartNavigator from './navigation/StartNavigator'
import PushController from './PushController'
import PushNotification from 'react-native-push-notification';


export default class Index extends React.Component {

  constructor(props){
    super(props)
    this.state = {
    }
  }

  
  render() {
    return (
        <View style = {styles.contianer}>
          <View style = {{paddingTop : 20}} />
          <StartNavigator />
          {/* <PushController /> */}
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

