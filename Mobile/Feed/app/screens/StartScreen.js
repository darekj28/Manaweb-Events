
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput, Button} from 'react-native';

import ViewContainer from '../components/ViewContainer';
import HomeStatusBar from '../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class StartScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email : ""
    }
  }

  _navigateToLogin() {
    this.props.navigator.push({
    href: "Login",
    })
  }
  _navigateToRegisterName() {
    this.props.navigator.push({
    href: "RegisterName",
    })
  }

  _navigateToFeed() {
    this.props.navigator.push({
    href: "Feed",
    })
  }

  _navigateToTestHTTP() {
    this.props.navigator.push({
    href: "TestHTTP",
    })
  }

  render() {
    return (
      <View style = {styles.container}>
              <TouchableHighlight style = {styles.button} onPress = {(event) => this._navigateToLogin()}>
                <Text style = {styles.buttonText}>
                  Login!
                </Text>
              </TouchableHighlight>


              <TouchableHighlight style = {styles.button} onPress = {(event) => this._navigateToRegisterName()}>
                <Text style = {styles.buttonText}>
                  Register!
                </Text>
              </TouchableHighlight>

			        <TouchableHighlight style = {styles.button} onPress = {(event) => this._navigateToFeed()}>
                <Text style = {styles.buttonText}>
                  Testing button. Go to feed page
                </Text>
              </TouchableHighlight>

              <TouchableHighlight style = {styles.button} onPress = {(event) => this._navigateToTestHTTP()}>
                <Text style = {styles.buttonText}>
                  Testing HTTP Request
                </Text>
              </TouchableHighlight>

      </View>
    )
  }


}

const styles = StyleSheet.create({
  input : {
    color : "coral",
    height: 35,
    marginTop: 10,
    padding : 4,
    fontSize : 18,
    borderWidth : 1,
    borderColor : "#48bbec",
    marginLeft : 20,
    marginRight : 35
  },
  container: {
    flex:1,
    justifyContent: 'flex-start',
    padding : 10,
    paddingTop: 40
  },
  button :{
    height: 35,
    marginTop: 10,
    padding : 4,
    borderWidth : 1,
    borderColor : "#48bbec",
    marginLeft : 20,
    marginRight : 35,
    backgroundColor: "black"
  },
  buttonText : {
    justifyContent: "center",
    alignItems: "center",
    color: "white"
  }

});

module.exports = StartScreen
