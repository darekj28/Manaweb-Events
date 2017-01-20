
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

import React from 'react';
import {Component} from 'react'
import {AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class FbCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username : "",
      validation_output: {'error' : "invalid email"},
      first_name : "",
      last_name : "",
      email : "",
      fb_id : ""
    }

    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
    this.createAccount = this.createAccount.bind(this);

  }


  createAccount() {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"


    fetch(url + "/mobileFacebookCreateAccount", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        email : this.state.email,
        username: this.state.username,
        first_name: this.state.first_name ,
        last_name: this.state.last_name,
        fb_id: this.props.fb_id
        // password: this.props.password,
        // phone_number : this.props.phone_number
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
        if (responseData['result'] == 'success') {
            AsyncStorage.setItem("fb_token", this.props.fb_token)
            AsyncStorage.setItem("current_username", responseData.current_user.userID);
            this._navigateToWelcome.bind(this)(responseData.current_user)
        }
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

  _navigateToWelcome(current_user) {
    this.props.navigator.push({
    href: "Welcome",
    current_user : current_user
    })
  }

  pullFacebookInfo(){
    const infoRequest = new GraphRequest(
          '/me',
          {
            parameters: {
              fields: {
                string: 'email,name,first_name,last_name' // what you want to get
              },
              access_token: {
                string: this.props.fb_token.toString() // put your accessToken here
              }
            }
          },
          this.handleFacebookPull.bind(this) // make sure you define _responseInfoCallback in same class
        );
    new GraphRequestManager().addRequest(infoRequest).start();
  }

  handleFacebookPull(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
      console.log(Object.keys(error));// print all enumerable 
      console.log(error.errorMessage); // print error message
      // error.toString() will not work correctly in this case
      // so let use JSON.stringify()
      // meow_json = JSON.stringify(error); // error object => json 
      // console.log(meow_json); // print JSON 
    } else {
      // alert('Success fetching data: ' + result);
      this.setState({email : result.email})
      this.setState({first_name : result.first_name})
      this.setState({last_name : result.last_name})

      console.log(result.toString())
      console.log(Object.keys(result)); 
      // meow_json = JSON.stringify(result); // result => JSON
      // console.log(meow_json); // print JSON
    } 
  }

  clearUsername(){
    this.setState({username: ""})
  }


  componentDidMount() {
      this.pullFacebookInfo.bind(this)()
  }

  getErrorMessage() {
    var error_message = this.state.validation_output.error

    if (error_message == "" || error_message == null) {
      return;
    }
    else {
      return (
            <Text style = {styles.error_box}>
              {error_message}
            </Text> 
        )
    }
  }

  render() {
    var error_message = this.getErrorMessage.bind(this)();
    return (
      <View style = {styles.container}>
            <View style = {styles.top_bar}>
              <TouchableOpacity style = {styles.back_button}
                onPress = {() => this.props.navigator.pop()}>
                <Text style = {styles.back_button_text}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <Text style = {styles.logo}> 
                Logo
              </Text> 

              <View style = {styles.cog_box}>
                <Icon name = "cog" size = {20} style = {styles.cog}/> 
              </View>
            </View>

            <View style = {styles.login_instruction_box}> 
              <Text style = {styles.login_instruction_text}>
                Welcome {this.state.first_name}!
              </Text>
            </View>

            <View style = {styles.input_box}> 
              <TextInput 
              onChangeText = {this.handleUsernameChange}
              style = {styles.input_text} placeholder = "Enter Username or Email"
              val = {this.state.username}
              />

              { this.state.username != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearUsername.bind(this)}/>
              </View>
              }
              
            </View>

            <View style = {styles.error_box}>
                {error_message}
            </View>


            <View style = {styles.padding} />

            <View style = {styles.bottom_bar}>
              <Text style = {styles.recovery_text}>
                {//Forgot your password?
                }
              </Text>

              <TouchableHighlight style = {styles.login_submit} onPress = {this.handleUsernameSubmit}>
                <Text style = {styles.login_submit_text}>
                  Create Account!
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

module.exports = FbCreate
