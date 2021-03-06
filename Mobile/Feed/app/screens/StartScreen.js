
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
import {Image, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput, Button} from 'react-native';
import ViewContainer from '../components/ViewContainer';
import HomeStatusBar from '../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import FacebookLogin from '../components/FacebookLogin';

class StartScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email : "",
      current_username: ""
    }
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(val) {
    AsyncStorage.setItem("current_username", "");
    this.setState({current_username: ""})
  }

  _navigateToLogin() {
    this.props.navigator.push({
    href: "Login",
    })
  }
  _navigateToRegisterName() {
    this.props.navigator.push({
    href: "RegisterName",
    })
  }

  _navigateToFeed() {
    this.props.navigator.push({
    href: "Menu",
    })
  }

  _navigateToTestHTTP() {
    this.props.navigator.push({
    href: "TestHTTP",
    })
  }
  // componentWillMount() {
  //    AsyncStorage.getItem("current_username").then((value) => {
  //         if (value == null){
  //           this.setState({"current_username" : ""})
  //         } else {
  //           this.setState({"current_username": value});
  //         }
  //       }).done();
  // }

  render() {
    return (
      <View style = {styles.container}>
              <View style = {styles.logo_box}>
                  <Image
                    style={styles.logo}
                    source={require('../components/res/logo4.png')}
                  />
              </View>
              <View style = {styles.welcome_box}>
              <Text style = {styles.welcome_text}>
                Welcome to Manaweb!
              </Text>
              <Text style = {styles.description_text}>
                  See what's happening in the Magic world now!
              </Text>
              </View>
              <View style = {styles.padding_box}/>
              <View style = {styles.button_box}>
              <TouchableOpacity style = {styles.register_button} onPress = {(event) => this._navigateToRegisterName()}>
                <Text style = {styles.register_buttonText}>
                  Register!
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style = {styles.login_button} onPress = {(event) => this._navigateToLogin()}>
                <Text style = {styles.login_buttonText}>
                  Login!
                </Text>
              </TouchableOpacity>
              <View style={styles.login_button}>
                <FacebookLogin
                    navigator = {this.props.navigator}
                    asyncStorageLogin = {this.props.asyncStorageLogin}
                    height = {40}
                />
              </View>
              </View>
              <View style = {styles.bottom_padding} />
			       {/* <TouchableHighlight style = {styles.button} onPress = {(event) => this._navigateToFeed()}>
                <Text style = {styles.buttonText}>
                  Testing button. Go to feed page (for lurkers)
                </Text>
              </TouchableHighlight> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    flexDirection : "column",
    justifyContent: 'center',
    padding : 10,
    paddingTop: 40,
    backgroundColor: "skyblue",
    alignItems: 'center'
  },
    logo_box: {
    flex: 0.2
  },
 logo: {
    flex : 1,
    resizeMode: "contain",
    tintColor : 'white'
  },
  welcome_box: {
    flex: 1,
    justifyContent: "center",
  },

  padding_box : {
    flex: 0
  },

  button_box: {
    flex: 0.75,
    justifyContent: "flex-start",
    alignItems : 'center'
  },
  welcome_text : {
    color : "white",
    padding : 20,
    fontSize : 40

  },

  description_text : {
    color : "white",
    padding: 20,
    fontSize: 20
  },
  register_button :{
    marginTop: 10,
    padding : 4,
    borderWidth : 1,
    borderColor : "skyblue",
    backgroundColor: "white",
    borderRadius: 5,
    alignItems : "center",
    width : 170
  },
  register_buttonText : {
    justifyContent: "center",
    alignItems: "center",
    color: "skyblue",
  },
  login_button :{
    marginTop: 10,
    padding : 4,
    borderWidth : 1,
    borderColor : "skyblue",
    backgroundColor: "skyblue",
    borderRadius: 5,
    alignItems : "center",
  },
  login_buttonText : {
    justifyContent: "center",
    alignItems: "center",
    color: "white"
  },
  bottom_padding : {
    flex : 0.05
  }
});

module.exports = StartScreen
