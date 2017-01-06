
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


const FBSDK = require('react-native-fbsdk');

const {
  LoginButton,
  AccessToken
} = FBSDK;


import React from 'react';
import {Component} from 'react'
import {AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput, Button} from 'react-native';

import ViewContainer from './ViewContainer';
import HomeStatusBar from './HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';


class FbLogin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current_username: ""
    }

  }

  
  componentWillMount() {

  }

  render() {

    return (
      <View style = {styles.container}>


        <LoginButton 
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + result.error);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                AccessToken.getCurrentAccessToken((token) => {
                 alert(token.tokenString);
                })
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")}/>
      

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

module.exports = FbLogin
