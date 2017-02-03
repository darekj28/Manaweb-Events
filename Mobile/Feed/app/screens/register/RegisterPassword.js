import React from 'react';
import {Component} from 'react'
import {TouchableWithoutFeedback, Alert, Image, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import RegisterHeader from '../../components/register/RegisterHeader';

export default class RegisterPassword extends Component {
	constructor(props) {
		super(props)
		this.state = {
			password : "",
			password_confirm: "",
			validation_output : {}
		}
		this._navigateToRegisterEmail = this._navigateToRegisterEmail.bind(this);
		this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this);
		this.handlePasswordChange = this.handlePasswordChange.bind(this);
		this.validatePassword = this.validatePassword.bind(this);
		this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
	}

	validatePassword(password, password_confirm) {
		var url = "https://manaweb-events.herokuapp.com"
		var test_url = "http://0.0.0.0:5000"
		fetch(url + "/mobilePasswordValidation", {method: "POST",
		headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}, 
			body: 
			JSON.stringify(
			 {
				password: password,
				password_confirm: password_confirm
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			this.setState({validation_output : responseData})
		})
		.done();
	}

	handlePasswordSubmit() { 
		if (this.state.validation_output.result == 'success') {
			this._navigateToRegisterEmail();
		}
		else {
			Alert.alert(this.state.validation_output.explanation)
		}
	}
	handlePasswordChange(password) {
		this.setState({password : password})
		this.validatePassword(password, this.state.password_confirm)
	}
	handlePasswordConfirmChange(password_confirm) {
		this.setState({password_confirm : password_confirm})
		this.validatePassword(this.state.password, password_confirm)
	}
	clearPassword() {
		this.setState({password : ""})
	}
	clearPasswordConfirm() {
		this.setState({password_confirm : ""})
	}
// add validators
	_navigateToRegisterEmail() {
		this.props.navigator.push({
		href: "RegisterEmail",
		password : this.state.password,
		password_confirm: this.state.password_confirm,
		phone_number : this.props.phone_number,
		first_name: this.props.first_name,
		last_name: this.props.last_name
		})
	}

	render() {
		return (
			<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
				<View style={styles.container}>
					<RegisterHeader navigator={this.props.navigator}/>
					<View style={{flex : 1, flexDirection : 'column'}}>
						<View style={{flex : 2}}>
							<View style={{flex : 1.5, alignItems : 'center', justifyContent : 'center'}}>
								<Text style={{fontSize : 18}}>Choose a password</Text>
							</View>
							<View style={{flex : 1}}>
								<Text style={styles.label}>PASSWORD</Text>
								<View style={styles.input_wrapper}>
									<TextInput onChangeText = {this.handlePasswordChange}
										style = {styles.input} 
										maxLength = {20}
										value = {this.state.password}
										secureTextEntry = {true}/>
								</View>
							</View>
							<View style={{flex : 0.2}}/>
							<View style = {{flex : 1}}>
								<Text style={styles.label}>CONFIRM PASSWORD</Text>
								<View style={styles.input_wrapper}>
									<TextInput onChangeText = {this.handlePasswordConfirmChange}
										style = {styles.input}
										maxLength = {20}
										value = {this.state.password_confirm}
										secureTextEntry = {true}/>
								</View>
							</View>
						</View>
						<View style = {{flex : 1, alignItems : 'center'}}>
							<View style={{flex : 0.5}}/>
							<TouchableOpacity style={{flex : 1, justifyContent : 'center'}} onPress = {this.handlePasswordSubmit.bind(this)}>
								<View style = {styles.button}>
									<Text style={styles.button_text}>Next</Text>
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
	input : {flex : 1, width : 210, fontSize : 16, justifyContent : 'flex-start'},
	button : {
		flex : 1, 
		backgroundColor : '#90d7ed', 
		borderRadius:60, 
		justifyContent : 'center', 
		alignItems : 'center', 
		width : 100, 
		height : 35
	},
	button_text : {color : 'white', fontWeight : 'bold', fontSize : 14}
});
