
import React from 'react';
import {Component} from 'react'
import {TouchableWithoutFeedback, Image, ScrollView, Alert, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import RegisterHeader from '../../components/register/RegisterHeader';



export default class RegisterConfirmCode extends Component {
	constructor(props) {
		super(props)
		this.state = {
			validation_output: {'error' : ""},
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
		this._navigateToRegisterPassword();
		if (this.props.confirmationPin != this.state.enteredCode) {
			var result_dict = {
				'result' : 'failure',
				'error' : "incorrect confirmation code"
			}
			this.setState({validation_output : result_dict})
			Alert.alert("Incorrect Confirmation Code")
			// potentially add option to resend by clicking part of the alert
		}

		else {
			this._navigateToRegisterPassword();
		}
	}


	resendConfirmationPin(){
		var url = "https://manaweb-events.herokuapp.com"
		var test_url = "http://0.0.0.0:5000"
		fetch(url + "/mobileResendTextConfirmation", {method: "POST",
		headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}, 
			body: 
			JSON.stringify(
			 {
				phone_number : this.props.phone_number,
				confirmationPin : this.props.confirmationPin
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			if (responseData.error){
				Alert.alert("Invalid Phone Number")
			}
			else {
				Alert.alert("Code sent.");
				this.setState({confirmationPin : responseData['confirmationPin']})
			}
		})
		.done();
	}

	clearConfirmationCode() {
		this.setState({enteredCode: ""})
	}

	_navigateToRegisterPassword() {
		this.props.navigator.push({
		href: "RegisterPassword",
			first_name : this.props.first_name,
			last_name: this.props.last_name,
			phone_number : this.props.phone_number
		})
	}

	getErrorMessage() {
		var error_message = "";
		if (this.state.validation_output.error != "") {
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

		var error_message = this.getErrorMessage.bind(this)()
		return (
			<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
				<View style={styles.container}>
					<RegisterHeader navigator={this.props.navigator}/>
					<View style={{flex : 1, flexDirection : 'column', borderColor : 'red', borderWidth : 1}}>
						<View style={{flex : 2, borderColor : 'yellow', borderWidth : 1}}>
							<View style={{flex : 1.5, alignItems : 'center', justifyContent : 'center'}}>
								<Text style={{fontSize : 18}}>Enter the code</Text>
							</View>
							<View style={{flex : 0.6}}/>
							<View style={{flex : 1.6, borderColor : 'green', borderWidth : 1, justifyContent : 'center'}}>
								<Text style={styles.label}>CONFIRMATION CODE</Text>
								<View style={styles.input_wrapper}>
									<TextInput onChangeText = {this.handleEnteredCodeChange}
										style = {styles.input} 
										keyboardType = "number-pad"
						                maxLength = {5}
                						value = {this.state.enteredCode}/>
								</View>
							</View>
						</View>
						<View style = {{flex : 1, alignItems : 'center', borderColor : 'blue', borderWidth : 1}}>
							<TouchableOpacity style = {{flex : 1, justifyContent : 'center'}} 
										onPress = {this.resendConfirmationPin.bind(this)}>
				              	<Text style = {styles.resend}>
				                	Resend Code
				             	</Text>
				            </TouchableOpacity>
							<TouchableOpacity style={{flex : 1}} onPress = {this.handleEnteredCodeSubmit.bind(this)}>
								<View style = {styles.button}>
									<Text style={styles.button_text}>Next</Text>
								</View>
							</TouchableOpacity>
						</View>	
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
	input : {flex : 1, width : 100, fontSize : 24, justifyContent : 'flex-start'},
	button : {
		flex : 1, 
		backgroundColor : '#90d7ed', 
		borderRadius:60, 
		justifyContent : 'center', 
		alignItems : 'center', 
		width : 100, 
		height : 40
	},
	button_text : {color : 'white', fontWeight : 'bold', fontSize : 14},
	error_text : {color : 'red', fontWeight : 'bold', fontSize : 12},
	resend : {fontSize : 14, color : 'lightseagreen'},
});
