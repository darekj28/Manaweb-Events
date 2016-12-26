
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {ScrollView, Alert, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class RegisterPhoneNumber extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phone_number : "",
      validation_output: {'error' : "invalid phone number"},
      confirmationPin : "not set yet",
      length : 0
    }

    this.validatePhoneNumber = this.validatePhoneNumber.bind(this);
    this._navigateToConfirmCode = this._navigateToConfirmCode.bind(this);
    this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
    this.handlePhoneNumberSubmit = this.handlePhoneNumberSubmit.bind(this);
    this.sendConfirmationPin = this.sendConfirmationPin.bind(this);
  }




  validatePhoneNumber() {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobilePhoneNumberValidation", {method: "POST",
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
    Alert.alert(
      "We will send a verification code to " + this.state.phone_number,
      "SMS fees may apply",
      [
        {text: 'Edit', style: 'cancel'},
        {text: 'OK', onPress: () => this.sendConfirmationPin()}
      ]
    )
    // if (this.state.validation_output['result'] == 'success')
    //   this.sendConfirmationPin(this.state.phone_number);
    // else 
    //   Alert.alert(
    //     this.state.validation_output['error']);
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
      this._navigateToConfirmCode();
    })
    .done();
    
  }

  

  handlePhoneNumberChange(phone_number) {
      this.setState({phone_number: phone_number});
      var length = phone_number.length
      this.setState({length : length})
      // var length = phone_number.length
      // this.setState({length : length})
      // if (length == 3)
      //   var new_phone_number = this.state.phone_number + "-";
      //   this.setState({phone_number : new_phone_number});
      this.validatePhoneNumber();

  }

  _navigateToConfirmCode() {
    this.props.navigator.push({
    href: "RegisterConfirmCode",
      first_name : this.props.first_name,
      last_name: this.props.last_name,
      phone_number : this.state.phone_number,
      confirmationPin : this.state.confirmationPin
    })
  }

  render() {
    return (
      <View style = {styles.container}>

              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {20} />
              </TouchableOpacity>

              <ScrollView 
                scrollEnabled={false}
              >
               <TextInput
                onChangeText = {this.handlePhoneNumberChange}
                style = {styles.input} placeholder = "Phone Number"
                keyboardType = "number-pad"
                dataDetectorTypes = "phoneNumber"
                maxLength = {11}
              />

              



              <TouchableHighlight style = {styles.button} onPress = {(event) => this.handlePhoneNumberSubmit()}>
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
                (For testing) Phone number length:   {this.state.length} !!
              </Text>

              <Text>
              The current phone number state:    {this.state.phone_number} !!!
              </Text>

              <Text>
              The current confirmation pin state : {this.state.confirmationPin}
              </Text>

              </ScrollView>



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
