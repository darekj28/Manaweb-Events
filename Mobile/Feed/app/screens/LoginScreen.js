
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {KeyboardAvoidingView, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class LoginScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      login_id : "",
      password: "",
      username: "",
      validation_output: {result : "nothing yet"},
      show_password: false,
      behavior: ''
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
          alert("Invalid Credentials")
          this.setState({ validation_output : responseData})
        }
        
    })
    .done();
  }

  togglePassword() {
    var newToggle = !this.state.show_password;
    this.setState({show_password : newToggle})
  }


  _navigateToFeed() {
    this.props.navigator.push({
    href: "Menu"
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
              
            <View style = {styles.top_bar}>
              <TouchableOpacity style = {styles.back_button}
                onPress = {() => this.props.navigator.pop()}>
                <Text style = {styles.back_button_text}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <Text style = {styles.logo}> 
                Logo
              </Text> 

              <View style = {styles.cog_box}>
                <Icon name = "cog" size = {20} style = {styles.cog}/> 
              </View>
            </View>

            <View style = {styles.login_instruction_box}> 
              <Text style = {styles.login_instruction_text}>
                Login to Manaweb here!
              </Text>
            </View>

            <View style = {styles.input_box}> 
              <TextInput 
              onChangeText = {this.handleLoginIdChange}
              style = {styles.input_text} placeholder = "Enter Username or Email"
              />

              { this.state.login_id != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20}/>
              </View>
              }
              
            </View>

            <View style = {styles.input_box}> 
              <TextInput 
              onChangeText = {this.handlePasswordChange}
              style = {styles.input_text}
              placeholder = "Password"
              secureTextEntry = {!this.state.show_password}
              />
              
              { this.state.password != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20}/>
              </View>
              }

            </View>

            <View style = {styles.show_password_box}>
              <Text style = {styles.show_password_text} onPress = {this.togglePassword.bind(this)}>
                Show password
              </Text>
            </View>

            <View style = {styles.padding} />

            <View style = {styles.bottom_bar}>
              <Text style = {styles.recovery_text}>
                Forgot your password?
              </Text>

              <TouchableHighlight style = {styles.login_submit} onPress = {this.handleLoginSubmit}>
                <Text style = {styles.login_submit_text}>
                  Login!
                </Text>
              </TouchableHighlight>

            </View>

            {/*

              

               
        
  

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
            */}
      </View>
    )
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection : "column",
    justifyContent: 'space-between',
    padding : 10,
    paddingTop: 40,
    backgroundColor: "white",
    alignItems: 'flex-start'
  },


  top_bar : {
    flex : 0.1,
    flexDirection : "row",
    justifyContent: "space-around",
  },

  back_button :{
    flex : 1,
  },

  back_button_text: {

  },

  logo: {
    flex : 1,
    textAlign: "center"
  },

  cog_box: {
    flex:1,
    flexDirection : "row",
    justifyContent : "flex-end"
  },
  // cog : {
  // },

  login_instruction_box :{
    flex : 0.075,
  },

  login_instruction_text : {
    fontSize : 16
  },

  input_box: {
    flexDirection : "row",
    flex: 0.075,
    borderColor: "skyblue",
    borderWidth : 1,
    borderRadius : 5
    // backgroundColor: "skyblue"
  },

  input_text :{
    flex: 0.65,
  },

  clear_button : {
    flex: 0.05,
    justifyContent: "center"
  },

  show_password_box : {
    flex : 0.05,
    // backgroundColor : "orange",
    justifyContent: "flex-end"
  },

  show_password_text : {

  },

  padding : {
    flex: 0.60,
    backgroundColor : "white"
  },

  bottom_bar : {
    flex : 0.05,
    // backgroundColor : "purple",
    flexDirection: "row",
    justifyContent : "space-between"
  },

  recovery_text: {
    flex: 0.75
  },

  login_submit : {
    flex: 0.25,

  },

  login_submit_text : {
    borderColor : "skyblue",
    borderWidth : 1,
    borderRadius : 5,
    textAlign : "center"
  },
});

module.exports = LoginScreen