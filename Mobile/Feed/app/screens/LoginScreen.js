
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {Image, TouchableWithoutFeedback, KeyboardAvoidingView, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
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

  _navigateToRecovery(){
    this.props.navigator.push({
    href: "Recovery"
    })
  }

  render() {
    return (

      <View style = {styles.container}>
          <View style = {styles.top_bar}>
              <TouchableOpacity style = {styles.back_button}
                onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {20}/>
              </TouchableOpacity>
               <Image
                style={styles.logo}
                source={require('../static/favicon-32x32.png')}
              />
              <View style = {styles.cog_box}>
                <Icon name = "cog" size = {20} style = {styles.cog}/> 
              </View>
            </View>
            <View style = {styles.small_padding}/>
            <View style = {styles.instruction_box}> 
              <Text style = {styles.instruction_text}>  
                  Login to Manaweb!
              </Text>
            </View>

          {/* <View style = {styles.small_padding} /> */}


            <View style = {styles.input_row}>
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
            </View>

            <View style = {{flex: 0.025}}/>

          <View style = {styles.input_row}>
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
          </View>



            <View style = {styles.large_padding} />
             <View style = {styles.bottom_bar}>
             <TouchableOpacity style = {styles.recovery_button} onPress = {this._navigateToRecovery.bind(this)}>
                <Text style = {styles.recovery_text}>
                    Forgot your password?
                </Text>
                </TouchableOpacity>
              <View style = {styles.bottom_bar_padding}/>
              <TouchableOpacity style = {styles.login_submit_button} onPress = {this.handleLoginSubmit}>
                <Text style = {styles.login_submit_text}>
                  Login!
                </Text>
              </TouchableOpacity>
             </View>
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
  },


  top_bar : {
    flex : 0.05,
    flexDirection : "row",
    justifyContent: "space-around",
    // backgroundColor: "coral",
    alignItems: "center"
  },

  back_button :{
    flex : 1,
  },

  back_button_text: {

  },

  logo: {
    flex : 1,
    resizeMode: "contain"
  },

  cog_box: {
    flex:1,
    flexDirection : "row",
    justifyContent : "flex-end"
  },
  // cog : {
  // },

  instruction_box :{
    flex : 0.075,
  },

  instruction_text : {
    fontSize : 24
  },

  input_row: {
    flexDirection: "row",
    flex : 0.075,
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
    padding: 5
  },

  clear_button : {
    flex: 0.05,
    justifyContent: "center"
  },

  large_padding : {
    flex: 0.325,
    backgroundColor : "white"
  },

  error_box : {
    flex: 0.05,
    flexDirection : "column",
  },

  error_text : {
    color : "red",
    fontSize : 20,
    alignSelf: "center"
  },

 
  bottom_bar : {
    flex : 0.05,
    // backgroundColor : "purple",
    flexDirection: "row",
    justifyContent : "flex-end",
  },

  recovery_text: {
    borderColor : "skyblue",
    borderWidth : 1,
    borderRadius : 5,
    padding: 8,
    textAlign : "center"
  },
 
  login_submit_text : {
    borderColor : "skyblue",
    borderWidth : 1,
    borderRadius : 5,
    padding: 8,
    textAlign : "center"
  },

  recovery_button : {
      flex: 0.65
  },

  bottom_bar_padding: {
      flex: 0.10
  },

  login_submit_button: {
      flex: 0.25
  },

  small_padding : {
    flex : 0.05,
  },

});

module.exports = LoginScreen