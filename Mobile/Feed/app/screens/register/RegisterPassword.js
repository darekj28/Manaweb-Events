
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class RegisterPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password : "",
      password_confirm: ""
    }
  }


// add validators
  _navigateToRegisterBirthday(password, password_confirm) {
    this.props.navigator.push({
    href: "RegisterBirthday",
    password : password,
    password_confirm: password_confirm,
    email : this.props.email,
    userID: this.props.userID,
    first_name: this.props.first_name,
    last_name: this.props.last_name
    })
  }

  render() {
    return (
      <View style = {styles.container}>
              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {30} />
              </TouchableOpacity>

               <TextInput
              onChangeText = {(val) => this.setState({password : val})}
              style = {styles.input} placeholder = "password"
              secureTextEntry = {true}
              />

              <TextInput
              onChangeText = {(val) => this.setState({password_confirm : val})}
              style = {styles.input} placeholder = "password_confirm"
              secureTextEntry = {true}
              />

              <TouchableHighlight style = {styles.button} onPress = {(event) => this._navigateToRegisterBirthday(this.state.password, this.state.password_confirm)}>
                <Text style = {styles.buttonText}>
                  Next!
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

module.exports = RegisterPassword
