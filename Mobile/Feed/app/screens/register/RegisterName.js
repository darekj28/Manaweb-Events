/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {Image, ScrollView, Alert, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





export default class RegisterName extends Component {
  constructor(props) {
    super(props)
    this.state = {
      first_name : "",
      last_name : "",
      first_name_validation_output : {error: ""},
      last_name_validation_output : {error: ""}
    }
    this.validateFirstName = this.validateFirstName.bind(this);
    this.validateLastName = this.validateLastName.bind(this);
    this.submitFullName = this.submitFullName.bind(this);
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
    this.handleLastNameChange = this.handleLastNameChange.bind(this);
  }


  validateFirstName(first_name) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"


    fetch(url + "/mobileNameValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        name: first_name
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({first_name_validation_output : responseData})
    })
    .done();
  }

  validateLastName(last_name) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"


    fetch(url + "/mobileNameValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        name: last_name
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({last_name_validation_output : responseData})
    })
    .done();
  }


  submitFullName() {
    if (this.state.first_name_validation_output['result'] == 'success' 
      && this.state.last_name_validation_output['result'] == 'success')
      this._navigateToRegisterPhoneNumber();
  }

  _navigateToRegisterPhoneNumber() {

    this.props.navigator.push({
    href: "RegisterPhoneNumber",
    first_name : this.state.first_name,
    last_name : this.state.last_name
    })
  }

  handleFirstNameChange(first_name) {
    this.setState({first_name: first_name});
    this.validateFirstName(first_name);
  }

  handleLastNameChange(last_name) {
    this.setState({last_name: last_name}) 
    this.validateLastName(last_name);
  }

  clearFirstName() {
    this.setState({first_name : ""})
  }

  clearLastName() {
    this.setState({last_name : ""})
  }

  getErrorMessage() {
    var error_message = "";
    var first_name_error = this.state.first_name_validation_output.error != "" && this.state.first_name_validation_output.error != null
    var last_name_error = this.state.last_name_validation_output.error != "" && this.state.last_name_validation_output.error != null  
    if (first_name_error && !last_name_error) {
      error_message = this.state.first_name_validation_output.error
    } 

    if (last_name_error) {
      error_message = this.state.last_name_validation_output.error
    } 
    
    if (this.state.first_name == "" && this.state.last_name == "") {
      error_message = ""
      // error_message = "Names must not be blank!"
    }
    if (!(error_message == "" || error_message == null)) {
      return (
              <Text style = {styles.error_text}>
                    {error_message}
              </Text>
        )
    }
    else return null; 
  }

  render() {
    var error_message = this.getErrorMessage.bind(this)();
    return (
        <View style = {styles.container}>
          <View style = {styles.top_bar}>
              <TouchableOpacity style = {styles.back_button}
                onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {20}/>
              </TouchableOpacity>
              <Image
                style={styles.logo}
                source={require('../../static/favicon-32x32.png')}
              />
              <View style = {styles.cog_box}>
                <Icon name = "cog" size = {20} style = {styles.cog}/> 
              </View>
          </View>

          <View style = {styles.small_padding}/>

            <View style = {styles.instruction_box}> 
              <Text style = {styles.instruction_text}>
                What is your name?
              </Text>
            </View>

            <View style = {styles.input_row}>
              <View style = {styles.input_box}> 
                <TextInput
                    onChangeText = {this.handleFirstNameChange}
                    style = {styles.input_text} placeholder = "First Name"
                    maxLength = {13}
                    value = {this.state.first_name}
                  />

                { this.state.first_name != "" &&
                <View style = {styles.clear_button}>
                  <Icon name = "close" size = {20} onPress = {this.clearFirstName.bind(this)}/>
                </View>
                }
                
              </View>

              <View style = {styles.col_padding}/>

              <View style = {styles.input_box}> 
                
                <TextInput
                  onChangeText = {this.handleLastNameChange}
                  style = {styles.input_text} placeholder = "Last Name"
                  maxLength = {20}
                  value = {this.state.last_name}
                  />
                { this.state.last_name != "" &&
                <View style = {styles.clear_button}>
                  <Icon name = "close" size = {20} onPress = {this.clearLastName.bind(this)}/>
                </View>
                }
              </View>
            </View>
            <View style = {styles.small_padding}/>
           { error_message != null &&
              <View style = {styles.error_box}>
                {error_message}
            </View>
          }

          {error_message == null &&
            <View style = {styles.small_padding}/>
          }
            <View style = {styles.large_padding} />

            <View style = {styles.bottom_bar}>
              <TouchableHighlight style = {styles.next} onPress = {this._navigateToRegisterPhoneNumber.bind(this)}>
                <Text style = {styles.next_text}>
                  Next!
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

  clear_button : {
    flex: 0.1,
    justifyContent: "center"
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

  large_padding : {
    flex: 0.45,
    backgroundColor : "white"
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

  small_padding : {
    flex : 0.05,
  },

  col_padding: {
    flex: 0.0015
  }

});

module.exports = RegisterName
