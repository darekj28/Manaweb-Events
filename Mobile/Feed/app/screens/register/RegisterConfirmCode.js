
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {Image, ScrollView, Alert, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class RegisterConfirmCode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      validation_output: {'error' : ""},
      enteredCode : ""
    }

    this.handleEnteredCodeChange = this.handleEnteredCodeChange.bind(this);
    this.handleEnteredCodeSubmit = this.handleEnteredCodeSubmit.bind(this);
    this._navigateToRegisterPassword = this._navigateToRegisterPassword.bind(this);
  }


  handleEnteredCodeChange(enteredCode) {
    this.setState({enteredCode : enteredCode});
  }

  handleEnteredCodeSubmit() {
    if (this.props.confirmationPin != this.state.enteredCode) {
      var result_dict = {
        'result' : 'failure',
        'error' : "incorrect confirmation code"
      }
      this.setState({validation_output : result_dict})
      alert("Incorrect Confirmation Pin")
      // potentially add option to resend by clicking part of the alert
    }

    else {
      this._navigateToRegisterPassword();
    }
  }


  resendConfirmationPin(){
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileResendTextConfirmation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        phone_number : this.props.phone_number,
        confirmationPin : this.props.confirmationPin
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.error){
        Alert.alert("Invalid Phone Number")
      }
      else {
        this.setState({confirmationPin : responseData['confirmationPin']})
      }
    })
    .done();
  }

  clearConfirmationCode() {
    this.setState({enteredCode: ""})
  }

  _navigateToRegisterPassword() {
    this.props.navigator.push({
    href: "RegisterPassword",
      first_name : this.props.first_name,
      last_name: this.props.last_name,
      phone_number : this.props.phone_number
    })
  }

  getErrorMessage() {
    var error_message = "";
    if (this.state.validation_output.error != "") {
      error_message = this.state.validation_output.error;
      return (
          <Text style = {styles.error_text}>
                    {error_message}
            </Text>
        )
    }
    else return;
  }

  render() {

    var error_message = this.getErrorMessage.bind(this)()
    return (

      <View style = {styles.container}>
          <View style = {styles.top_bar}>
              <TouchableOpacity style = {styles.back_button}
                onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {20}/>
              </TouchableOpacity>
               <Image
                style={styles.logo}
                source={require('../../static/favicon-32x32.png')}
              />
              <View style = {styles.cog_box}>
                <Icon name = "cog" size = {20} style = {styles.cog}/> 
              </View>
            </View>
            <View style = {styles.small_padding}/>
            <View style = {styles.instruction_box}> 
              <Text style = {styles.instruction_text}>
                Enter the confirmation code sent to {this.props.phone_number}
              </Text>
            </View>

          {/* <View style = {styles.small_padding} /> */}


            <View style = {styles.input_row}>
              <View style = {styles.input_box}> 
                <TextInput
                onChangeText = {this.handleEnteredCodeChange}
                style = {styles.input_text} placeholder = "Enter Confirmation Code"
                keyboardType = "number-pad"
                maxLength = {5}
                value = {this.state.enteredCode}
              />

              { this.state.enteredCode != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearConfirmationCode.bind(this)}/>
              </View> }
              </View>
            </View>

          <View style = {styles.small_padding}/>
     
            <View style = {styles.small_padding}/>
            <View style = {styles.large_padding} />
             <View style = {styles.bottom_bar}>
             <TouchableOpacity style = {styles.resend} onPress = {this.resendConfirmationPin.bind(this)}>
              <Text style = {styles.next_text}>
                Resend Pin
              </Text>
             </TouchableOpacity>
              <TouchableOpacity style = {styles.next} onPress = {this.handleEnteredCodeSubmit.bind(this)}>
                <Text style = {styles.next_text}>
                  Confirm!
                </Text>
              </TouchableOpacity>
             </View>
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
  },


  top_bar : {
    flex : 0.05,
    flexDirection : "row",
    justifyContent: "space-around",
    // backgroundColor: "coral",
    alignItems: "center"
  },

  back_button :{
    flex : 1,
  },

  back_button_text: {

  },

  logo: {
    flex : 1,
    resizeMode: "contain"
  },

  cog_box: {
    flex:1,
    flexDirection : "row",
    justifyContent : "flex-end"
  },
  // cog : {
  // },

  instruction_box :{
    flex : 0.15,
  },

  instruction_text : {
    fontSize : 24
  },

  input_row: {
    flexDirection: "row",
    flex : 0.075,
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
    padding: 5
  },

  clear_button : {
    flex: 0.05,
    justifyContent: "center"
  },

  large_padding : {
    flex: 0.375,
    backgroundColor : "white"
  },

    error_box : {
    flex: 0.05,
    flexDirection : "column",
  },

  error_text : {
    color : "red",
    fontSize : 20,
    alignSelf: "center"
  },

 
  bottom_bar : {
    flex : 0.05,
    // backgroundColor : "purple",
    flexDirection: "row",
    justifyContent : "flex-end",
  },

  recovery_text: {
    flex: 0.75
  },
 
  next_text : {
    borderColor : "skyblue",
    borderWidth : 1,
    borderRadius : 5,
    padding: 8,
    textAlign : "center"
  },

  small_padding : {
    flex : 0.05,
  },

});

module.exports = RegisterConfirmCode
