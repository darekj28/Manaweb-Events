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
      isConnected : null,
      current_user : {},
      current_username: "",
      isLoading: true
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


    AsyncStorage.getItem("current_username").then((current_username) => {
        this.setState({current_username : current_username})
        this.initializeUserInformation.bind(this)()
      }).then(() => {
        this.setState({isLoading : false})
    }).done()
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

  initializeUserInformation(){
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileGetCurrentUserInfo", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      body:
      JSON.stringify(
       {
        username: this.state.current_username
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      console.log('current_username', this.state.current_username)
      if (responseData.thisUser == null) {
        if (this.state.current_username != "") {
         this.asyncStorageLogout.bind(this)()
        }
      }

      else if (this.state.current_user.userID != responseData.thisUser.userID) {
          var thisUser = responseData.thisUser;
          this.setState({current_user : thisUser})
      }
      
    }).done();
  }

  async asyncStorageLogin(current_username) {
    AsyncStorage.setItem("current_username", current_username).then(() => 
    {
      this.setState({current_username : current_username})
    })
    console.log("async login")
  }

  async asyncStorageLogout(){
    AsyncStorage.setItem("current_username", "").then(() => 
    {
      if (this.state.current_username != ""){
        this.setState({current_username : ""})        
      }
    })
    console.log("async logout")
  }

  componentDidUpdate(){
    this.initializeUserInformation.bind(this)()
  }

  refreshUserInformation() {
    this.initializeUserInformation.bind(this)()
  }

  render() {
    var this_user = this.state.current_user
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
      var main_activity = <StartNavigator 
        asyncStorageLogin = {this.asyncStorageLogin.bind(this)}
        asyncStorageLogout = {this.asyncStorageLogout.bind(this)}
        current_username = {this.state.current_username}
        current_user = {this_user}
        isLoading = {this.state.isLoading}
        refreshUserInformation = {this.refreshUserInformation.bind(this)}
        /> 
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

