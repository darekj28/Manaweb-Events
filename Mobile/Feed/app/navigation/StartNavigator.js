

import React from 'react';
import {Component} from 'react'
import {AppRegistry, StyleSheet, Text, View, ListView, TouchableOpacity, TouchableHighlight, Navigator} from 'react-native';
import StartScreen from '../screens/StartScreen'
import RegisterName from '../screens/register/RegisterName'
import RegisterId from '../screens/register/RegisterId'
import RegisterEmail from '../screens/register/RegisterEmail'
import RegisterPassword from '../screens/register/RegisterPassword'
import LoginScreen from '../screens/LoginScreen'
import FeedScreen from '../screens/FeedScreen'
import RegisterNavigator from './RegisterNavigator'
import TestHTTP from '../screens/TestHTTP'



class StartNavigator extends Component {

  _renderScene(route, navigator) {
  var globalNavigatorProps = {
    navigator: navigator,
    first_name: "",
    last_name: "",
    userID : "",
    email: "",
    password: "",
    password_confirm: ""
  }

  switch(route.href){
    case "Register":
      return (
        <RegisterNavigator 
          {...globalNavigatorProps} />
        )


    case "Login":
      return (

          <LoginScreen
              {...globalNavigatorProps} 
             />

        )

    case "Start":
      return (
            <StartScreen
              {...globalNavigatorProps}
            />
        )

    case "RegisterName":
      return (
        <RegisterName 
          {...globalNavigatorProps} />
        )


    case "RegisterId":
      return (

          <RegisterId first_name = {route.first_name} last_name = {route.last_name}
             {...globalNavigatorProps} 
             />
        )

    case "RegisterEmail":
      return (
          <RegisterEmail first_name = {route.first_name} last_name = {route.last_name} userID = {route.userID}
             {...globalNavigatorProps} 
             />
        )
    case "RegisterPassword":
      return (
          <RegisterPassword first_name = {route.first_name} last_name = {route.last_name} userID = {route.userID} email = {route.email}
             {...globalNavigatorProps} 
             />
        )
		
	case "Feed":
      return (
          <FeedScreen
              {...globalNavigatorProps} 
             />

        )

      case "TestHTTP":
      return (
          <TestHTTP
              {...globalNavigatorProps} 
             />

        )


    default:
        return (
          <Text> {'BRO DO NOT GO TO THIS ROUTE $(route)'} </Text>
        )
  }
}



  render() {
    return (
      <Navigator 
      initialRoute = {{href: "Start"}}
      ref = "appNavigator"
      style = {styles.navigatorStyles}
      renderScene = {this._renderScene}
      configureScene={(route, routeStack) =>
      Navigator.SceneConfigs.FloatFromBottom}
    />
    )
  }
}

const styles = StyleSheet.create({
  
});

module.exports = StartNavigator;


