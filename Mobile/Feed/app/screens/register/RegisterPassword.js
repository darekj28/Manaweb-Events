
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
    if (this.state.validation_output.result == 'success') {
      this._navigateToRegisterEmail();
    }
    else {
      alert(this.state.validation_output.error)
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

  clearPassword() {
    this.setState({password : ""})
  }

  clearPasswordConfirm() {
    this.setState({password_confirm : ""})
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
                Choose a password
              </Text>
            </View>

            <View style = {styles.input_box}> 
              <TextInput
                  onChangeText = {this.handlePasswordChange}
                  style = {styles.input_text} placeholder = "Password"
                  maxLength = {20}
                  value = {this.state.password}
                  secureTextEntry = {true}
                />

              { this.state.password != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearPassword.bind(this)}/>
              </View>
              }
              
            </View>

            <View style = {styles.input_box}> 
              
              <TextInput
                onChangeText = {this.handlePasswordConfirmChange}
                style = {styles.input_text} placeholder = "Confirm Password"
                maxLength = {20}
                value = {this.state.password_confirm}
                secureTextEntry = {true}
                />
              
              { this.state.password_confirm != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearPasswordConfirm.bind(this)}/>
              </View>
              }

            </View>
            <View style = {styles.padding} />
            <View style = {styles.bottom_bar}>

              <Text style = {styles.recovery_text}>
                {/* Forgot your password? */}
              </Text>

              <TouchableHighlight style = {styles.next} onPress = {this.handlePasswordSubmit.bind(this)}>
                <Text style = {styles.next_text}>
                  Next!
                </Text>
              </TouchableHighlight>

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

module.exports = RegisterPassword
