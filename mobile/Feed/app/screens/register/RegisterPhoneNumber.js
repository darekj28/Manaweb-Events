
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {Alert, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class RegisterPhoneNumber extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone_number : "",
      validation_output: {},
      confirmationPin : "",
    }

    this.validatePhoneNumber = this.validatePhoneNumber.bind(this);
    this._navigateToRegisterPassword = this._navigateToRegisterPassword.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.handlePhoneNumberSubmit = this.handlePhoneNumberSubmit.bind(this);
    this.sendConfirmationPin = this.sendConfirmationPin.bind(this);
  }




  validatePhoneNumber() {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(test_url + "/mobilePhoneNumberValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        phone_number : this.state.phone_number
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({validation_output : responseData})
    })
    .done();
  }

  // handle the submission of the phone number
  handlePhoneNumberSubmit(){
    if (this.state.validation_output['result'] == 'success')
      this.sendConfirmationPin(this.state.phone_number);
    else 
      Alert.alert(
        this.state.validation_output['error']);
  }

  sendConfirmationPin(phone_number){

    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(test_url + "/mobileTextConfirmation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        phone_number : this.state.phone_number
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({confirmationPin : responseData['confirmationPin']})
    })
    .done();

  }

  

  handlePhoneNumberChange(phone_number) {
      this.setState({phone_number: phone_number});
      this.validatePhoneNumber();

  }

  _navigateToRegisterPassword() {
    this.props.navigator.push({
    href: "RegisterPassword",
      first_name : this.props.first_name,
      last_name: this.props.last_name,
      phone_number : this.state.phone_number
    })
  }

  render() {
    return (
      <View style = {styles.container}>

              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {20} />
              </TouchableOpacity>

               <TextInput
                onChangeText = {(val) => this.setState({phone_number : val})}
                style = {styles.input} placeholder = "Phone Number"
                keyboardStyle = {'numeric'}
                dataDetectorTypes = {'phoneNumber'}
                value = {this.state.phone_number}
              />



              <TouchableHighlight style = {styles.button} onPress = {(event) => this.handlePhoneNumberSubmit()}>
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

module.exports = RegisterPhoneNumber
