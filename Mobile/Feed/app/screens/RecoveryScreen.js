import React from 'react';
import { Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class RecoveryScreen extends React.Component {
	constructor(){
		super();
		this.state = {
			input : "",
      input_response: {},
      valid_input_submitted: "",
      email_confirmation_pin : "",
      text_confirmation_pin: "",
      confirmation_pin_input: "",
      username: ""
		};
	}
	handleInputChange(input) {
		this.setState({ input : input });
	}

  handleConfirmationInputChange(confirmation_pin_input){
    this.setState({confirmation_pin_input : confirmation_pin_input})
  }

  genrateTopBar(){
    return (
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
      )
  }

  generateInputEntry(){
    return (
          <View style = {styles.input_row}>
              <View style = {styles.input_box}> 
                <TextInput
                  onChangeText = {this.handleInputChange.bind(this)}
                  style = {styles.input_text} placeholder = "Username, email or phone number"
                  maxLength = {20} value = {this.state.input} />
              { this.state.input != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearInput.bind(this)}/>
              </View> }
              </View>
            </View>
      )
  }


  generateConfirmationPinEntry(){
    return (
      <View style = {styles.input_row}>
              <View style = {styles.input_box}> 
                <TextInput
                  onChangeText = {this.handleConfirmationInputChange.bind(this)}
                  style = {styles.input_text} placeholder = "Enter your confirmation pin"
                  maxLength = {20} value = {this.state.confirmation_pin_input} />
              { this.state.confirmation_pin_input != "" &&
              <View style = {styles.clear_button}>
                <Icon name = "close" size = {20} onPress = {this.clearPinEntry.bind(this)}/>
              </View> }
              </View>
            </View>
      )
  }

  clearInput(){
    this.setState({input: ""})
  }

  clearPinEntry(){
    this.setState({confirmation_pin_input: ""})
  }

  handleSubmit(){
    if (this.state.email_confirmation_pin == "" && this.state.text_confirmation_pin == "") {
      this.handleInputSubmit.bind(this)()
    }
    else {
      this.checkConfirmationPin.bind(this)()
    }
  }

  checkConfirmationPin() {
    if (this.state.confirmation_pin_input == this.state.email_confirmation_pin || 
      this.state.confirmation_pin_input == this.state.text_confirmation_pin)
    {
      alert("Nice man! You got it right!")
      this.loginUser.bind(this)(this.state.username)
      this._navigateToUpdatePassowrd.bind(this)()

    }
    else {
      alert("Incorrect Pin, try again")
    }
  }

  loginUser(username) {
    AsyncStorage.setItem("current_username", this.state.username).then((value) => {

      }).done()
  }

  _navigateToUpdatePassowrd() {
    this.props.navigator.push({
      href : "RecoverPassword",
      username : this.state.username
    })

  }

  handleInputSubmit(){
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileRecoverAccount", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        recovery_input : this.state.input
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({input_response : responseData})
      if (responseData.result == 'success') {
        this.setState({username : responseData.username})
        var email = responseData.email
        var phone_number = responseData.phone_number

        var hasEmail = (email != null && email != "")
        var hasPhoneNumber = (phone_number != null && email != "")

        var alert_text = ""
        // if (hasEmail && hasPhoneNumber) alert_text = "A confirmation pin will be sent to " + email + " and " + phone_number
        // else if (hasEmail) alert_text = "A confirmation pin will be sent to  " + email
        // else if (hasPhoneNumber) alert_text = "A confirmation pin will be sent to  " + phone_number

        Alert.alert(
          "Choose your confirmation method",
          "SMS fees may apply",
            [
              {text: 'Retry', style: 'cancel'},
              {text: 'Phone ' + phone_number, onPress: () => this.sendTextConfirmation.bind(this)()},
              {text: 'Email ' + email, onPress: () => this.sendEmailConfirmation.bind(this)()}
            ]) 
          }

      else {
        alert("Invalid input, try again")
         }
      // this.setState({validation_output : responseData})
    })
    .done();
  }


   sendEmailConfirmation() {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileEmailConfirmation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        email : this.state.input_response.email
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({email_confirmation_pin : responseData['confirmationPin']})
    })
    .done();
  }

  sendTextConfirmation() {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileTextConfirmation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        phone_number : this.state.input_response.phone_number
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({text_confirmation_pin : responseData['confirmationPin']})
    })
    .done();
  }

  generateInstructionText() {
    var email = this.state.input_response.email
    var phone_number = this.state.input_response.phone_number
    var hasEmail = (email != null && email != "")
    var hasPhoneNumber = (phone_number != null && email != "")
    var alert_text = ""
    if (this.state.email_confirmation_pin != "") alert_text = email
    if (this.state.text_confirmation_pin != "") alert_text = phone_number

    if (this.state.email_confirmation_pin == "" && this.state.text_confirmation_pin == "")
         var instructions = <View style = {styles.instruction_box}> 
                              <Text style = {styles.instruction_text}>
                                Enter your username, email or phone number
                              </Text>
                          </View>

    else var instructions =   <View style=  {styles.instruction_box}>                  
                <Text style = {{fontSize : 24}}> 
                  Your username is {this.state.username}. Enter the confirmation pin sent to {alert_text}
                </Text> 
            </View>
    return instructions
  }


	render() {
    var top_bar = this.genrateTopBar.bind(this)()
    var instruction_box = this.generateInstructionText.bind(this)()
    
    if (this.state.email_confirmation_pin == "" && this.state.text_confirmation_pin == "") {
      var input_entry = this.generateInputEntry.bind(this)()
      }
    else {
     var input_entry = this.generateConfirmationPinEntry.bind(this)() 
   }




		return (
        <View style = {styles.container}>
            {top_bar}
            
           
            {instruction_box}

          <View style = {styles.small_padding}/>
          {/* <View style = {styles.small_padding} /> */}
          {input_entry}

          <View style = {{flex: 0.025}}/>
            <View style = {styles.large_padding} />
             <View style = {styles.bottom_bar}>
              <TouchableOpacity style = {styles.next} onPress = {this.handleSubmit.bind(this)}>
                <Text style = {styles.next_text}>
                  Next!
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

  input_padding : {
    flex : 0.075
  }
});


