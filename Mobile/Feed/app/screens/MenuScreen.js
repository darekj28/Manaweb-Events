const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
} = FBSDK;
import React from 'react';
import {Component} from 'react'
import {AsyncStorage, AppRegistry,StyleSheet,View,TouchableOpacity,TouchableHighlight,
          Alert, Animated, TouchableWithoutFeedback, Image, Easing, Text} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import FeedScreen from './FeedScreen'
import SettingsScreen from './SettingsScreen'
import NotificationScreen from './NotificationScreen'
import Spinner from 'react-native-loading-spinner-overlay';
import IconBadge from 'react-native-icon-badge';
const MENU_ICON_SIZE = 23
const BOTTOM_BAR_PROPORTION = 0.09
const HIGHLIGHTED_COLOR = '#A348A4'
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
    this._onPanel1Pressed = this._onPanel1Pressed.bind(this)
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
          return {color: HIGHLIGHTED_COLOR, fontWeight: 'bold', alignSelf: 'center'}
      } else {
          return {color: DEFAULT_COLOR, fontWeight: 'bold', alignSelf: 'center'}
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

      var thisUser = responseData.thisUser;
      this.setState({current_user : thisUser})
      this.setState({userLoading: false})
      if (initialize) {
        this.refreshScreen.bind(this)(true)
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
                    seen : obj['seen']
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

  componentDidMount() {
    this.initialize.bind(this)();
  }

  render() {
      console.log("Spinner loading state : " + this.state.spinnerLoading)
      var isLoading = (this.state.userLoading || this.state.feedLoading)
      return (
          <View style = {styles.container}>
              <Spinner visible={this.state.spinnerLoading} textContent= "Loading..." textStyle={{color: '#FFF'}} />
              <View style = {{flex: 1 - BOTTOM_BAR_PROPORTION, flexDirection:'row'}}>
                  { (this.state.show_panel1) && 
                      <View style = {{flex: 1}}>
                          <FeedScreen navigator={this.props.navigator}
                                current_user = {this.state.current_user}
                                handleLogout = {this.handleLogout.bind(this)}
                                refreshScreen = {this.refreshScreen.bind(this)}
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
              </View>

              <View style = {{flex: BOTTOM_BAR_PROPORTION, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
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
                            {'Setting'}
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
                            {'Notification'}
                        </Text>
                    </View>
                  </TouchableWithoutFeedback>
              </View>
          </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'flex-start',
  },
  notification_badge : {
    alignSelf: "center",
  },


});

module.exports = MenuScreen
