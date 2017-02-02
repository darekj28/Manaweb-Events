import React from 'react';
import {Component} from 'react'
import {Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';

export default class NewPassword extends React.Component {
	constructor(props ){
		super(props);
		this.state = { error : false };
	}
	handleChange(value) {
		var obj = {};
		obj["new_password"] = value;
		this.validatePassword.bind(this)(value);
		this.props.handleChange(obj);
	}
	validatePassword(new_password) {
		var url = "https://manaweb-events.herokuapp.com";
		var test_url = "http://0.0.0.0:5000";
		fetch(url + "/mobilePasswordValidation", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}, 
			body: JSON.stringify({
				password: new_password,
				password_confirm: new_password
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			if (responseData.result != "success") {
				this.props.handleError({ "new_password_error" : responseData.error });
			}
			else {
				this.props.handleError({ "new_password_error" : "" });
			}
		})
		.done();
	}
	render() {
		return(
			<View style = {styles.input_container}> 
				<Text style = {styles.settings_label}>
					NEW
				</Text>
				<View style={styles.settings_input_container}>
				 	<TextInput
						onChangeText = {this.handleChange.bind(this)}
						style = {styles.settings_input} placeholder = "Password"
						secureTextEntry = {true}
						maxLength = {20}/>
				</View>
			</View>
		)
	}
}
const styles = StyleSheet.create({
	settings_label : {
		fontSize : 14, 
		fontWeight : 'bold', 
		padding: 8,
		paddingLeft : 32,
		color : '#696969'
	},
	settings_input : {
		fontSize : 16, 
		padding : 8,
		paddingLeft : 32, 
		height : 35
	},
	settings_input_container : {
		backgroundColor : 'white',
		borderTopWidth : 0.5,
		borderBottomWidth : 0.5,
		borderTopColor : '#e1e1e1',
		borderBottomColor : '#e1e1e1'
	},
	input_container : {
		flexDirection:'column',
		paddingBottom : 8,
	},
	error_box : {
		flex: 0.5,
		flexDirection : "row",
		paddingLeft : 32
	},
	error_text : {
		color : "red"
	},
});