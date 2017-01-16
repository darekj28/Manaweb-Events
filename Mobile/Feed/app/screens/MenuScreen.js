
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {AppRegistry,StyleSheet,View,TouchableOpacity,TouchableHighlight,
          Alert, Animated, TouchableWithoutFeedback, Image, Easing, Text} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import FeedScreen from './FeedScreen'
import SettingsScreen from './SettingsScreen'
import NotificationScreen from './NotificationScreen'
const MENU_ICON_SIZE = 23
const BOTTOM_BAR_PROPORTION = 0.09
const HIGHLIGHTED_COLOR = '#8AC1C4'
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

  render() {
      return (
          <View style = {styles.container}>
              <View style = {{flex: 1 - BOTTOM_BAR_PROPORTION, flexDirection:'row'}}>
                  { this.state.show_panel1 &&
                      <View style = {{flex: 1}}>
                          <FeedScreen navigator={this.props.navigator}></FeedScreen>
                      </View>
                  }
                  { this.state.show_panel2 &&
                  <View style = {{backgroundColor: 'white', flex: 1}}>
                    <SettingsScreen/>
                  </View>
                    }

                  { this.state.show_panel3 &&
                  <View style = {{backgroundColor: 'white', flex: 1}}>
                    <NotificationScreen/>
                  </View>
              }
              </View>

              <View style = {{flex: BOTTOM_BAR_PROPORTION, flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                  <TouchableHighlight
                      style = {this._imageWrapperStyle(this.state.show_panel1)}
                      onPress={() => this._onPanel1Pressed(true, false, false)}>
                      <View style = {{flex: 1}}>
                          <Image  style={this._imageStyle(this.state.show_panel1)} source={image_res.home} />
                          <Text style = {this._textStyle(this.state.show_panel1)}>
                              {'Home'}
                          </Text>
                      </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                      style = {this._imageWrapperStyle(this.state.show_panel2)}
                      onPress={() => this._onPanel1Pressed(false, true, false)}>
                      <View style = {{flex: 1}}>
                        <Image  style={this._imageStyle(this.state.show_panel2)} source={image_res.settings} />
                        <Text style = {this._textStyle(this.state.show_panel2)}>
                            {'Setting'}
                        </Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight
                      style = {this._imageWrapperStyle(this.state.show_panel3)}
                      onPress={() => this._onPanel1Pressed(false, false, true)}>
                      <View style = {{flex: 1}}>
                        <Image  style={this._imageStyle(this.state.show_panel3)} source={image_res.notification} />
                        <Text style = {this._textStyle(this.state.show_panel3)}>
                            {'Notification'}
                        </Text>
                    </View>
                  </TouchableHighlight>
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
