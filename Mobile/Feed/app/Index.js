/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {Platform, AppState, AppRegistry, StyleSheet, TabBarIOS, View} from 'react-native';
import ViewContainer from './components/ViewContainer'
import StartNavigator from './navigation/StartNavigator'
import PushController from './PushController'
import PushNotification from 'react-native-push-notification';


export default class Index extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      selectedTab : "tab1"
    }
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange.bind(this));
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange.bind(this));
  }

  handleAppStateChange(appState) {
    if (appState === 'background') {
      let date = new Date(Date.now() + (10 * 1000));
      console.log(date)

      // if (Platform.OS === 'ios') {
      //   date = date.toISOString();
      // }

      PushNotification.localNotificationSchedule({
        message: "My Notification Message",
        date,
      });
    }
  }

  render() {
    return (
        <View style = {styles.contianer}>
          <StartNavigator />
          <PushController />
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

