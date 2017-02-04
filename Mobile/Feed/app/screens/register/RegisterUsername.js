
import React from 'react';
import {Component} from 'react'
import {TouchableWithoutFeedback, Image, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import RegisterHeader from '../../components/register/RegisterHeader';

export default class RegisterUsername extends Component {
	constructor(props) {
		super(props)
		this.state = {
			username : "",
			validation_output: {'error' : ""}
		}
		this.handleUsernameSubmit = this.handleUsernameSubmit.bind(this);
		this.handleUsernameChange = this.handleUsernameChange.bind(this);
		this.validateUsername = this.validateUsername.bind(this);
		this.createAccount = this.createAccount.bind(this);
	}

	createAccount() {
		var url = "https://manaweb-events.herokuapp.com"
		var test_url = "http://0.0.0.0:5000"
		fetch(test_url + "/mobileCreateProfile", {method: "POST",
		headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}, 
			body: 
			JSON.stringify(
			 {
				password : this.props.password,
				email : this.props.email,
				username: this.state.username,
				first_name: this.props.first_name ,
				last_name: this.props.last_name,
				password: this.props.password,
				phone_number : this.props.phone_number
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
				if (responseData['result'] == 'success') {
						this.props.asyncStorageLogin(this.state.username).done()  
													
				}
		}).done();
	}

	handleUsernameSubmit() {
		if (this.state.validation_output['result'] == 'success') {
			this.createAccount()
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

	clearUsername() {
		this.setState({username : ""})
	}

	_navigateToWelcome() {
		this.props.navigator.push({
		href: "Welcome",
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
							<View style={{flex : 1.4, alignItems : 'center', justifyContent : 'center'}}>
								<Text style={{fontSize : 18}}>Pick a username</Text>
							</View>
							<View style={{flex : 0.6}}/>
							<View style={{flex : 1, justifyContent : 'center'}}>
								<Text style={styles.label}>USERNAME</Text>
								<View style={styles.input_wrapper}>
									<TextInput onChangeText = {this.handleUsernameChange}
										style = {styles.input} 
						                maxLength = {15}
						                value = {this.state.username}/>
								</View>
							</View>
							<View style={{flex : 0.1}}/>
							<View style={{flex: 0.6, alignItems : 'center', justifyContent : 'center'}}>
								<View style={{flex : 1, alignItems: 'center', justifyContent : 'center', width : 180}}>
								{error_message}
							</View>
							</View>
						</View>
						<View style = {{flex : 1, alignItems : 'center'}}>
							<View style={{flex : 0.5}}/>
							<TouchableOpacity style={{flex : 1}} onPress = {this.handleUsernameSubmit.bind(this)}>
								<View style = {styles.button}>
									<Text style={styles.button_text}>Finish</Text>
								</View>
							</TouchableOpacity>
							<View style={{flex : 0.5}}/>
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
	input : {flex : 1, width : 200, fontSize : 22, justifyContent : 'flex-start'},
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
	error_text : {color : 'red', fontWeight : 'bold', fontSize : 12}
});
