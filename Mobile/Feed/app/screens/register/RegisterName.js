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





export default class RegisterName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      first_name : "",
      last_name : ""
    }
  }


  _navigateToRegisterId(first_name, last_name) {
    this.props.navigator.push({
    href: "RegisterId",
    first_name : first_name,
    last_name : last_name
    })
  }

  render() {
    return (
      <View style = {styles.container}>
              
              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {30} />
              </TouchableOpacity>

              <Text style = {styles.welcome}> 
                Welcome! Please start with your name
              </Text>

               <TextInput 
              
              onChangeText = {(val) => this.setState({first_name : val})}
              style = {styles.input} placeholder = "first_name"
              />
        
               <TextInput 
              onChangeText = {(val) => this.setState({last_name : val})}
              style = {styles.input} placeholder = "last_name"
              />

              <TouchableHighlight style = {styles.button} onPress = {(event) => this._navigateToRegisterId(this.state.first_name, this.state.last_name)}>
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
    color : "black",
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
    justifyContent : "center",
    backgroundColor: "black"
  },
  buttonText : {
    justifyContent: "center",
    alignItems: "center",
    color : 'white'
  },

  welcome : {
    backgroundColor :'skyblue',
    justifyContent: 'center',
    marginRight : 35,
    marginLeft: 20
  }

});

module.exports = RegisterName