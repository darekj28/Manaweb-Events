
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

import React from 'react';
import {Component} from 'react'
import {Image, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';





class FbCreate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username : "",
      validation_output: {'error' : ""},
      first_name : "",
      last_name : "",
      email : "",
      fb_id : ""
    }

    this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.validateUsername = this.validateUsername.bind(this);
  }

  facebookCreateAccount() {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileFacebookCreateAccount", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        email : this.state.email,
        username: this.state.username,
        first_name: this.state.first_name ,
        last_name: this.state.last_name,
        fb_id: this.props.fb_id
        // password: this.props.password,
        // phone_number : this.props.phone_number
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
        if (responseData['result'] == 'success') {
            console.log(responseData.current_user)
            this.props.asyncStorageLogin(responseData.current_user.userID).then(() => {
              AsyncStorage.setItem("fb_token", this.props.fb_token).done()
            }).done()
            this._navigateToWelcome.bind(this)()
        }
    })
    .done();
  }

  handleUsernameSubmit() {
    if (this.state.validation_output['result'] == 'success') {
      this.facebookCreateAccount.bind(this)()
    }
    else {
      Alert.alert(this.state.validation_output['error'])
    }
  }
  handleUsernameChange(username) {
    this.setState({username : username})
    this.validateUsername(username);
  }
  validateUsername(username) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileUsernameValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        username : username
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({validation_output : responseData})
    })
    .done();
  }
  _navigateToWelcome() {
    this.props.navigator.push({
    href: "Welcome"
    })
  }
  pullFacebookInfo(){
    const infoRequest = new GraphRequest(
          '/me',
          {
            parameters: {
              fields: {
                string: 'email,name,first_name,last_name' // what you want to get
              },
              access_token: {
                string: this.props.fb_token.toString() // put your accessToken here
              }
            }
          },
          this.handleFacebookPull.bind(this) // make sure you define _responseInfoCallback in same class
        );
    new GraphRequestManager().addRequest(infoRequest).start();
  }
  handleFacebookPull(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      // alert('Success fetching data: ' + result);
      this.setState({email : result.email})
      this.setState({first_name : result.first_name})
      this.setState({last_name : result.last_name})
    } 
  }
  clearUsername(){
    this.setState({username: ""})
  }
  componentDidMount() {
      this.pullFacebookInfo.bind(this)()
  }

  getErrorMessage() {
    var error_message = "";
    if (this.state.validation_output.error != "" && this.state.validation_output.error != null) {
      error_message = this.state.validation_output.error;
      return (
          <Text style = {styles.error_text}>
            {error_message}
          </Text>
        )
    }
    else return;
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
                Welcome {this.state.first_name} !
              </Text>
            </View>
            <View style = {styles.input_row}>
              <View style = {styles.input_box}> 
                <TextInput
                onChangeText = {this.handleUsernameChange.bind(this)}
                style = {styles.input_text} placeholder = "Select a username"
                value = {this.state.username}
                maxLength = {15}
              />
              { this.state.username != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearUsername.bind(this)}/>
              </View>}
              </View>
            </View>
          <View style = {styles.small_padding}/>
          { // error_message != null &&
            false &&
              <View style = {styles.error_box}>
                {error_message}
            </View>
          }
          {error_message == null &&
            <View style = {styles.small_padding}/>
          }
            <View style = {styles.large_padding} />
             <View style = {styles.bottom_bar}>
                <TouchableOpacity style = {styles.next} onPress = {this.handleUsernameSubmit.bind(this)}>
                <Text style = {styles.next_text}>
                  Submit!
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
    flex: 0.45,
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

module.exports = FbCreate
