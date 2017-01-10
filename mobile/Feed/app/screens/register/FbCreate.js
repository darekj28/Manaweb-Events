
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
    this._navigateToFeed = this._navigateToFeed.bind(this);
    this.createAccount = this.createAccount.bind(this);

  }


  createAccount() {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"


    fetch(test_url + "/mobileFacebookCreateAccount", {method: "POST",
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
            AsyncStorage.setItem("current_username", responseData['current_user']['userID']);
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
    href: "Feed",
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


  componentDidMount() {
      this.pullFacebookInfo.bind(this)()
  }

  render() {
    return (
      <View style = {styles.container}>
              <Text>
                Welcome {this.state.first_name}!
              </Text>

              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {30} />
              </TouchableOpacity>

               <TextInput
              onChangeText = {this.handleUsernameChange}
              style = {styles.input} 
              placeholder = "Select a username"
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

module.exports = FbCreate
