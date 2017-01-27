/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {Text, ActivityIndicator, NetInfo, AsyncStorage, Platform, AppState, AppRegistry, StyleSheet, TabBarIOS, View} from 'react-native';
import ViewContainer from './components/ViewContainer'
import StartNavigator from './navigation/StartNavigator'
import PushController from './PushController'
import PushNotification from 'react-native-push-notification';


export default class Index extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isConnected : null
    }
  }

  componentWillMount() {
    const dispatchConnected = isConnected => this.props.dispatch(setIsConnected(isConnected));

    NetInfo.isConnected.fetch().then((data) => {
      if (Platform.OS == 'android'){
        this.setState({
        isConnected: data
        })
      }
    }).done(() => {
      NetInfo.isConnected.addEventListener('change', this.handleConnectivityChange.bind(this));
    });
  }

  componentWillUnmount(){
    NetInfo.isConnected.removeEventListener(
      'change',
      this.handleConnectivityChange.bind(this)
    )
  }

  handleConnectivityChange(change) {
      this.setState({
      isConnected: change
    })
  }

  render() {
    if (this.state.isConnected == null) {
      var main_activity =  <ActivityIndicator style={[styles.centering, styles.white]} color="#cccccc" size="large"/>

    }

    else if (this.state.isConnected == false){
      var main_activity =  <View style = {{flex: 1, flexDirection : 'row', justifyContent: 'center', 
                            alignItems : 'center'}}> 
                      <Text style = {{textAlign: 'center', borderColor : 'skyblue', borderWidth : 2, borderRadius : 4
                      ,padding: 16, paddingRight: 24, fontSize : 24}}>
                        Trying to access Manaweb with no connection? {"\n"}{"\n"} What a prank!
                      </Text>
                  </View>
      }

    else if (this.state.isConnected == true){
      var main_activity = <StartNavigator /> 
    }

    return (
        <View style = {styles.container}>
          {Platform.OS == 'ios' && <View style = {{paddingTop : 20, backgroundColor : "white"}} />}
          {main_activity}
          {/* <PushController /> */}
        </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : "#F5FCFF"
  },
    centering: {
    flex : 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  white: {
    backgroundColor: 'white',
  }
});

