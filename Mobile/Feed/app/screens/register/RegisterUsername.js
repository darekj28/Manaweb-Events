
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {Image, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';

class RegisterUsername extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username : "",
      validation_output: {'error' : ""}
    }
    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
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
            AsyncStorage.setItem("current_username", responseData.current_user.userID);
            this._navigateToWelcome.bind(this)(responseData.current_user);
        }
    }).done();
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

  clearUsername() {
    this.setState({username : ""})
  }

  _navigateToWelcome(current_user) {
    this.props.navigator.push({
    href: "Welcome",
    current_user : current_user
    })
  }

  getErrorMessage() {
    var error_message = "";
    if (this.state.validation_output.error != "" && this.state.validation_output.error != null) {
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
    var error_message = this.getErrorMessage.bind(this)();
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
                Pick a username
              </Text>
            </View>
            <View style = {styles.input_row}>
              <View style = {styles.input_box}> 
                <TextInput
                onChangeText = {this.handleUsernameChange.bind(this)}
                style = {styles.input_text} placeholder = "Username"
                value = {this.state.username}
              />
              { this.state.username != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearUsername.bind(this)}/>
              </View>}
              </View>
            </View>
          <View style = {styles.small_padding}/>
          { error_message != null &&
              <View style = {styles.error_box}>
                {error_message}
            </View>
          }
          {error_message == null &&
            <View style = {styles.small_padding}/>
          }
            <View style = {styles.large_padding} />
             <View style = {styles.bottom_bar}>
                <TouchableHighlight style = {styles.next} onPress = {this.handleUsernameSubmit.bind(this)}>
                <Text style = {styles.next_text}>
                  Submit!
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
    flex : 0.075,
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
    flex: 0.45,
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

module.exports = RegisterUsername
