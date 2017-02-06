
import React from 'react';
import {Component} from 'react'
import {Alert, Image, TouchableWithoutFeedback, KeyboardAvoidingView, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import {Dimensions} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import LoginHeader from '../components/login/LoginHeader';
export default class LoginScreen extends Component {
	constructor(props) {
		super(props)
		this.state = {
			login_id : "",
			password: "",
			username: "",
			validation_output: {result : "nothing yet"},
			show_password: false,
			behavior: ''
		}
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
		this.handleLoginIdChange = this.handleLoginIdChange.bind(this);
		this._navigateToFeed = this._navigateToFeed.bind(this);
	}

	checkIfLocked(){
		var url = "https://manaweb-events.herokuapp.com"
		var test_url = "http://0.0.0.0:5000"
		fetch(url + "/mobileIsUserLocked", {method: "POST",
		headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
			body:
			JSON.stringify(
			 {
				login_id : this.state.login_id,
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
				if (responseData) {
					alert("Your account is locked due to suspicious activity, please use account recovery to reset your password")
				}
				else {
					this.handleLoginSubmit.bind(this)()
				}
		})
		.done();
	}

	handleLoginSubmit() {
		var url = "https://manaweb-events.herokuapp.com"
		var test_url = "http://0.0.0.0:5000"
		fetch(url + "/mobileLogin", {method: "POST",
		headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
			body:
			JSON.stringify(
			 {
				login_id : this.state.login_id,
				password: this.state.password
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
				if (responseData['result'] == 'success') {
						this.props.asyncStorageLogin(responseData['current_user']['userID']).then((value) => {
							this.setState({username: responseData['username']})
							this.setState({validation_output: responseData})
							this._navigateToFeed()
						})
				}
				else {
					Alert.alert("Invalid Credentials")
					this.setState({ validation_output : responseData})
				}

		})
		.done();
	}
	togglePassword() {
		var newToggle = !this.state.show_password;
		this.setState({show_password : newToggle})
	}
	_navigateToFeed() {
		dismissKeyboard();
		this.props.navigator.push({
		href: "Feed"
		})
	}
	handlePasswordChange(password) {
		this.setState({password: password})
	}
	handleLoginIdChange(login_id) {
		this.setState({login_id : login_id})
	}

	_navigateToRecovery(){
		dismissKeyboard();
		this.props.navigator.push({
		href: "Recovery"
		})
	}

	render() {
		var {height, width} = Dimensions.get('window');
		return (
		<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
			<View style={[styles.container, {height: height}]}>
				<LoginHeader navigator={this.props.navigator} name="Log In"/>
				<View style={{flex : 1, flexDirection : 'column'}}>
					<View style={{flex : 2}}>
						<View style={{flex : 1}}/>
						<View style={{flex : 1}}>
							<Text style={styles.label}>USERNAME OR EMAIL</Text>
							<View style={styles.input_wrapper}>
								<TextInput onChangeText = {this.handleLoginIdChange}
									style = {styles.input}/>
							</View>
						</View>
						<View style={{flex : 0.5}}/>
						<View style = {{flex : 1}}>
							<Text style={styles.label}>PASSWORD</Text>
							<View style={styles.input_wrapper}>
								<TextInput onChangeText = {this.handlePasswordChange}
									style = {styles.input}
									secureTextEntry = {true}
									/>
							</View>
						</View>
					</View>
					<View style = {{flex : 1, alignItems : 'center'}}>
						<View style={{flex : 1, justifyContent : 'center'}}>
							<TouchableOpacity onPress = {this._navigateToRecovery.bind(this)}>
								<Text style={styles.forgot_password}>Forgot your password?</Text>
							</TouchableOpacity>
						</View>
						<TouchableOpacity style={{flex : 1}} onPress = {this.checkIfLocked.bind(this)}>
							<View style = {styles.button}>
								<Text style={styles.button_text}>Log In</Text>
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
	button : {
		flex : 1,
		backgroundColor : '#90d7ed',
		borderRadius:60,
		justifyContent : 'center',
		alignItems : 'center',
		width : 150,
		height : 35
	},
	button_text : {color : 'white', fontWeight : 'bold', fontSize : 14},
	forgot_password : {fontSize : 12, color : 'lightseagreen'},
	label : {flex : 0, fontSize : 12, fontWeight : 'bold', color : '#696969'},
	input_wrapper : {flex : 1, borderBottomColor : 'silver', borderBottomWidth : 1},
	input : {flex : 1, width : 220, fontSize : 14, justifyContent : 'flex-start', paddingBottom: 0},
});
