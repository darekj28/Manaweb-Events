
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


const FBSDK = require('react-native-fbsdk');

const {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager
} = FBSDK;


import React from 'react';
import {Component} from 'react'
import {AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput, Button} from 'react-native';

import ViewContainer from './ViewContainer';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
var {FBLogin, FBLoginManager} = require('react-native-facebook-login');



class FacebookLogin extends Component {
  constructor(props) {
    super(props)
    this.state = {
      current_username: "",
      fb_token : "",
      fb_id : "",
      thisUser: {},
      just_logged_out: false
    }
    this._navigateToFeed = this._navigateToFeed.bind(this);
    // this._navigateToFbCreateAccount = this._navigateToFbCreateAccount.bind(this)
  }

  



async loadCurrentUser(fb_id){
      let url = "https://manaweb-events.herokuapp.com"
      let test_url = "http://0.0.0.0:5000"
      let response = await fetch(test_url + "/mobileGetUserInfoFromFacebookId", {method: "POST",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }, 
        body: 
        JSON.stringify(
         {
          fb_id : this.state.fb_id
        })
      })

      let responseData = await response.json(); 
      // login is good and there already is an account for this user 
      if (responseData['result'] == 'success') {
        AsyncStorage.setItem("fb_token", this.state.fb_token)
        AsyncStorage.setItem("current_username", responseData['current_user']['userID'])
        //redirect to the feed
        this._navigateToFeed();
      }

      // otherwise there is not an account for this user
      // and we prompt them to create one!
      else {
        this._navigateToFbCreateAccount();
      }
}


_navigateToFbCreateAccount() {
  this.props.navigator.push({
    href: "FbCreate",
    fb_token: this.state.fb_token,
    fb_id : this.state.fb_id
  })
}

_navigateToFeed() {
    this.props.navigator.push({
    href: "Feed"
    })
  }

onLogin(data) {
  this.setState({ fb_token : data.credentials.token });
  this.setState({ fb_id : data.credentials.userId }); 
  this.loadCurrentUser();
}

onLoginFound(data) {
  this.setState({ fb_token : data.credentials.token });
  this.setState({ fb_id : data.credentials.userId });
  this.loadCurrentUser()
}

onLoginNotFound(data) {
  this.setState({ fb_token : "" });
  this.setState({ fb_id : "" });

}

onError(data){
  alert("ERROR");
}

onLogout(data){
  this.setState({ fb_token : "" });
  this.setState({ fb_id : "" });
}

onCancel(data){
   alert("User cancelled")
}

onPermissionsMissing(data){
    alert("Check permissions!");
}


      
componentDidMount() {
  
}

  render() {
    var _this = this;
    return (
      <View style = {styles.container}>

        

        <FBLogin style={{ marginBottom: 10, }}
        ref={(fbLogin) => { this.fbLogin = fbLogin }}
        permissions={["public_profile" , "email", "user_friends"]}
        loginBehavior={FBLoginManager.LoginBehaviors.Native}
        onLogin={this.onLogin.bind(this)}
        onLogout={this.onLogout.bind(this)}
        onLoginFound={this.onLoginFound.bind(this)}
        onLoginNotFound={this.onLoginNotFound.bind(this)}
        onError={this.onError.bind(this)}
        onCancel={this.onCancel.bind(this)}
        onPermissionsMissing={this.onPermissionsMissing.bind(this)}
      />
      
          <Text>
            Fb id  : {this.state.fb_id} 
          </Text>
          <Text>
            Fb AccessToken : {this.state.fb_token} 
          </Text>
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

module.exports = FacebookLogin
