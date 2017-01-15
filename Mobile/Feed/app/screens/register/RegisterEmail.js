
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





class RegisterEmail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email : "",
      validation_output: {'error' : ""}
    }

    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this._navigateToRegisterUsername = this._navigateToRegisterUsername.bind(this);
  }

  handleEmailSubmit() {
    if (this.state.validation_output['result'] == 'success') {
      this._navigateToRegisterUsername()
    }
  }

  handleEmailChange(email) {
    this.setState({email : email})
    this.validateEmail(email);
  }

  validateEmail(email) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileEmailValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        email : email
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({validation_output : responseData})
    })
    .done();
  }

  clearEmail() {
    this.setState({email : ""})
  }

  _navigateToRegisterUsername() {
    this.props.navigator.push({
    href: "RegisterUsername",
    email : this.state.email,
    phone_number : this.props.phone_number,
    password : this.props.password,
    first_name: this.props.first_name,
    last_name: this.props.last_name
    })
  }

  getErrorMessage() {
    var error_message = "";
    if (this.state.validation_output.error != "" && this.state.validation_output.error != null) {
      error_message = this.state.validation_output.error;
      return (
          <Text style = {styles.error_message}>
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
                What's yo e-mail?
              </Text>
            </View>

            <View style = {styles.input_box}> 
              
               <TextInput
                onChangeText = {this.handleEmailChange}
                style = {styles.input_text} placeholder = "Email"
                value = {this.state.email}
              />

              { this.state.email != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearEmail.bind(this)}/>
              </View>
              }
            </View>

            <View style = {styles.error_box}>
                {error_message}
            </View>

            <View style = {styles.bottom_bar}>

              <Text style = {styles.recovery_text}>
                {/* Forgot your password? */}
              </Text>

              <TouchableHighlight style = {styles.next} onPress = {this.handleEmailSubmit.bind(this)}>
                <Text style = {styles.next_text}>
                  Next!
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

  error_box : {
    flex: 0.05,
    flexDirection : "column"
  },

  error_text : {

  },

  padding : {
    flex: 0.60,
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

module.exports = RegisterEmail
