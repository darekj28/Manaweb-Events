
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
      validation_output: {'error' : ""}
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

  clearUsername() {
    this.setState({username : ""})
  }

  _navigateToFeed() {
    this.props.navigator.push({
    href: "Menu",
    username : this.state.username
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
                Pick a cool username! 
              </Text>
              <Text style = {styles.instruction_text}>
                Maybe something with bro
              </Text>
            </View>

            <View style = {styles.input_box}> 
               <TextInput
                onChangeText = {this.handleUsernameChange.bind(this)}
                style = {styles.input_text} placeholder = "Username"
                value = {this.state.username}
              />

              { this.state.username != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearUsername.bind(this)}/>
              </View>
              }
            </View>

            <View style = {styles.error_box}>
                {//error_message
                }
            </View>

            <View style = {styles.bottom_bar}>

              <Text style = {styles.recovery_text}>
                {/* Forgot your password? */} 
              </Text>

              <TouchableHighlight style = {styles.next} onPress = {this.handleUsernameSubmit.bind(this)}>
                <Text style = {styles.next_text}>
                  Submit!
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

module.exports = RegisterUsername
