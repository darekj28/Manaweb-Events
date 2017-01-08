
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
        panel_flex1: new Animated.Value(1.0),
        panel_flex2: new Animated.Value(0.0),
        panel_flex3: new Animated.Value(0.0)
    }
    this._onPanel1Pressed = this._onPanel1Pressed.bind(this)
    this._onPanel2Pressed = this._onPanel2Pressed.bind(this)
    this._onPanel3Pressed = this._onPanel3Pressed.bind(this)
  }

  _onPanel1Pressed () {
      this.setState({show_panel1: true})
      setTimeout(
          () => {
              this.setState({show_panel2: false});
              this.setState({show_panel3: false})
          }, ANIMATE_DURATION)
      var timing = Animated.timing
      Animated.parallel([
          timing(this.state.panel_flex1, {toValue: 1.0, easing: Easing.linear, duration: ANIMATE_DURATION}),
          timing(this.state.panel_flex2, {toValue: 0.01, easing: Easing.linear, duration: ANIMATE_DURATION}),
          timing(this.state.panel_flex3, {toValue: 0.01, easing: Easing.linear, duration: ANIMATE_DURATION}),
      ]).start();
  }

  _onPanel2Pressed () {
      this.setState({show_panel2: true})
      setTimeout(
          () => {
              this.setState({show_panel1: false});
              this.setState({show_panel3: false})
          }, ANIMATE_DURATION)
      var timing = Animated.timing
      Animated.parallel([
          timing(this.state.panel_flex1, {toValue: 0.01, easing: Easing.linear, duration: ANIMATE_DURATION}),
          timing(this.state.panel_flex2, {toValue: 1.0, easing: Easing.linear, duration: ANIMATE_DURATION}),
          timing(this.state.panel_flex3, {toValue: 0.01, easing: Easing.linear, duration: ANIMATE_DURATION}),
      ]).start();
  }

  _onPanel3Pressed () {
      this.setState({show_panel3: true})
      setTimeout(
          () => {
              this.setState({show_panel1: false});
              this.setState({show_panel2: false})
          }, ANIMATE_DURATION)
      var timing = Animated.timing
      Animated.parallel([
          timing(this.state.panel_flex1, {toValue: 0.01, easing: Easing.linear, duration: ANIMATE_DURATION}),
          timing(this.state.panel_flex2, {toValue: 0.01, easing: Easing.linear, duration: ANIMATE_DURATION}),
          timing(this.state.panel_flex3, {toValue: 1.0, easing: Easing.linear, duration: ANIMATE_DURATION}),
      ]).start();
  }

  render() {
      return (
          <View style = {styles.container}>
              <View style = {{flex: 1 - BOTTOM_BAR_PROPORTION, flexDirection:'row'}}>
                  { this.state.show_panel1 &&
                      <Animated.View style = {{flex: this.state.panel_flex1}}>
                          <FeedScreen></FeedScreen>
                      </Animated.View>
                  }
                  { this.state.show_panel2 &&
                  <Animated.View style = {{backgroundColor: 'black', flex: this.state.panel_flex2}}>
                  </Animated.View>
                    }

                  { this.state.show_panel3 &&
                  <Animated.View style = {{backgroundColor: 'red', flex: this.state.panel_flex3}}>
                  </Animated.View>
              }
              </View>

              <View style = {{backgroundColor: 'bisque', flex: BOTTOM_BAR_PROPORTION, flexDirection:'row'}}>
                  <TouchableHighlight style = {styles.menu_image_wrapper} onPress={this._onPanel1Pressed}>
                      <Image  style={styles.menu_image} source={image_res.home} />
                  </TouchableHighlight>
                  <TouchableHighlight style = {styles.menu_image_wrapper} onPress={this._onPanel2Pressed}>
                      <Image  style={styles.menu_image} source={image_res.home} />
                  </TouchableHighlight>
                  <TouchableHighlight style = {styles.menu_image_wrapper} onPress={this._onPanel3Pressed}>
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
