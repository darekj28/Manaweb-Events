
import React from 'react';
import {Component} from 'react'
import {TouchableWithoutFeedback, Alert, Image, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import RegisterHeader from '../../components/register/RegisterHeader';

export default class AlternateRegisterEmail extends Component {
	constructor(props) {
		super(props)
		this.state = {
			email : "",
			validation_output: {'error' : ""}
		}
		this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
		this.handleEmailChange = this.handleEmailChange.bind(this);
		this.validateEmail = this.validateEmail.bind(this);
	}

	handleEmailSubmit() {
		if (this.state.validation_output['result'] == 'success') {
			this.sendConfirmationPin.bind(this)()
		}
		else {
			Alert.alert(this.state.validation_output.error)
		}
	}

	sendConfirmationPin(){
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
				email : this.state.email
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			if (responseData.error){
				Alert.alert("Invalid Email")
			}
			else {
				console.log(responseData['confirmationPin'])
				this.setState({confirmationPin : responseData['confirmationPin']})
				this._navigateToEmailConfirm();  
			}
			
		})
		.done();
	}

	handleEmailChange(email) {
		this.setState({email : email})
		this.validateEmail(email);
	}

	validateEmail(email) {
		var url = "https://manaweb-events.herokuapp.com"
		var test_url = "http://0.0.0.0:5000"
		fetch(url + "/mobileEmailValidation", {method: "POST",
		headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}, 
			body: 
			JSON.stringify(
			 {
				email : email
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			this.setState({validation_output : responseData})
		})
		.done();
	}

	clearEmail() {
		this.setState({email : ""})
	}

	_navigateToEmailConfirm() {
		this.props.navigator.push({
		href: "RegisterEmailConfirm",
		email : this.state.email,
		password : this.props.password,
		first_name: this.props.first_name,
		last_name: this.props.last_name,
		confirmationPin : this.state.confirmationPin
		})
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
			<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
				<View style={styles.container}>
					<RegisterHeader navigator={this.props.navigator}/>
					<View style={{flex : 1, flexDirection : 'column'}}>
						<View style={{flex : 2}}>
							<View style={{flex : 1.5, alignItems : 'center', justifyContent : 'center'}}>
								<Text style={{fontSize : 18}}>What's your email?</Text>
							</View>
							<View style={{flex : 0.6}}/>
							<View style={{flex : 1,justifyContent : 'center'}}>
								<Text style={styles.label}>EMAIL ADDRESS</Text>
								<View style={styles.input_wrapper}>
									<TextInput onChangeText = {this.handleEmailChange}
										style = {styles.input} 
                						value = {this.state.email}/>
								</View>
							</View>
							<View style={{flex : 0.6, width : 220, alignItems : 'center'}}>
								<View style={{flex : 1, alignItems:'center', justifyContent : 'center'}}>
									{error_message}
								</View>
							</View>
						</View>
						<View style = {{flex : 1, alignItems : 'center'}}>
							<View style={{flex : 0.5}}/>
							<TouchableOpacity style={{flex : 1}} onPress = {this.handleEmailSubmit.bind(this)}>
								<View style = {styles.button}>
									<Text style={styles.button_text}>Next</Text>
								</View>
							</TouchableOpacity>
							<View style={{flex : 0.5}}/>
						</View>
						<View style = {{flex : 2}}/>							
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
	input : {flex : 1, width : 220, fontSize : 14, justifyContent : 'flex-start'},
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
