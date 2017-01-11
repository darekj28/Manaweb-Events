
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login_id : "",
      password: ""
    }
  }



  _nagigateToLogin(login_id, password) {


    // this.props.navigator.push({
    // href: "SubmitLogin",

    // })
  }

  render() {
    return (
      <View style = {styles.container}>
              
              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {20} />
              </TouchableOpacity>

               <TextInput 
              onChangeText = {(val) => this.setState({login_id : val})}
              style = {styles.input} placeholder = "UserID or Email"
              />


              <TextInput 
              onChangeText = {(val) => this.setState({password : val})}
              style = {styles.input}
              placeholder = "Password"
              secureTextEntry = {true}
              />
        
  

              <TouchableHighlight style = {styles.button} onPress = {(event) => this._navigateToRegisterEmail(this.state.login_id, this.state.password)}>
                <Text style = {styles.buttonText}>
                  Login Baby!
                </Text>
              </TouchableHighlight>
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
    color : "white",
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

module.exports = LoginScreen