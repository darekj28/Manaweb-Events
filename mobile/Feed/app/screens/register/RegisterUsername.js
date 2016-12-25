
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class RegisterUsername extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email : ""
    }
  }



  _navigateToSubmit(userID) {
    this.props.navigator.push({
    href: "RegisterEmail",
    userID : userID,
    first_name: this.props.first_name,
    last_name: this.props.last_name
    })
  }

  render() {
    return (
      <View style = {styles.container}>

              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {20} />
              </TouchableOpacity>

               <TextInput
              onChangeText = {(val) => this.setState({userID : val})}
              style = {styles.input} placeholder = "userID"
              />



              <TouchableHighlight style = {styles.button} onPress = {(event) => this._navigateToRegisterEmail(this.state.userID)}>
                <Text style = {styles.buttonText}>
                  Next!
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

module.exports = RegisterUsername
