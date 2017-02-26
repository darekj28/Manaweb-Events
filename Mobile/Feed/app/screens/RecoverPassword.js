
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {Alert, Image, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput, TouchableWithoutFeedback} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import {Dimensions} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import RegisterHeader from '../components/register/RegisterHeader';




class RegisterPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password : "",
      password_confirm: "",
      validation_output : {}
    }

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
        this.updatePassword.bind(this)()
    }
    else {
      alert(this.state.validation_output.error)
    }
  }

  updatePassword() {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileUpdatePassword", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      body:
      JSON.stringify(
       {
        username: this.props.current_username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      // this.togglePasswordModal.bind(this)();
      Alert.alert(
        "Password Succesfully Updated!",
        "Returning To the Feed Now",
        [
          {text: 'OK', onPress: () => this._navigateToMenu.bind(this)()}
        ])
    }).done();
  }

  handlePasswordChange(password) {
    this.setState({password : password})
    this.validatePassword.bind(this)(password, this.state.password_confirm)
  }

  handlePasswordConfirmChange(password_confirm) {
    this.setState({password_confirm : password_confirm})
    this.validatePassword.bind(this)(this.state.password, password_confirm)
  }

  clearPasswordConfirm() {
    this.setState({password_confirm : ""})
  }

// add validators
  _navigateToMenu() {
    this.props.navigator.push({
    href: "Menu",
    })
  }

  render() {
      var {height, width} = Dimensions.get('window');
      return (
          <TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
              <View style={[styles.container, {height: height}]}>
                  <RegisterHeader navigator={this.props.navigator}/>
                  <View style={{flex : 1, flexDirection : 'column'}}>
                      <View style={{flex : 2}}>
                          <View style={{flex : 1.4, alignItems : 'center', justifyContent : 'center'}}>
                              <Text style={{fontSize : 18}}>Choose a password</Text>
                          </View>
                          <View style={{flex : 0.6}}/>
                          <View style={{flex : 1, justifyContent : 'center'}}>
                              <Text style={styles.label}>Password</Text>
                              <View style={styles.input_wrapper}>
                                  <TextInput onChangeText = {this.handlePasswordChange}
                                      style = {styles.input}
                                      maxLength = {20}
                                      value = {this.state.password}
                                      secureTextEntry = {true}
                                      placeholder= "Password"
                                  />
                              </View>
                              <View style={styles.input_wrapper}>
                                  <TextInput onChangeText = {this.handlePasswordChange}
                                      style = {styles.input}
                                      maxLength = {20}
                                      value = {this.state.password}
                                      secureTextEntry = {true}
                                      placeholder= "Confirm password"
                                  />
                              </View>
                          </View>
                          <View style={{flex : 0.1}}/>
                      </View>
                      <View style = {{flex : 1, alignItems : 'center'}}>
                          <TouchableOpacity style={{flex : 1}} onPress = {this.handlePasswordSubmit.bind(this)}>
                              <View style = {styles.button}>
                                  <Text style={styles.button_text}>Update Password</Text>
                              </View>
                          </TouchableOpacity>
                          <View style={{flex : 0.5}}/>
                          <View style={{flex : 0.5}}/>
                      </View>
                      <View style = {{flex : 3}}/>
                  </View>
              </View>
          </TouchableWithoutFeedback>

    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems : 'center',
        backgroundColor: "white",
    },
    label : {flex : 0, fontSize : 12, fontWeight : 'bold', color : '#696969'},
    input_wrapper : {flex : 1, borderBottomColor : 'silver', borderBottomWidth : 1},
    input : {flex : 1, width : 200, fontSize : 20, justifyContent : 'flex-start', paddingBottom: 0},
    button : {
        flex : 1,
        backgroundColor : '#90d7ed',
        borderRadius:60,
        justifyContent : 'center',
        alignItems : 'center',
        width : 100,
        height : 35
    },
    button_text : {color : 'white', fontWeight : 'bold', fontSize : 14},
});

module.exports = RegisterPassword
