
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
      password_confirm: "",
      validation_output : {}
    }

    this._navigateToRegisterEmail = this._navigateToRegisterEmail.bind(this);
    this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
  }


  validatePassword(password, password_confirm) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobilePasswordValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        password: password,
        password_confirm: password_confirm
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({validation_output : responseData})
    })
    .done();
  }

  handlePasswordSubmit() { 
    if (this.state.validation_output['result'] == 'success') {
      this._navigateToRegisterEmail();
    }
  }

  handlePasswordChange(password) {
    this.setState({password : password})
    this.validatePassword(password, this.state.password_confirm)
  }

  handlePasswordConfirmChange(password_confirm) {
    this.setState({password_confirm : password_confirm})
    this.validatePassword(this.state.password, password_confirm)
  }

// add validators
  _navigateToRegisterEmail() {
    this.props.navigator.push({
    href: "RegisterEmail",
    password : this.state.password,
    password_confirm: this.state.password_confirm,
    phone_number : this.props.phone_number,
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
              onChangeText = {this.handlePasswordChange}
              style = {styles.input} placeholder = "Password"
              secureTextEntry = {true}
              />

              <TextInput
              onChangeText = {this.handlePasswordConfirmChange}
              style = {styles.input} placeholder = "Confirm Password"
              secureTextEntry = {true}
              />

              <TouchableHighlight style = {styles.button} onPress = {this.handlePasswordSubmit}>
                <Text style = {styles.buttonText}>
                  Next!
                </Text>
              </TouchableHighlight>

                {
                this.state.validation_output['result'] == 'failure' && 
                <Text> 
                  {this.state.validation_output['error']}
                  </Text>
               }

              <Text>
                Password : {this.state.password}
                </Text>

                <Text> 
                  Password Confirm : {this.state.password_confirm}
                </Text>

      </View>
    )
  }


}

const styles = StyleSheet.create({
  input : {
    color : "black",
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
