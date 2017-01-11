
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login_id : "",
      password: "",
      username: "",
      validation_output: {result : "nothing yet"}
    }
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleLoginIdChange = this.handleLoginIdChange.bind(this);
    this._navigateToFeed = this._navigateToFeed.bind(this);
  }

    handleLoginSubmit() {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileLogin", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        login_id : this.state.login_id,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
        if (responseData['result'] == 'success') {
            AsyncStorage.setItem("current_username", responseData['current_user']['userID']).then((value) => {
              this.setState({username: responseData['username']})
              this.setState({validation_output: responseData})
              this._navigateToFeed()
            })
        }
        else {
          this.setState({ validation_output : responseData})
        }
        
    })
    .done();
  }



  _navigateToFeed() {
    this.props.navigator.push({
    href: "Feed"
    })
  }

  handlePasswordChange(password) {
    this.setState({password: password})
  }

  handleLoginIdChange(login_id) {
    this.setState({login_id : login_id})
  }

  render() {
    return (
      <View style = {styles.container}>
              
              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {20} />
              </TouchableOpacity>

               <TextInput 
              onChangeText = {this.handleLoginIdChange}
              style = {styles.input} placeholder = "Enter Username or Email"
              />


              <TextInput 
              onChangeText = {this.handlePasswordChange}
              style = {styles.input}
              placeholder = "Password"
              secureTextEntry = {true}
              />
        
  

              <TouchableHighlight style = {styles.button} onPress = {this.handleLoginSubmit}>
                <Text style = {styles.buttonText}>
                  Login Baby!
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