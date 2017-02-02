import React from 'react';
import {Component} from 'react'
import {TouchableWithoutFeedback, Text, ActivityIndicator, NetInfo, AsyncStorage, Platform, AppState, AppRegistry, StyleSheet, TabBarIOS, View} from 'react-native';
import ViewContainer from './components/ViewContainer'
import StartNavigator from './navigation/StartNavigator'
import PushController from './PushController'
import PushNotification from 'react-native-push-notification';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import {
  setCustomView,
  setCustomTextInput,
  setCustomText,
  setCustomImage,
  setCustomTouchableOpacity
} from 'react-native-global-props';

const customTextProps = {
  style: {
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'Roboto'
  }
};
const customTextInputProps = {
  style: {
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue-Light' : 'Roboto',
  }
};
setCustomText(customTextProps);
setCustomTextInput(customTextInputProps);
export default class Index extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      isConnected : null,
      current_user : {},
      current_username: "",
      isLoading: true,
      feed: [],
      notifications: [],
      numUnseenNotifications : 0
    }
    // check for push notifications this often
    this.notification_interval;
    this.notification_time_interval = 5 * 1000;
  }

  getNotificationSyntax(note) {
        var whose; var also; var notification;
        if (note.isOP) { 
            whose = "your";
            also = "";
        }
        else {
            whose = note.op_name + "'s";
            also = " also";
        }
        if (note.numOtherPeople > 1)
            notification = note.sender_name + " and " + 
                note.numOtherPeople + " other people commented on " + whose + " post."
        else if (note.numOtherPeople == 1)
            notification = note.sender_name + 
                " and 1 other person commented on " + whose + " post."
        else 
            notification = note.sender_name + also + " commented on " + whose + " post."
        return notification;
    }

  getPushNotifications(){
    const url = "https://manaweb-events.herokuapp.com"
    const test_url = "http://0.0.0.0:5000"
      fetch(url + "/mobileGetPushNotifications", 
        {method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username : this.state.current_username })
        }
      ).then((response) => response.json())
       .then((responseData) => {
        // handle number of notifications
        PushNotification.setApplicationIconBadgeNumber(responseData['num_notifications'])
        // maybe use current storage..not sure yet
        // console.log(responseData['push_notifications'])
        if (responseData['push_notifications'].length > 0) {
              for (var i = 0; i < responseData['push_notifications'].length; i++) {
                console.log("notifcation sent")
                var obj = responseData['push_notifications'][i]
                var data = {
                  comment_id : obj['comment_id']
                }
                if (Platform.OS ===  'ios'){
                  PushNotification.localNotification({
                    message : this.getNotificationSyntax(obj),
                    userInfo : data,
                  })
                }
                else if (Platform.OS === 'android'){
                  PushNotification.localNotification({
                    tag : data,
                    message : this.getNotificationSyntax(obj),
                  })
                }
              }
            }
    })
    .catch((error) => {
      console.log(error);
    }).done();
  }

  initializePushNotifications(){
    var that = this;
    PushNotification.configure({
    // (required) Called when a remote or local notification is opened or received
    onNotification: function(notification) {
        console.log(notification)
        var comment_id = "";
        if (Platform.OS === 'ios'){
          comment_id = notification.data.comment_id
        }

        else if (Platform.OS === 'android'){
          comment_id = notificaiton.tag.comment_id
        }
        
        that.props.navigator.push({
          href : "Comment",
          current_username : that.state.current_username,
          current_user : that.state.current_user,
          comment_id : comment_id
        })
      },
    });
  }

  handleAppStateChange(appState){
      clearInterval(this.interval)
      this.notification_interval = setInterval(this.checkNotifications.bind(this), this.notification_time_interval)
  }

  checkNotifications(){
    if (AppState.currentState === 'background' && this.props.current_username != "") {
      this.getPushNotifications.bind(this)();
    }
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
      if (responseData.thisUser == null) {
        // if (this.state.current_username != "") {
         this.asyncStorageLogout.bind(this)()
        // }
      }

      else 
        // if (this.state.current_user.userID != responseData.thisUser.userID) 
          {
          var thisUser = responseData.thisUser;
          this.setState({current_user : thisUser}, this.getNotifications.bind(this))
      }
      
    }).done();
  }
  getNotifications(callback) {
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
              this.setState({notifications: notifications, numUnseenNotifications : numUnseenNotifications})
              if (callback) callback();
          }    
    })
    .catch((error) => {
      console.log(error);
    });
  }
  getNotificationCount() {
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
              for (var i = 0; i < responseData['notification_list'].length; i++) {
                var obj = responseData['notification_list'][i]
                  if (!obj['seen']){
                    numUnseenNotifications++;
                  }
              }
              this.setState({numUnseenNotifications : numUnseenNotifications})
          }    
    })
    .catch((error) => {
      console.log(error);
    });
  }
  getPosts(callback) {
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
              isDeleted : obj['isDeleted'],
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
          this.setState({feed: feed, isLoading : false});
          if (callback) callback();
         }
      }
    }).done()
  }
  async asyncStorageLogin(current_username) {
    AsyncStorage.setItem("current_username", current_username).then(() => 
    {
      this.setState({current_username : current_username}, this.initializeUserInformation.bind(this))
    })
  }

  async asyncStorageLogout(){
    AsyncStorage.setItem("current_username", "").then(() => 
    {
      if (this.state.current_username != ""){
        this.setState({current_username : ""})
        this.setState({current_user : {}})        
      }
    })
  }
  resetNotificationCount() {
    this.setState({ numUnseenNotifications : 0 });
  }
  onRefresh() {
    this.setState({ refresh : true }, this.getPosts.bind(this));
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

    AppState.removeEventListener('change', this.handleAppStateChange.bind(this))  
  }

  componentWillUnmount(){
    NetInfo.isConnected.removeEventListener(
      'change',
      this.handleConnectivityChange.bind(this)
    )
    clearInterval(this.state.pollNotificationCount);
  }
  componentDidMount() {
    this.getPosts.bind(this)(); 
    this.initializePushNotifications.bind(this)();
    this.setState({ pollNotificationCount : setInterval(this.getNotificationCount.bind(this), 10000) });
    AppState.addEventListener('change', this.handleAppStateChange.bind(this))
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
        initializeUserInformation = {this.initializeUserInformation.bind(this)}
        feed={this.state.feed}
        notifications={this.state.notifications}
        numUnseenNotifications={this.state.numUnseenNotifications}
        getPosts={this.getPosts.bind(this)}
        resetNotificationCount={this.resetNotificationCount.bind(this)}
        getNotifications={this.getNotifications.bind(this)}
        /> 
    }

    return (
      
        <View style = {styles.container}>
          <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
          {main_activity}
          {/* <PushController /> */}
          </TouchableWithoutFeedback>
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

