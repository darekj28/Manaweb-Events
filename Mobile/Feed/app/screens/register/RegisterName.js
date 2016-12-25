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





export default class RegisterName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      first_name : "",
      last_name : "",
      validation_output : {error: "Please enter a non blank name"}
    }
    this.validateFullName = this.validateFullName.bind(this);
    this.submitFullName = this.submitFullName.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
  }


  validateFullName() {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"


    fetch(test_url + "/mobileNameValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        first_name: this.state.first_name,
        last_name: this.state.last_name
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({validation_output : responseData})
    })
    .done();
  }

  submitFullName() {
    if (this.state.validation_output['result'] == 'success')
      this._navigateToRegisterPhoneNumber();
    else 
      Alert.alert(
        this.state.validation_output['error']);
  }

  _navigateToRegisterPhoneNumber() {
    this.setState({test: 'this ran'})
    this.props.navigator.push({
    href: "RegisterPhoneNumber",
    first_name : this.state.first_name,
    last_name : this.state.last_name
    })
  }

  handleFirstNameChange(first_name) {
    this.setState({first_name: first_name});
    this.validateFullName();
  }

  handleLastNameChange(last_name) {
    this.setState({last_name: last_name}) 
    this.validateFullName();
  }

  render() {
    return (
      <View style = {styles.container}>

              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {30} />
              </TouchableOpacity>

              <Text style = {styles.welcome}>
                What is your name?
              </Text>

               <TextInput
                onChangeText = {this.handleFirstNameChange}
                style = {styles.input} placeholder = "First Name"
                maxLength = {20}
              />

               <TextInput
              onChangeText = {this.handleLastNameChange}
              style = {styles.input} placeholder = "Last Name"
              maxLength = {20}
              />

              <TouchableHighlight style = {styles.button} onPress = {this.submitFullName}>
                <Text style = {styles.buttonText}>
                  Next!
                </Text>
              </TouchableHighlight>

              {/* For testing the state changes
                <Text>
                  {this.state.first_name} !!
               </Text>
                */}


              {this.state.validation_output['result'] == 'failure' && 
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
    justifyContent : "center",
    backgroundColor: "black"
  },
  buttonText : {
    justifyContent: "center",
    alignItems: "center",
    color : 'white'
  },

  welcome : {
    backgroundColor :'skyblue',
    justifyContent: 'center',
    marginRight : 35,
    marginLeft: 20
  }

});

module.exports = RegisterName
