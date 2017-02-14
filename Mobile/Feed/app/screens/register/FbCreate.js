
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
import {Image, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput, TouchableWithoutFeedback} from 'react-native';
import {Dimensions} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import RegisterHeader from '../../components/register/RegisterHeader';
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
		fetch(url + "/getKey", {method: "POST",
			headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
			},
			body:
			JSON.stringify(
			 {
				test : 'test'
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
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
					fb_id: this.props.fb_id,
					secret : responseData.temp_key
				})
			})
			.then((response) => response.json())
			.then((responseData) => {
					if (responseData['result'] == 'success') {
							this.props.asyncStorageLogin(responseData.current_user.userID, responseData['jwt']).then(() => {
								AsyncStorage.setItem("fb_token", this.props.fb_token).done()
							}).done()
							this._navigateToWelcome.bind(this)()
					}
			})
			.catch((error) => {
				Alert.alert(error);
			})
			.done();
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

			var {height, width} = Dimensions.get('window');
			var error_message = this.getErrorMessage.bind(this)();
			return (
					<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
							<View style={[styles.container, {height: height}]}>
									<RegisterHeader navigator={this.props.navigator}/>
									<View style={{flex : 1, flexDirection : 'column'}}>
											<View style={{flex : 2}}>
													<View style={{flex : 1.5, alignItems : 'center', justifyContent : 'center'}}>
															<Text style={{fontSize : 18}}>
																	Welcome {this.state.first_name}!
															</Text>
													</View>
													<View style={{flex : 0.6}}/>
															<View style={{flex : 1,justifyContent : 'center'}}>
																	<Text style={styles.label}>Select a username</Text>
																	<View style={styles.input_wrapper}>
																			<TextInput onChangeText = {this.handleUsernameChange.bind(this)}
																					style = {styles.input}
																					value = {this.state.username}
																					maxLength = {15}/>
																	</View>
															</View>
															<View style={{flex : 0.6, width : 220, alignItems : 'center'}}>
																	<View style={{flex : 1, alignItems:'center', justifyContent : 'center'}}>
																			{error_message}
																	</View>
															</View>
													</View>
											<View style = {{flex : 0.5, alignItems : 'center'}}>
													<TouchableOpacity style={{flex : 1}} onPress = {this.handleUsernameSubmit.bind(this)}>
															<View style = {styles.button}>
																	<Text style={styles.button_text}>Submit!</Text>
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
		input : {flex : 1, width : 220, fontSize : 14, justifyContent : 'flex-start', paddingBottom: 0},
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
});

module.exports = FbCreate
