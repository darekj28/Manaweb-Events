
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {AppRegistry,StyleSheet,View,TouchableOpacity,TouchableHighlight,
          Alert, Animated, TouchableWithoutFeedback, Image, Easing} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import FeedScreen from './FeedScreen'

const BOTTOM_BAR_PROPORTION = 0.07
const ANIMATE_DURATION = 100

var image_res = {
    // Do these have copyright? https://thenounproject.com/term/message-notification/23246/
    // https://www.iconfinder.com/icons/126572/home_house_icon
    // http://www.endlessicons.com/free-icons/setting-icon/
    home: require('../static/menuScreen/home.png'),
    setting: require('../static/menuScreen/setting.png'),
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

  _imageWrapper(highlighted) {
      if (highlighted) {
          return {flex: 1, justifyContent: 'center', backgroundColor: '#9AD1D4'}
      } else {
          return {flex: 1, justifyContent: 'center', backgroundColor: '#C2F9BB'}
      }
  }

  render() {
      return (
          <View style = {styles.container}>
              <View style = {{flex: 1 - BOTTOM_BAR_PROPORTION, flexDirection:'row'}}>
                  { this.state.show_panel1 &&
                      <View style = {{flex: 1}}>
                          <FeedScreen></FeedScreen>
                      </View>
                  }
                  { this.state.show_panel2 &&
                  <View style = {{backgroundColor: 'black', flex: 1}}>
                  </View>
                    }

                  { this.state.show_panel3 &&
                  <View style = {{backgroundColor: 'red', flex: 1}}>
                  </View>
              }
              </View>

              <View style = {{flex: BOTTOM_BAR_PROPORTION, flexDirection:'row'}}>
                  <TouchableHighlight
                      style = {this._imageWrapper(this.state.show_panel1)}
                      onPress={() => this._onPanel1Pressed(true, false, false)}>
                        <Image  style={styles.menu_image} source={image_res.home} />
                  </TouchableHighlight>
                  <TouchableHighlight
                      style = {this._imageWrapper(this.state.show_panel2)}
                      onPress={() => this._onPanel1Pressed(false, true, false)}>
                        <Image  style={styles.menu_image} source={image_res.setting} />
                  </TouchableHighlight>
                  <TouchableHighlight
                      style = {this._imageWrapper(this.state.show_panel3)}
                      onPress={() => this._onPanel1Pressed(false, false, true)}>
                        <Image  style={styles.menu_image} source={image_res.notification} />
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
  },
  menu_image: {
      width: 30,
      height: 30,
      alignSelf: 'center'
  },
});

module.exports = MenuScreen
