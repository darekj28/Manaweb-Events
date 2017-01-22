
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {Alert, Image, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class RegisterPassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      password : "",
      password_confirm: "",
      validation_output : {}
    }

  }


  validatePassword(password, password_confirm) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobilePasswordValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        password: password,
        password_confirm: password_confirm
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({validation_output : responseData})
    })
    .done();
  }

  handlePasswordSubmit() { 
    if (this.state.validation_output.result == 'success') {
        this.updatePassword.bind(this)()
    }
    else {
      alert(this.state.validation_output.error)
    }
  }

  updatePassword() {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileUpdatePassword", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        username: this.props.current_username,
        password: this.state.password
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      // this.togglePasswordModal.bind(this)();
      Alert.alert(
        "Password Succesfully Updated!",
        "Returning To the Feed Now",
        [
          {text: 'OK', onPress: () => this._navigateToMenu.bind(this)()}
        ])
    }).done();
  }

  handlePasswordChange(password) {
    this.setState({password : password})
    this.validatePassword.bind(this)(password, this.state.password_confirm)
  }

  handlePasswordConfirmChange(password_confirm) {
    this.setState({password_confirm : password_confirm})
    this.validatePassword.bind(this)(this.state.password, password_confirm)
  }

  clearPassword() {
    this.setState({password : ""})
  }

  clearPasswordConfirm() {
    this.setState({password_confirm : ""})
  }

// add validators
  _navigateToMenu() {
    this.props.navigator.push({
    href: "Menu",
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
                Choose a password
              </Text>
            </View>

          {/* <View style = {styles.small_padding} /> */}


            <View style = {styles.input_row}>
              <View style = {styles.input_box}> 
                <TextInput
                  onChangeText = {this.handlePasswordChange.bind(this)}
                  style = {styles.input_text} placeholder = "Password"
                  maxLength = {20}
                  value = {this.state.password}
                  secureTextEntry = {true}
                />

              { this.state.password != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearPassword.bind(this)}/>
              </View> }
              </View>
            </View>

            <View style = {{flex: 0.025}}/>

          <View style = {styles.input_row}>
            <View style = {styles.input_box}> 
              
              <TextInput
                onChangeText = {this.handlePasswordConfirmChange.bind(this)}
                style = {styles.input_text} placeholder = "Confirm Password"
                maxLength = {20}
                value = {this.state.password_confirm}
                secureTextEntry = {true}
                />
              
              { this.state.password_confirm != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearPasswordConfirm.bind(this)}/>
              </View> }

            </View>
          </View>



            <View style = {styles.large_padding} />
             <View style = {styles.bottom_bar}>
              <TouchableHighlight style = {styles.next} onPress = {this.handlePasswordSubmit.bind(this)}>
                <Text style = {styles.next_text}>
                  Update Password!
                </Text>
              </TouchableHighlight>
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
    flex: 0.75
  },
 
  next_text : {
    borderColor : "skyblue",
    borderWidth : 1,
    borderRadius : 5,
    padding: 8,
    textAlign : "center"
  },

  small_padding : {
    flex : 0.05,
  },


});

module.exports = RegisterPassword
