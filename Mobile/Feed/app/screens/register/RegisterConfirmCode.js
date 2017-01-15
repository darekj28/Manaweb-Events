
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
      alert("Incorrect Pin")
    }

    else {
      this._navigateToRegisterPassword();
    }
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

              <Text style = {styles.logo}> 
                Logo
              </Text> 

              <View style = {styles.cog_box}>
                <Icon name = "cog" size = {20} style = {styles.cog}/> 
              </View>
            </View>

            <View style = {styles.instruction_box}> 
              <Text style = {styles.instruction_text}>
                Enter confirmation code sent to 
              </Text>
              <Text style = {styles.instruction_text}>
                {this.props.phone_number}
              </Text>
            </View>

            <View style = {styles.input_box}> 
                <TextInput
                onChangeText = {this.handleEnteredCodeChange}
                style = {styles.input_text} placeholder = "Enter Confirmation Code"
                keyboardType = "number-pad"
                maxLength = {5}
                value = {this.state.enteredCode}
              />

              { this.state.phone_number != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearConfirmationCode.bind(this)}/>
              </View>
              }
              
            </View>

            {/*
            <View style = {styles.error_box}>
                { error_message }
            </View>
          */}

            <View style = {styles.bottom_bar}>

              <Text style = {styles.recovery_text}>
                {/* Forgot your password? */}
              </Text>

              <TouchableHighlight style = {styles.next} onPress = {(event) => this.handleEnteredCodeSubmit.bind(this)()}>
                <Text style = {styles.next_text}>
                  Confirm!
                </Text>
              </TouchableHighlight>

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

module.exports = RegisterConfirmCode
