
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class RegisterUsername extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username : "",
      validation_output: {'error' : "invalid email"}
    }

    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
    this._navigateToFeed = this._navigateToFeed.bind(this);
    this.createAccount = this.createAccount.bind(this);

  }


  createAccount() {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"


    fetch(url + "/mobileCreateProfile", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        password : this.props.password,
        email : this.props.email,
        username: this.state.username,
        first_name: this.props.first_name ,
        last_name: this.props.last_name,
        password: this.props.password,
        phone_number : this.props.phone_number
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
        
        if (responseData['result'] == 'success') {
            AsyncStorage.setItem("current_user", responseData['current_user']);
        }
        this._navigateToFeed()
    })
    .done();
  }

  handleUsernameSubmit() {
    if (this.state.validation_output['result'] == 'success') {
      this.createAccount()
    }
  }

  handleUsernameChange(username) {
    this.setState({username : username})
    this.validateUsername(username);
  }

  validateUsername(username) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileUsernameValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        username : username
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({validation_output : responseData})
    })
    .done();
  }

  _navigateToFeed() {
    this.props.navigator.push({
    href: "Menu",
    username : this.state.username
    })
  }

  render() {
    return (
      <View style = {styles.container}>
              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {30} />
              </TouchableOpacity>

               <TextInput
              onChangeText = {this.handleUsernameChange}
              style = {styles.input} 
              placeholder = "Choose a username"
              />

              <TouchableHighlight style = {styles.button} onPress = {this.handleUsernameSubmit}>
                <Text style = {styles.buttonText}>
                  Create Account!
                </Text>
              </TouchableHighlight>

              {
                this.state.validation_output['result'] == 'failure' && 
                <Text> 
                  {this.state.validation_output['error']}
                  </Text>
              }
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

module.exports = RegisterUsername
