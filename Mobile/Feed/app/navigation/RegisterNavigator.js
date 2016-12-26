

import React from 'react';
import {Component} from 'react'
import {AppRegistry, StyleSheet, Text, View, ListView, TouchableOpacity, TouchableHighlight, Navigator} from 'react-native';
import RegisterName from '../screens/register/RegisterName';
import RegisterUsername from '../screens/register/RegisterUsername';
import RegisterEmail from '../screens/register/RegisterEmail';
import RegisterPassword from '../screens/register/RegisterPassword';
import RegisterBirthday from '../screens/register/RegisterBirthday';
import RegisterPhoneNumber from '../screens/register/RegisterPhoneNumber';
import RegisterGenderAvatar from '../screens/register/RegisterGenderAvatar';


class RegisterNavigator extends Component {

  _renderScene(route, navigator) {
  var globalNavigatorProps = {
    navigator: navigator
  }

  switch(route.href){
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

  
    case "RegisterPassword":
      return (
          <RegisterPassword first_name = {route.first_name} last_name = {route.last_name} phone_number = {route.phone_number}
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



  render() {
    return (
      <Navigator 
      initialRoute = {{href: "RegisterName"}}
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

module.exports = RegisterNavigator;


