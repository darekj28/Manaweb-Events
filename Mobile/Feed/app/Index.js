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
      isLoading: true,
      feed: [],
      notifications: []
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
  // get current user info and notifications
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
          this.setState({current_user : thisUser}, this.getNotifications.bind(this))
      }
      
    }).done();
  }
  getNotifications() {
    const url = "https://manaweb-events.herokuapp.com"
    const test_url = "http://0.0.0.0:5000"
      fetch(url + "/mobileGetNotifications", 
        {method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username : this.state.current_username })
        }
      ).then((response) => response.json())
      .then((responseData) => {
        var numUnseenNotifications = 0;
        if (responseData.notification_list.length > 0) {
              var notifications = []
              for (var i = 0; i < responseData['notification_list'].length; i++) {
                var obj = responseData['notification_list'][i]
                  notifications.unshift({
                    comment_id : obj['comment_id'],
                    timeString : obj['timeString'],
                    isOP : obj['isOP'],
                    numOtherPeople : obj['numOtherPeople'],
                    sender_name : obj['sender_name'],
                    op_name : obj['op_name'],
                    seen : obj['seen'],
                    avatar : obj['avatar']
                })
                  if (!obj['seen']){
                    numUnseenNotifications++;
                  }
              }
              this.setState({notifications: notifications})
              this.setState({numUnseenNotifications : numUnseenNotifications})
          }    
    })
    .catch((error) => {
      console.log(error);
    });
  }
  getPosts() {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileGetPosts", {method: "POST",
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      body:
      JSON.stringify(
       {
        feed_name: "BALT"
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
    if (responseData['result'] == 'success'){
      if (responseData.post_list.length > 0) {
          var feed = []
          for (var i = 0; i < responseData['post_list'].length; i++) {
            var obj = responseData['post_list'][i]
            feed.unshift({
              postContent : obj['body'],
              avatar    : obj['avatar'],
              name    : obj['first_name'] + ' ' + obj['last_name'],
              userID    : obj['poster_id'],
              time      : obj['time'],
              isTrade   : obj['isTrade'],
              isPlay    : obj['isPlay'],
              isChill   : obj['isChill'],
              comment_id  : obj['comment_id'],
              unique_id   : obj['unique_id'],
              numberOfComments : obj['numComments'],
              timeString : obj['timeString']
            })
          }
          this.setState({feed: feed, isLoading : false})
         }
      }
    }).done()
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
    // we'll figure out someway to 
    // this.initializeUserInformation.bind(this)()
    // this.getPosts.bind(this)(); 
  }

  componentDidMount() {
    this.getPosts.bind(this)(); 
  }

  // refreshUserInformation(new_info) {
  //   AsyncStorage.mergeItem("current_user", new_info, () => {
  //     AsyncStorage.getItem("current_user", (err, result) => {
  //       this.setState({ current_user : JSON.parse(result) });
  //     });
  //   });
  // }

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
        refreshUserInformation = {this.initializeUserInformation.bind(this)}
        feed={this.state.feed}
        notifications={this.state.notifications}
        numUnseenNotifications={this.state.numUnseenNotifications}
        getPosts={this.getPosts.bind(this)}
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

