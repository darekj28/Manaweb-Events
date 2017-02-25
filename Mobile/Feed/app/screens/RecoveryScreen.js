import React from 'react';
import { Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView, BackAndroid} from 'react-native';
import _ from 'lodash'
import {Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RegisterHeader from '../components/register/RegisterHeader';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import SegmentedControls from 'react-native-radio-buttons'

const RADIO_BUTTON_COLOR = '#50a7cd'
const OPTION_EMAIL = 'email'
const OPTION_PHONE = 'phone'
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
      		username: "",
			input_placeholder: "Username, email or phone number",
			description: "Enter your username, email, or phone number",
			button_text: "Next",
			confirmation_method: false, // if true, display the radio button
			confirmation_input: false, // if true, display the text input
			selectedOption: ""
		};
		this.goBack = this.goBack.bind(this)
		BackAndroid.addEventListener('hardwareBackPress', () => this.goBack());
	}

	goBack() {
		if (this.state.confirmation_method) {
			this.setState({
				input : "",
	      		input_response: {},
	      		valid_input_submitted: "",
	      		email_confirmation_pin : "",
	      		text_confirmation_pin: "",
	      		confirmation_pin_input: "",
	      		username: "",
				input_placeholder: "Username, email or phone number",
				description: "Enter your username, email, or phone number",
				button_text: "Next",
				confirmation_method: false, // if true, display the radio button
				confirmation_input: false, // if true, display the text input
				selectedOption: ""
			});
		} else {
			this.props.navigator.pop()
		}
		return true; // There is somewhere else to go to?
	}

	handleInputChange(input) {
		this.setState({ input : input });
	}

  	handleConfirmationInputChange(confirmation_pin_input){
    	this.setState({confirmation_pin_input : confirmation_pin_input})
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

	handleSend() {
		this.setState({confirmation_input: true})
		if (this.state.selectedOption == OPTION_EMAIL) {
			this.sendEmailConfirmation.bind(this)()
			alert('An email has been sent')
		} else if (this.state.selectedOption == OPTION_PHONE) {
			this.sendTextConfirmation.bind(this)()
			alert('A text has been sent')
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
			this.setState({input_placeholder: "Confirmation pin"})
			this.setState({description: "Select the confirmation method"})
			this.setState({confirmation_method: true})
			this.clearInput()
        	// var email = responseData.email
        	// var phone_number = responseData.phone_number
			//
        	// var hasEmail = (email != null && email != "")
        	// var hasPhoneNumber = (phone_number != null && phone_number.length > 13)
			//
        	// var alert_text = ""
	        // if (hasEmail && hasPhoneNumber) alert_text = "A confirmation pin will be sent to " + email + " and " + phone_number
	        // else if (hasEmail) alert_text = "A confirmation pin will be sent to  " + email
	        // else if (hasPhoneNumber) alert_text = "A confirmation pin will be sent to  " + phone_number
	        // if (hasEmail && hasPhoneNumber) {
			// 	Alert.alert(
	        //       "Choose your confirmation method",
	        //       "SMS fees may apply",
	        //         [
	        //           {text: "This is not me!", style: 'cancel'},
	        //           {text: 'Send a text to ' + phone_number, onPress: () => this.sendTextConfirmation.bind(this)()},
	        //           {text: 'Send an email to ' + email, onPress: () => this.sendEmailConfirmation.bind(this)()}
	        //         ])
			// } else if (hasEmail) {
			// 	Alert.alert(
	        //       "Choose your confirmation method",
	        //       "SMS fees may apply",
	        //         [
	        //           {text: "This is not me!", style: 'cancel'},
	        //           {text: 'Send an email to ' + email, onPress: () => this.sendEmailConfirmation.bind(this)()}
	        //         ])
			// } else if (hasPhoneNumber) {
			// 	Alert.alert(
	        //       "Choose your confirmation method",
	        //       "SMS fees may apply",
	        //         [
	        //           {text: "This is not me!", style: 'cancel'},
	        //           {text: 'Send a text to ' + phone_number, onPress: () => this.sendTextConfirmation.bind(this)()}
	        //         ])
			// }
		} else {
	        alert("No matching user for this input")
		}
	      // this.setState({validation_output : responseData})
	}).done();
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

  	customRadioButton(isSelected, text, hasRightBar) {
		if (isSelected) {
			return (
				<View style = {{justifyContent: 'center', flex: 1, backgroundColor: RADIO_BUTTON_COLOR}}>
					<Text style = {{padding: 5, color: 'white', textAlignVertical: 'center'}}>
						{text}
					</Text>
				</View>
			)
		} else {
			var barColor = hasRightBar ? RADIO_BUTTON_COLOR : 'transparent'
			return (
				<View style = {{justifyContent: 'center', flex: 1, borderRightWidth: 2, borderColor: barColor}}>
					<Text style = {{padding: 5, backgroundColor: 'transparent', color: RADIO_BUTTON_COLOR, textAlignVertical: 'center'}}>
						{text}
					</Text>
				</View>
			)
		}
	}

 	render() {
		var {height, width} = Dimensions.get('window');
		var hasPhone = this.state.confirmation_method && this.state.input_response.phone_number.length > 13
		var hasEmail = this.state.confirmation_method && this.state.input_response.email != ""
		return (
			<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
				<View style={[styles.container, {height: height}]}>
					<RegisterHeader navigator={this.props.navigator}/>
					<View style={{flex : 1, flexDirection : 'column'}}>
						<View style={{flex : 2}}>
							<View style={{flex : 1.0, alignItems : 'center', justifyContent : 'center'}}>
								<Text style={{fontSize : 18}}>{this.state.description}</Text>
								{this.state.confirmation_method &&
									<View style={{flex: 1, alignItems : 'center', borderColor: RADIO_BUTTON_COLOR, borderWidth: 2, borderRadius: 5, flexDirection: 'row'}}>
										{hasEmail &&
											<TouchableOpacity style = {{justifyContent : 'center'}}
												onPress = {() => this.setState({selectedOption: OPTION_EMAIL})}>
												{
													// draw right bar if there is phone}
													this.customRadioButton.bind(this)(
													this.state.selectedOption == OPTION_EMAIL,
													this.state.input_response.email, hasPhone)}
											</TouchableOpacity>
										}
										{hasPhone &&
											<TouchableOpacity onPress = {() => this.setState({selectedOption: OPTION_PHONE})}>
												{this.customRadioButton.bind(this)(
													this.state.selectedOption == OPTION_PHONE,
													this.state.input_response.phone_number, false)}
											</TouchableOpacity>
										}
									</View>
								}
								{this.state.confirmation_method && hasPhone &&
									<Text style={{fontSize : 12}}>SMS fee may apply</Text>
								}
							</View>

							<View style = {{flex: 0.5, alignItems: 'center'}}>
							{this.state.selectedOption != "" &&
								<TouchableOpacity style={{flex : 1}} onPress = {
									this.handleSend.bind(this)}>
									<View style = {styles.button}>
										<Text style={styles.button_text}>Send</Text>
									</View>
								</TouchableOpacity>
							}
							</View>
							<View style={{flex : 1, justifyContent : 'center'}}>
							{(!this.state.confirmation_method
								|| (this.state.confirmation_method && this.state.confirmation_input)) &&

									<View style={styles.input_wrapper}>
										<TextInput
	                  						onChangeText = {this.handleInputChange.bind(this)}
	                  						style = {styles.input_text}
											placeholder = {this.state.input_placeholder}
	                  						maxLength = {40}
											value = {this.state.input} />
									</View>
							}
							</View>
							<View style={{flex : 0.05}}/>
						</View>
						{!this.state.confirmation_method &&
							<View style = {{flex : 1, alignItems : 'center'}}>
								<TouchableOpacity style={{flex : 1}} onPress = {this.handleSubmit.bind(this)}>
									<View style = {styles.button}>
										<Text style={styles.button_text}>{this.state.button_text}</Text>
									</View>
								</TouchableOpacity>
								<View style={{flex : 0.5}}/>
								<View style={{flex : 0.5}}/>
							</View>
						}
						<View style = {{flex : 3}}/>
					</View>
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

const styles = StyleSheet.create({
	container: {
 	   flex: 1,
 	   justifyContent: 'flex-start',
 	   alignItems : 'center',
 	   backgroundColor: "white",
    },
    label : {flex : 0, fontSize : 12, fontWeight : 'bold', color : '#696969'},
    input_wrapper : {flex : 1, borderBottomColor : 'silver', borderBottomWidth : 1},
    input_text : {flex : 1, width : 300, fontSize : 14, textAlignVertical: 'bottom', paddingBottom: 0},
    button : {
 	   flex : 1,
 	   backgroundColor : '#90d7ed',
 	   borderRadius:60,
 	   justifyContent : 'center',
 	   alignItems : 'center',
 	   width : 100,
 	   height : 35
    },
    button_text : {color : 'white', fontWeight : 'bold', fontSize : 14},
});
