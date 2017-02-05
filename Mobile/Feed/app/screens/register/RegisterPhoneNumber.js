
import React from 'react';
import {Component} from 'react'
import {TouchableWithoutFeedback, Image, ScrollView, Alert, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import RegisterHeader from '../../components/register/RegisterHeader';
export default class RegisterPhoneNumber extends Component {
	constructor(props) {
		super(props)
		this.state = {
			phone_number : "",
			raw_phone_number: "",
			validation_output: {'error' : ""},
			confirmationPin : "not set yet",
			length : 0
		}
		this.validatePhoneNumber = this.validatePhoneNumber.bind(this);
		this._navigateToConfirmCode = this._navigateToConfirmCode.bind(this);
		this.handlePhoneNumberChange = this.handlePhoneNumberChange.bind(this);
		this.handlePhoneNumberSubmit = this.handlePhoneNumberSubmit.bind(this);
		this.sendConfirmationPin = this.sendConfirmationPin.bind(this);
	}
	validatePhoneNumber(phone_number) {
		var url = "https://manaweb-events.herokuapp.com"
		var test_url = "http://0.0.0.0:5000"
		fetch(url + "/mobilePhoneNumberValidation", {method: "POST",
		headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}, 
			body: 
			JSON.stringify(
			 {
				phone_number : phone_number
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			this.setState({validation_output : responseData})
		})
		.done();
	}
	// handle the submission of the phone number
	handlePhoneNumberSubmit(){  
		if (this.state.validation_output['result'] == 'success'){
		Alert.alert(
			"We'll send a verification code to " + this.state.phone_number + ".",
			"SMS fees may apply",
			[
				{text: 'Cancel', style: 'cancel'},
				{text: 'OK', onPress: () => this.sendConfirmationPin()}
			]) 
		}
	}

	sendConfirmationPin(){
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
				phone_number : this.state.phone_number
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			if (responseData.error){
				Alert.alert("Invalid Phone Number")
			}
			else {
				this.setState({confirmationPin : responseData['confirmationPin']})
				this._navigateToConfirmCode();  
			}
			
		})
		.done();
	}

	handlePhoneNumberChange(phone_number) {
		 var raw_phone_number = ""
			for (var i = 0; i < phone_number.length; i++) {
				var c = phone_number[i]
				if (!isNaN(c) && c != " "){
						raw_phone_number = raw_phone_number + c;
					}
			}
			this.setState({raw_phone_number : raw_phone_number})
			var length = raw_phone_number.length
			this.setState({length : length})
			var new_phone_number = "";
			if (length > 0 && length <= 3) {
				new_phone_number = "(" + raw_phone_number;
			}
			if (length == 4) {
				new_phone_number = "(" + raw_phone_number.substring(0,3) + ") " + raw_phone_number.substring(3,4)
			}
			if (length > 4 && length <= 6) {
				new_phone_number = "(" + raw_phone_number.substring(0,3) + ") " + raw_phone_number.substring(3, length)
			}
			if (length > 6) {
				new_phone_number = "(" + raw_phone_number.substring(0,3) + ") " + raw_phone_number.substring(3, 6) + "-" + raw_phone_number.substring(6, length)
			}
			this.setState({phone_number : new_phone_number});  
			this.validatePhoneNumber(phone_number);
	}

	clearPhoneNumber() {
		this.setState({phone_number: ""})
	}

	_navigateToConfirmCode() {
		this.props.navigator.push({
		href: "RegisterConfirmCode",
			first_name : this.props.first_name,
			last_name: this.props.last_name,
			phone_number : this.state.phone_number,
			confirmationPin : this.state.confirmationPin
		})
	}

	_navigateToAlternateRegister() {
		this.props.navigator.push({
			href: "AlternateRegisterEmail", 
			first_name : this.props.first_name,
			last_name : this.props.last_name,
		})
	}

	getErrorMessage() {
		var error_message = "";
		if (this.state.validation_output.error != "" && this.state.validation_output.error != null) {
			error_message = this.state.validation_output.error;
		}
		if (error_message != "" && error_message != null) {
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
			<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
				<View style={styles.container}>
					<RegisterHeader navigator={this.props.navigator}/>
					<View style={{flex : 1, flexDirection : 'column'}}>
						<View style={{flex : 2}}>
							<View style={{flex : 1.5, alignItems : 'center', justifyContent : 'center'}}>
								<Text style={{fontSize : 18}}>What's your number?</Text>
							</View>
							<View style={{flex : 0.6}}/>
							<View style={{flex : 1, justifyContent : 'center'}}>
								<Text style={styles.label}>PHONE NUMBER</Text>
								<View style={styles.input_wrapper}>
									<TextInput onChangeText = {this.handlePhoneNumberChange}
										style = {styles.input} 
										keyboardType = "phone-pad"
						                dataDetectorTypes = "phoneNumber"
						                maxLength = {14}
						                value = {this.state.phone_number}/>
								</View>
							</View>
							<View style={{flex: 0.6}}>
								<View style={{flex : 1, alignItems:'center', justifyContent : 'center'}}>
									{error_message}
								</View>
							</View>
						</View>
						<View style = {{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
							<TouchableOpacity style={{flex : 1}} onPress = {this.handlePhoneNumberSubmit.bind(this)}>
								<View style = {styles.button}>
									<Text style={styles.button_text}>Next</Text>
								</View>
							</TouchableOpacity>
							<View style={{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
								<TouchableOpacity style={{flex : 1, alignItems : 'center', justifyContent : 'center'}} onPress = {this._navigateToAlternateRegister.bind(this)}>
									<Text style={styles.notnow}>Prefer email instead?</Text>
								</TouchableOpacity>
							</View>
						</View>	
						<View style = {{flex : 2.5}}/>							
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
	input : {flex : 1, width : 180, fontSize : 20, justifyContent : 'flex-start'},
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
	error_text : {color : 'red', fontWeight : 'bold', fontSize : 12},
	notnow : {fontSize : 14, color : 'lightseagreen'},
});
