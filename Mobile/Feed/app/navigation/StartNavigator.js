

import React from 'react';
import {Component} from 'react'
import {ViewContainer, AsyncStorage, AppRegistry, StyleSheet, Text, View, ListView, TouchableOpacity, TouchableHighlight, Navigator} from 'react-native';
import StartScreen from '../screens/StartScreen'
import RegisterName from '../screens/register/RegisterName'
import RegisterPhoneNumber from '../screens/register/RegisterPhoneNumber'
import RegisterEmail from '../screens/register/RegisterEmail'
import RegisterUsername from '../screens/register/RegisterUsername'
import RegisterConfirmCode from '../screens/register/RegisterConfirmCode'
import RegisterPassword from '../screens/register/RegisterPassword'



import LoginScreen from '../screens/LoginScreen'
import FeedScreen from '../screens/FeedScreen'

import TestHTTP from '../screens/TestHTTP'



class StartNavigator extends Component {

  constructor(props) {
    super(props)
    this.state = {
      current_username: "",
      isLoading: true
    }
    this.initializeUser = this.initializeUser.bind(this);
  }

  _renderScene(route, navigator) {
  var globalNavigatorProps = {
    navigator: navigator,
  }

  switch(route.href){



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

     case "RegisterPhoneNumber":
      return (
          <RegisterPhoneNumber first_name = {route.first_name} last_name = {route.last_name}
             {...globalNavigatorProps} 
             />
        )

    case "RegisterConfirmCode":
      return (
          <RegisterConfirmCode first_name = {route.first_name} last_name = {route.last_name} 
          phone_number = {route.phone_number} confirmationPin = {route.confirmationPin}
             {...globalNavigatorProps} 
             />
        )

  
    case "RegisterPassword":
      return (
          <RegisterPassword first_name = {route.first_name} last_name = {route.last_name} 
          phone_number = {route.phone_number}
             {...globalNavigatorProps} 
             />
        )

    case "RegisterEmail":
      return (
          <RegisterEmail first_name = {route.first_name} last_name = {route.last_name}
           phone_number = {route.phone_number} password = {route.password}
             {...globalNavigatorProps} 
             />
        )


    case "RegisterUsername":
      return (

          <RegisterUsername first_name = {route.first_name} last_name = {route.last_name}
           phone_number = {route.phone_number} password = {route.password} email = {route.email}
             {...globalNavigatorProps} 
             />
        )

      {/* We shall see if we still use these

    case "RegisterBirthday":
      return (
          <RegisterBirthday first_name = {route.first_name} last_name = {route.last_name} userID = {route.userID} email = {route.email} password = {route.password}
             {...globalNavigatorProps} 
             />
        )


    case "RegisterGenderAvatar":
      return (
          <RegisterGenderAvatar first_name = {route.first_name} last_name = {route.last_name} userID = {route.userID} email = {route.email} password = {route.password} 
            birth_month = {route.birth_month} birth_day = {route.birth_day} birth_year = {route.birth_year}
             {...globalNavigatorProps} 
             />
        )
      */}

    

		
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
          <ViewContainer>
          <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {30} />
              </TouchableOpacity>

          <Text> {'BRO! DO NOT GO TO THIS ROUTE ${route}'} </Text>
          </ViewContainer>
        )
  }
}

  async initializeUser(){
      let value = await AsyncStorage.getItem("current_username")
      this.setState({current_username : value})
      this.setState({isLoading : false})
      return value;
  }


  componentWillMount() {
      this.initializeUser()
      
  }


  render() {
    var start = ""
    if (this.state.current_username == "" || this.state.current_username == null) {
      start = "Start"
    }
    else {
      start = "Feed"
    }

    if (this.state.isLoading) {
      return (
            <Text textAlignVertical = "center" textAlignHorizontal = "center">
              Loading still...
            </Text>
        )
    }

    else {
    return (
      <Navigator 
      initialRoute = {{href: start}}
      ref = "appNavigator"
      style = {styles.navigatorStyles}
      renderScene = {this._renderScene}
      configureScene={(route, routeStack) =>
      Navigator.SceneConfigs.FloatFromBottom}
      />
   ) 

   }  
  }
}

const styles = StyleSheet.create({
  
});

module.exports = StartNavigator;


