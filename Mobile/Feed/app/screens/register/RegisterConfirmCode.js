
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {ScrollView, Alert, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class RegisterConfirmCode extends Component {
  constructor(props) {
    super(props)
    this.state = {
      validation_output: {'error' : "incorrect confirmation code"},
      enteredCode : ""
    }

    this.handleEnteredCodeChange = this.handleEnteredCodeChange.bind(this);
    this.handleEnteredCodeSubmit = this.handleEnteredCodeSubmit.bind(this);
    this._navigateToRegisterPassword = this._navigateToRegisterPassword.bind(this);
  }


  handleEnteredCodeChange(enteredCode) {
    this.setState({enteredCode : enteredCode});
  }

  handleEnteredCodeSubmit() {
    if (this.props.confirmationPin != this.state.enteredCode) {
      var result_dict = {
        'result' : 'failure',
        'error' : "incorrect confirmation code"
      }
      this.setState({validation_output : result_dict})
    }

    else {
      this._navigateToRegisterPassword();
    }
  }

  _navigateToRegisterPassword() {
    this.props.navigator.push({
    href: "RegisterPassword",
      first_name : this.props.first_name,
      last_name: this.props.last_name,
      phone_number : this.props.phone_number
    })
  }

  render() {
    return (
      <View style = {styles.container}>

              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {20} />
              </TouchableOpacity>

              <ScrollView 
                scrollEnabled={false}
              >


              <Text>
                Enter confirmation code sent to {this.props.phone_number}
              </Text>

               <TextInput
                onChangeText = {this.handleEnteredCodeChange}
                style = {styles.input} placeholder = "Enter Confirmation Code"
                keyboardType = "number-pad"
                maxLength = {5}
              />

              



              <TouchableHighlight style = {styles.button} onPress = {(event) => this.handleEnteredCodeSubmit()}>
                <Text style = {styles.buttonText}>
                  Confirm!
                </Text>
              </TouchableHighlight>


               {
                this.state.validation_output['result'] == 'failure' && 
                <Text> 
                  {this.state.validation_output['error']}
                  </Text>
              }

              <Text>
              The current confirmation pin  : {this.props.confirmationPin}
              </Text>

              </ScrollView>



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

module.exports = RegisterConfirmCode
