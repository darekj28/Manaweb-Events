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





export default class RegisterName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      first_name : "",
      last_name : "",
      first_name_validation_output : {error: "Please enter a non blank first name"},
      last_name_validation_output : {error: "Please enter a non blank last name"}
    }
    this.validateFirstName = this.validateFirstName.bind(this);
    this.validateLastName = this.validateLastName.bind(this);
    this.submitFullName = this.submitFullName.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
  }


  validateFirstName(first_name) {
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
        name: first_name
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({first_name_validation_output : responseData})
    })
    .done();
  }

  validateLastName(last_name) {
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
        name: last_name
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({last_name_validation_output : responseData})
    })
    .done();
  }


  submitFullName() {
    if (this.state.first_name_validation_output['result'] == 'success' 
      && this.state.last_name_validation_output['result'] == 'success')
      this._navigateToRegisterPhoneNumber();
  }

  _navigateToRegisterPhoneNumber() {

    this.props.navigator.push({
    href: "RegisterPhoneNumber",
    first_name : this.state.first_name,
    last_name : this.state.last_name
    })
  }

  handleFirstNameChange(first_name) {
    this.setState({first_name: first_name});
    this.validateFirstName(first_name);
  }

  handleLastNameChange(last_name) {
    this.setState({last_name: last_name}) 
    this.validateLastName(last_name);
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

              <ScrollView 
                scrollEnabled={false}
              >
               <TextInput
                onChangeText = {this.handleFirstNameChange}
                style = {styles.input} placeholder = "First Name"
                maxLength = {20}
              />

              {
                this.state.first_name_validation_output['result'] == 'failure' && 
                <Text> 
                  {this.state.first_name_validation_output['error']}
                  </Text>
              }

               <TextInput
              onChangeText = {this.handleLastNameChange}
              style = {styles.input} placeholder = "Last Name"
              maxLength = {20}
              />

              {
                this.state.last_name_validation_output['result'] == 'failure' && 
                <Text> 
                  {this.state.last_name_validation_output['error']}
                  </Text>
              }

              

              <TouchableHighlight style = {styles.button} onPress = {this.submitFullName}>
                <Text style = {styles.buttonText}>
                  Next!
                </Text>
              </TouchableHighlight>

              </ScrollView>

              {/* For testing the state changes
                <Text>
                  {this.state.first_name} !!
               </Text>
                */}


              

              
           

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
