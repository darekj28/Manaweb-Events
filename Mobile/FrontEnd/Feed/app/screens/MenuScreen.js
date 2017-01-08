
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {AppRegistry,StyleSheet,View,TouchableOpacity,TouchableHighlight,
          Alert, Animated, TouchableWithoutFeedback, Image} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import FeedScreen from './FeedScreen'

const BOTTOM_BAR_PROPORTION = 0.1

var image_res = {
    home: require('../static/menuScreen/home.png')
}

class MenuScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      post_message_expanded: false,
      post_message_height: new Animated.Value(50),
    }
  }

  render() {
      return (
          <View style = {styles.container}>
              <View style = {{backgroundColor: 'aqua', flex: 1 - BOTTOM_BAR_PROPORTION, flexDirection:'row'}}>
                  <View style = {{backgroundColor: 'coral', flex: 1}}>

                  </View>
                  <View style = {{backgroundColor: 'black', flex: 1}}>

                  </View>
                  <View style = {{backgroundColor: 'red', flex: 1}}>

                  </View>
              </View>

              <View style = {{backgroundColor: 'bisque', flex: BOTTOM_BAR_PROPORTION, flexDirection:'row'}}>
                  <View style = {styles.menu_image_wrapper}>
                      <Image  style={styles.menu_image} source={image_res.home} />
                  </View>
                  <View style = {styles.menu_image_wrapper}>
                      <Image  style={styles.menu_image} source={image_res.home} />
                  </View>
                  <View style = {styles.menu_image_wrapper}>
                      <Image  style={styles.menu_image} source={image_res.home} />
                  </View>
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
