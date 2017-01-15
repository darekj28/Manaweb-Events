
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
      raw_phone_number: "",
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




  validatePhoneNumber(phone_number) {
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
        phone_number : phone_number
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

  sendConfirmationPin(){

    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileTextConfirmation", {method: "POST",
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
      this.setState({raw_phone_number : phone_number})
      var length = phone_number.length
      this.setState({length : length})
      var new_phone_number = "";
      if (length < 3) {
        new_phone_number = "(" + phone_number;
      }

      if (length == 3) {
        new_phone_number = "(" + phone_number + ") "
      }

      if (length > 3 && length < 6) {
        new_phone_number = "(" + phone_number.substring(0,3) + ") " + phone_number.substring(3, length)
      }

      if (length >= 6) {
        new_phone_number = "(" + phone_number.substring(0,3) + ") " + phone_number.substring(3, 6) + "-" + phone_number.substring(6, length)
      }

       
      this.setState({phone_number : new_phone_number});  
      this.validatePhoneNumber(phone_number);

  }

  clearPhoneNumber() {
    this.setState({phone_number: ""})
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

  getErrorMessage() {
    var error_message = "";
    if (this.state.validation_output.error != "" && this.state.validation_output.error != null) {
      error_message == this.state.validation_output.error;
    }


    if (error_message != "" && error_message != null) {
      alert("bro")
      return (
              <Text style = {styles.error_text}>
                    {error_message}
              </Text>
        )

    }
    else return;
  }


  render() {
    var error_message = this.getErrorMessage.bind(this)();
    return (

              <View style = {styles.container}>
          <View style = {styles.top_bar}>
              <TouchableOpacity style = {styles.back_button}
                onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {20}/>
              </TouchableOpacity>

              <Text style = {styles.logo}> 
                Logo
              </Text> 

              <View style = {styles.cog_box}>
                <Icon name = "cog" size = {20} style = {styles.cog}/> 
              </View>
            </View>

            <View style = {styles.instruction_box}> 
              <Text style = {styles.instruction_text}>
                Enter your phone number
              </Text>
            </View>

            <View style = {styles.input_box}> 
              
               <TextInput
                onChangeText = {this.handlePhoneNumberChange}
                style = {styles.input_text} placeholder = "Phone Number"
                keyboardType = "number-pad"
                dataDetectorTypes = "phoneNumber"
                maxLength = {10}
                value = {this.state.raw_phone_number}
              />

              { this.state.phone_number != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearPhoneNumber.bind(this)}/>
              </View>
              }
              
            </View>

            <View style = {styles.error_box}>
                <Text> {this.state.validation_output.error} </Text>
                { //error_message 
                }
            </View>


            <View style = {styles.padding} />

            

          </View>
    )
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection : "column",
    justifyContent: 'space-between',
    padding : 10,
    paddingTop: 40,
    backgroundColor: "white",
    alignItems: 'flex-start'
  },


  top_bar : {
    flex : 0.1,
    flexDirection : "row",
    justifyContent: "space-around",
  },

  back_button :{
    flex : 1,
  },

  back_button_text: {

  },

  logo: {
    flex : 1,
    textAlign: "center"
  },

  cog_box: {
    flex:1,
    flexDirection : "row",
    justifyContent : "flex-end"
  },
  // cog : {
  // },

  instruction_box :{
    flex : 0.075,
  },

  instruction_text : {
    fontSize : 16
  },

  input_box: {
    flexDirection : "row",
    flex: 0.075,
    borderColor: "skyblue",
    borderWidth : 1,
    borderRadius : 5
    // backgroundColor: "skyblue"
  },

  input_text :{
    flex: 0.65,
  },

  clear_button : {
    flex: 0.05,
    justifyContent: "center"
  },

  show_password_box : {
    flex : 0.05,
    // backgroundColor : "orange",
    justifyContent: "flex-end"
  },

  show_password_text : {

  },

  padding : {
    flex: 0.65,
    backgroundColor : "white"
  },

  bottom_bar : {
    flex : 0.05,
    // backgroundColor : "purple",
    flexDirection: "row",
    justifyContent : "space-between"
  },

  recovery_text: {
    flex: 0.75
  },

  next : {
    flex: 0.25,

  },

  next_text : {
    borderColor : "skyblue",
    borderWidth : 1,
    borderRadius : 5,
    textAlign : "center"
  },

});

module.exports = RegisterPhoneNumber
