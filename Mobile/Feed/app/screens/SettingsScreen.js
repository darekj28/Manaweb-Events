
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class RegisterUsername extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current_username: "",
      current_user: {},
      first_name : "",
      last_name : "",
      email : "",
      phone_number: "",
      first_name_validation: {},
      last_name_validation: {},
      email_validation : {},
      phone_number_validation : {},
    }
  }

    validateFirstName(first_name) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileNameValidation", {method: "POST",
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
      this.setState({first_name_validation : responseData})
    }).done();
  }

  validateLastName(last_name) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileNameValidation", {method: "POST",
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
      this.setState({last_name_validation : responseData})
    }).done();
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

  handleEmailChange(email) {
    this.setState({email : email})
    this.validateEmail(email);
  }

  handleFirstNameChange(first_name) {
    this.setState({first_name: first_name});
    this.validateFirstName(first_name);
  }

  handleLastNameChange(last_name) {
    this.setState({last_name: last_name}) 
    this.validateLastName(last_name);
  }

  initializeUserInformation(){
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileGetCurrentUserInfo", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        username: this.state.current_username
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      var thisUser = responseData.thisUser;
      this.setState({first_name : thisUser.first_name})
      this.setState({last_name : thisUser.last_name})
      this.setState({email : thisUser.email})
      this.setState({phone_number : thisUser.phone_number})
    }).done();

  }

  initializeUserName(){
    AsyncStorage.getItem("current_username").then((value) => {
      this.setState({current_username: value});
      this.initializeUserInformation.bind(this)()
    })
  }

  componentWillMount() {
    this.initializeUserName.bind(this)();
    // initialize all the states to previous values
  }

  render() {
    return (
        <View style = {styles.container}>
              <View style = {styles.input_box}>
                  <Text style = {styles.instruction_text}>
                    First Name
                  </Text>
                  <TextInput 
                      style = {styles.input_text}
                      placeholder = "First Name" 
                      maxLength = {20}
                      onChangeText = {this.handleFirstNameChange.bind(this)}
                      value = {this.state.first_name}
                  />  
                  <Text style = {styles.error_text}>
                      First Name Error Message
                  </Text>
              </View> 

              <View style = {styles.input_box}>
                  <Text style = {styles.instruction_text}>
                    Last Name
                  </Text>
                  <TextInput 
                      style = {styles.input_text}
                      placeholder = "Last Name" 
                      maxLength = {20}
                      onChangeText = {this.handleLastNameChange.bind(this)}
                      value = {this.state.last_name}
                  />  
                  <Text style = {styles.error_text}>
                      Last Name Error Message
                  </Text>
              </View>   

               <View style = {styles.input_box}> 
                <Text style = {styles.instruction_text}>
                    Email
                  </Text>
                 <TextInput
                  onChangeText = {this.handleEmailChange.bind(this)}
                  style = {styles.input_text} placeholder = "Email"
                  value = {this.state.email}
                />
                <Text style = {styles.error_text}>
                      Email Error Message
                  </Text>
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

module.exports = RegisterUsername
