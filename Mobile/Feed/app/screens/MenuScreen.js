
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
        isLoading: true
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

  initializeUserInformation(current_username){
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
      this.setState({isLoading: false})
    }).done();
  }

  initializeUserName(){
    AsyncStorage.getItem("current_username").then((current_username) => {
      this.setState({current_username: current_username});
      this.initializeUserInformation.bind(this)(current_username)
    })
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

  componentDidMount() {
    this.initializeUserName.bind(this)();
  }

  render() {
      return (
          <View style = {styles.container}>
              <View style = {{flex: 1 - BOTTOM_BAR_PROPORTION, flexDirection:'row'}}>
                  { this.state.show_panel1 &&
                      <View style = {{flex: 1}}>
                          <FeedScreen navigator={this.props.navigator}
                                current_user = {this.state.current_user}
                                handleLogout = {this.handleLogout.bind(this)}
                            />
                      </View>
                  }
                  { this.state.show_panel2 &&
                  <View style = {{backgroundColor: 'white', flex: 1}}>
                    <SettingsScreen current_user = {this.state.current_user}
                          refreshInfo = {this.initializeUserName.bind(this)}
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
                    navigator={this.props.navigator}/>
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
                        <Image  style={this._imageStyle(this.state.show_panel3)} source={image_res.notification} />
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
  }
});

module.exports = MenuScreen
