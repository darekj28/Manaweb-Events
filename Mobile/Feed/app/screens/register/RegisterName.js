
import React from 'react';
import {Component} from 'react'
import {TouchableWithoutFeedback, Image, ScrollView, Alert, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import RegisterHeader from '../../components/register/RegisterHeader';

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
		this._navigateToRegisterPhoneNumber();
		if (this.state.first_name_validation_output['result'] == 'success' 
			&& this.state.last_name_validation_output['result'] == 'success')
			this._navigateToRegisterPhoneNumber();
		else Alert.alert("You must enter a valid name.")
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
			<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
				<View style={styles.container}>
					<RegisterHeader navigator={this.props.navigator}/>
					<View style={{flex : 1, flexDirection : 'column', borderColor : 'red', borderWidth : 1}}>
						<View style={{flex : 2, borderColor : 'yellow', borderWidth : 1}}>
							<View style={{flex : 1.5, alignItems : 'center', justifyContent : 'center'}}>
								<Text style={{fontSize : 18}}>What's your name?</Text>
							</View>
							<View style={{flex : 1, borderColor : 'green', borderWidth : 1}}>
								<Text style={styles.label}>FIRST NAME</Text>
								<View style={styles.input_wrapper}>
									<TextInput onChangeText = {this.handleFirstNameChange}
										style = {styles.input} 
										value = {this.state.first_name} 
										maxLength = {12}/>
								</View>
							</View>
							<View style={{flex : 0.2}}/>
							<View style = {{flex : 1, borderColor : 'green', borderWidth : 1}}>
								<Text style={styles.label}>LAST NAME</Text>
								<View style={styles.input_wrapper}>
									<TextInput onChangeText = {this.handleLastNameChange}
										style = {styles.input}
										value = {this.state.last_name} 
										maxLength = {12}/>
								</View>
							</View>
						</View>
						<View style = {{flex : 1, alignItems : 'center', borderColor : 'blue', borderWidth : 1}}>
							<View style={{flex : 1, justifyContent : 'center'}}>
								{error_message}
							</View>
							<TouchableOpacity style={{flex : 1}} onPress = {this.submitFullName.bind(this)}>
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
	input : {flex : 1, width : 180, fontSize : 14, justifyContent : 'flex-start'},
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
	error_text : {color : 'red', fontWeight : 'bold', fontSize : 12}
});
