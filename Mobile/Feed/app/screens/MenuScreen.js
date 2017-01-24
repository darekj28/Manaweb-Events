const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
} = FBSDK;
import React from 'react';
import {Component} from 'react'
import {Platform, AppState, AsyncStorage, AppRegistry,StyleSheet,View,TouchableOpacity,TouchableHighlight,
          Alert, Animated, TouchableWithoutFeedback, Image, Easing, Text, ActivityIndicator} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import FeedScreen from './FeedScreen'
import SettingsScreen from './SettingsScreen'
import NotificationScreen from './NotificationScreen'
import Spinner from 'react-native-loading-spinner-overlay';
import IconBadge from 'react-native-icon-badge';
import PushNotification from 'react-native-push-notification';
const MENU_ICON_SIZE = 20
const MENU_FONT_SIZE = 12
const BOTTOM_BAR_PROPORTION = 0.09
const HIGHLIGHTED_COLOR = '#90D7ED'
const DEFAULT_COLOR = 'silver'

var image_res = {
    // Do these have copyright? https://thenounproject.com/term/message-notification/23246/
    // https://www.iconfinder.com/icons/126572/home_house_icon
    // http://www.endlessicons.com/free-icons/setting-icon/
    home: require('../static/menuScreen/home.png'),
    settings: require('../static/menuScreen/setting.png'),
    notification: require('../static/menuScreen/notification.png')
}

class MenuScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
        show_panel1: true,
        show_panel2: false,
        show_panel3: false,
        current_user : {},
        current_username : "",
        userLoading: true,
        feedLoading : true,
        spinnerLoading: true,
        feed : [],
        notifications: [],
        numUnseenNotifications: 0
    }
    this.interval;
    this.time_interval = 4.0 * 1000
    this.refresh_interval;
    this.refresh_time_interval = 10.0 * 1000

    this._onPanel1Pressed = this._onPanel1Pressed.bind(this)
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
          //         notifications.unshift({
          //           comment_id : obj['comment_id'],
          //           timeString : obj['timeString'],
          //           isOP : obj['isOP'],
          //           numOtherPeople : obj['numOtherPeople'],
          //           sender_name : obj['sender_name'],
          //           op_name : obj['op_name'],
          //           seen : obj['seen'],
          //           avatar : obj['avatar']
          
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
      this.interval = setInterval(this.checkNotifications.bind(this), this.time_interval)
  }

  checkNotifications(){
    // console.log("notificaiton")
    if (AppState.currentState === 'background' && this.state.current_username != "") {
      this.getPushNotifications.bind(this)()
    }
  }

  _onPanel1Pressed (show1, show2, show3) {
      this.setState({show_panel1: show1})
      this.setState({show_panel2: show2})
      this.setState({show_panel3: show3})
  }

  _imageWrapperStyle(highlighted) {
      if (highlighted) {
          return {flex: 1, justifyContent: 'center', alignSelf: 'center'}
      } else {
          return {flex: 1, justifyContent: 'center', alignSelf: 'center'}
      }
  }

  _imageStyle(highlighted) {
      if (highlighted) {
          return {width: MENU_ICON_SIZE, height: MENU_ICON_SIZE, alignSelf: 'center', tintColor: HIGHLIGHTED_COLOR}
      } else {
          return {width: MENU_ICON_SIZE, height: MENU_ICON_SIZE, alignSelf: 'center', tintColor: DEFAULT_COLOR}
      }
  }

  _textStyle(highlighted) {
      if (highlighted) {
          return {color: HIGHLIGHTED_COLOR, fontSize : MENU_FONT_SIZE, fontWeight: 'bold', alignSelf: 'center'}
      } else {
          return {color: DEFAULT_COLOR, fontSize : MENU_FONT_SIZE, fontWeight: 'bold', alignSelf: 'center'}
      }
  }

  initializeUserInformation(current_username, initialize){
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
        username: current_username
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.thisUser == null) {
        this.handleLogout.bind(this)()
      }
      else {
          var thisUser = responseData.thisUser;
        this.setState({current_user : thisUser})
        this.setState({userLoading: false})
        if (initialize) {
          this.refreshScreen.bind(this)(true)
        }  
      }
      
    }).done();
  }

  initialize(){
    AsyncStorage.getItem("current_username").then((current_username) => {
      this.setState({current_username: current_username});
      this.initializeUserInformation.bind(this)(current_username, true)
    })
  }

  refreshInfo() {
    this.initializeUserInformation.bind(this)(this.state.current_username, false)
  }

  handleLogout() {
    clearInterval(this.refresh_interval)
    AsyncStorage.setItem("current_username", "").then((value) => {
          LoginManager.logOut()
          this._navigateToHome();
      });
  }

  _navigateToHome(){
    this.props.navigator.push({
    href: "Start"
    })
  }

  hideSpinner(){
      this.setState({spinnerLoading : false})
  }

  refreshScreen(initialize) {
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
      this.setState({feedLoading: false})
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
              numberOfComments : obj['numComments']
            })
          }
          this.setState({feed: feed})
          if (initialize){
            this.getNotifications.bind(this)()
          }
         }
      }
    }).done()
  }

  refreshFeed(){
    console.log("refreshed")
    this.refreshScreen.bind(this)(false)
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

  componentDidUpdate(){
      if (this.state.feed.length > 10 && this.state.spinnerLoading){
         this.hideSpinner.bind(this)()
      }
   }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange.bind(this))
  }

  componentDidMount() {
    this.initialize.bind(this)();
    this.initializePushNotifications.bind(this)();
    // this.refresh_interval = setInterval(this.refreshFeed.bind(this), this.refresh_time_interval)
    AppState.addEventListener('change', this.handleAppStateChange.bind(this))
  }

  render() {
      // console.log("Spinner loading state : " + this.state.spinnerLoading)
      var isLoading = (this.state.userLoading || this.state.feedLoading)
      return (
          <View style = {styles.container}>
              {this.state.spinnerLoading &&
                <ActivityIndicator style={[styles.centering, styles.white]} color="#cccccc" size="large"/>
                }
              {!this.state.spinnerLoading &&
                <View style = {{flex: 1 - BOTTOM_BAR_PROPORTION, flexDirection:'row'}}>
                  { (this.state.show_panel1) && 
                      <View style = {{flex: 1}}>
                          <FeedScreen navigator={this.props.navigator}
                                current_user = {this.state.current_user}
                                handleLogout = {this.handleLogout.bind(this)}
                                refreshScreen = {this.refreshFeed.bind(this)}
                                feed = {this.state.feed}
                                spinnerLoading = {this.state.spinnerLoading}
                                hideSpinner = {this.hideSpinner.bind(this)}
                            />
                      </View>
                  }
                  { this.state.show_panel2 &&
                  <View style = {{backgroundColor: 'white', flex: 1}}>
                    <SettingsScreen current_user = {this.state.current_user}
                          refreshInfo = {this.refreshInfo.bind(this)}
                          handleLogout = {this.handleLogout.bind(this)}
                          navigator = {this.props.navigator}
                          isLoading = {this.state.isLoading}
                          />
                  </View>
                    }

                  { this.state.show_panel3 &&
                  <View style = {{backgroundColor: 'white', flex: 1}}>
                    <NotificationScreen current_user = {this.state.current_user}
                    current_username = {this.state.current_username}
                    navigator={this.props.navigator}
                    notifications = {this.state.notifications}
                    getNotifications = {this.getNotifications.bind(this)}
                    numUnseenNotifications = {this.state.numUnseenNotifications}
                    />
                  </View>
              }
              </View>}

              {!this.state.spinnerLoading && <View style = {{flex: BOTTOM_BAR_PROPORTION, flexDirection:'row', alignItems:'center', justifyContent:'center', 
                            borderTopWidth : 1, borderTopColor : 'silver'}}>
                  <TouchableWithoutFeedback
                      style = {this._imageWrapperStyle(this.state.show_panel1)}
                      onPress={() => this._onPanel1Pressed(true, false, false)}>
                      <View style = {{flex: 1}}>
                          <Image  style={this._imageStyle(this.state.show_panel1)} source={image_res.home} />
                          <Text style = {this._textStyle(this.state.show_panel1)}>
                              {'Home'}
                          </Text>
                      </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                      style = {this._imageWrapperStyle(this.state.show_panel2)}
                      onPress={() => this._onPanel1Pressed(false, true, false)}>
                      <View style = {{flex: 1}}>
                        <Image  style={this._imageStyle(this.state.show_panel2)} source={image_res.settings} />
                        <Text style = {this._textStyle(this.state.show_panel2)}>
                            {'Settings'}
                        </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                      style = {this._imageWrapperStyle(this.state.show_panel3)}
                      onPress={() => this._onPanel1Pressed(false, false, true)}>
                      <View style = {{flex: 1}}>
                      {this.state.numUnseenNotifications == 0
                         ? 
                        <Image  style= {this._imageStyle(this.state.show_panel3)} source={image_res.notification}/>
                        :
                        <IconBadge
                          MainElement={<Image  style= {this._imageStyle(this.state.show_panel3)} source={image_res.notification}/>}
                           BadgeElement={<Text style={{color:'#FFFFFF'}}> {this.state.numUnseenNotifications} </Text>}
                           IconBadgeStyle = {styles.notification_badge}
                          />
                        }

                              
                        <Text style = {this._textStyle(this.state.show_panel3)}>
                            {'Notifications'}
                        </Text>
                    </View>
                  </TouchableWithoutFeedback>
              </View>}
          </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'flex-start',
    backgroundColor : 'white'
  },
  notification_badge : {
    alignSelf: "center",
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

module.exports = MenuScreen
