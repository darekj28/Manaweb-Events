
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

const BOTTOM_BAR_PROPORTION = 0.1
const ANIMATE_DURATION = 100

var image_res = {
    home: require('../static/menuScreen/home.png')
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

  // _onPanel2Pressed () {
  //     this.setState({show_panel1: false})
  //     this.setState({show_panel2: true})
  //     this.setState({show_panel3: false})
  // }
  //
  // _onPanel3Pressed () {
  //     this.setState({show_panel1: false})
  //     this.setState({show_panel2: false})
  //     this.setState({show_panel3: true})
  // }

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

              <View style = {{backgroundColor: 'bisque', flex: BOTTOM_BAR_PROPORTION, flexDirection:'row'}}>
                  <TouchableHighlight
                      style = {styles.menu_image_wrapper}
                      onPress={() => this._onPanel1Pressed(true, false, false)}>
                        <Image  style={styles.menu_image} source={image_res.home} />
                  </TouchableHighlight>
                  <TouchableHighlight
                      style = {styles.menu_image_wrapper}
                      onPress={() => this._onPanel1Pressed(false, true, false)}>
                        <Image  style={styles.menu_image} source={image_res.home} />
                  </TouchableHighlight>
                  <TouchableHighlight
                      style = {styles.menu_image_wrapper}
                      onPress={() => this._onPanel1Pressed(false, false, true)}>
                        <Image  style={styles.menu_image} source={image_res.home} />
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
      width: 20,
      height: 20,
      alignSelf: 'center'
  },
  menu_image_wrapper: {
      flex: 1,
      justifyContent: 'center',
  }
});

module.exports = MenuScreen
