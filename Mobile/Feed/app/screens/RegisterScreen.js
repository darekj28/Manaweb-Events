/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../components/ViewContainer';
import HomeStatusBar from '../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





export default class RegisterScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userID: "",
      first_name : "",
      last_name : "",
      email : "",
      password : "",
      password_confirm: ""
    }
  }

  onRegisterPressed (){
    console.log(this.state);
  }


  render() {
    return (
      <View style = {styles.container}>

            <TextInput 
              onChangeText = {(val) => this.setState({userID : val})}
              style = {styles.input} placeholder = "userID"
              />
              

               <TextInput 
              onChangeText = {(val) => this.setState({first_name : val})}
              style = {styles.input} placeholder = "first_name"
              />
        
               <TextInput 
              onChangeText = {(val) => this.setState({last_name : val})}
              style = {styles.input} placeholder = "last_name"
              />
        
              
               <TextInput 
              onChangeText = {(val) => this.setState({email : val})}
              style = {styles.input} placeholder = "email"

              />
              
              
               <TextInput 
              onChangeText = {(val) => this.setState({password : val})}
              style = {styles.input} placeholder = "password"
              secureTextEntry = {true}
              />
              
               <TextInput 
              onChangeText = {(val) => this.setState({password_confirm : val})}
              style = {styles.input} placeholder = "password_confirm"
              secureTextEntry = {true}
              />
              

              <TouchableHighlight style = {styles.button} onPress = {this.onRegisterPressed.bind(this)}>
                <Text style = {styles.buttonText}>
                  Sign up!
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
    color : "coral",
    height: 35,
    marginTop: 10,
    padding : 4,
    borderWidth : 1,
    borderColor : "#48bbec",
    marginLeft : 20,
    marginRight : 35
  },
  buttonText : {
    justifyContent: "center",
    alignItems: "center"
  }

});

// module.exports = RegisterScreen
