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
import {Platform, AsyncStorage, Image, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput, Button} from 'react-native';
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
      thisUser: {}
    }
    this._navigateToFeed = this._navigateToFeed.bind(this);
    // this._navigateToFbCreateAccount = this._navigateToFbCreateAccount.bind(this)
  }

async loadCurrentUser(fb_id){
      let url = "https://manaweb-events.herokuapp.com"
      let test_url = "http://0.0.0.0:5000"
      let response = await fetch(url + "/mobileGetUserInfoFromFacebookId", {method: "POST",
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
        this.props.asyncStorageLogin(responseData['current_user']['userID']).then(() => {
          AsyncStorage.setItem("fb_token", this.state.fb_token).done()
        }).done()
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
        <View style = {{flexDirection:'row'}}>
            {Platform.OS != 'ios' && <Image
                style = {[styles.image_style, {width: this.props.height, height: this.props.height}]}
                source={require('../static/fbLogo3.png')} />}
            <FBLogin style={[styles.fb_button, {height: this.props.height}]}
            ref={(fbLogin) => { this.fbLogin = fbLogin }}
            permissions={["public_profile" , "email"]}
            loginBehavior={FBLoginManager.LoginBehaviors.Native}
            onLogin={this.onLogin.bind(this)}
            onLogout={this.onLogout.bind(this)}
            onLoginFound={this.onLoginFound.bind(this)}
            onLoginNotFound={this.onLoginNotFound.bind(this)}
            onError={this.onError.bind(this)}
            onCancel={this.onCancel.bind(this)}
            onPermissionsMissing={this.onPermissionsMissing.bind(this)}>
            </FBLogin>
        </View>

    )
  }


}

const styles = StyleSheet.create({
    fb_button : {
        alignItems : "center",
        borderTopRightRadius : 5,
        borderBottomRightRadius : 5,
        flex: 0,
    },
    image_style: {
        tintColor: '#3b5998',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
    }
});

module.exports = FacebookLogin
