import React from 'react';
import {Component} from 'react'
import {Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';

export default class EmailInput extends React.Component {
	constructor(props ){
		super(props);
		this.state = { error : false };
	}
	handleChange(value) {
		var obj = {};
		obj["email"] = value;
		this.validateEmail.bind(this)(value);
		this.props.handleChange(obj);
	}
	validateEmail(value) {
		var url = "https://manaweb-events.herokuapp.com"
		var test_url = "http://0.0.0.0:5000"
		fetch(url + "/mobileEmailValidation", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}, 
			body: JSON.stringify({
				email : value
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			if (responseData.result != "success") {
				this.setState({ error : responseData.error });
				this.props.addError('email');
			}
			else {
				this.setState({ error : false });
				this.props.removeError('email');
			}
		})
		.done();
	}
	render() {
		return(
			<View style = {styles.input_container}> 
				<Text style = {styles.settings_label}>
					Email
				</Text>
				<View style={styles.settings_input_container}>
					<TextInput 
						style = {styles.settings_input}
						placeholder = "Email" 
						maxLength = {30}
						onChangeText = {this.handleChange.bind(this)}
						value = {this.props.value}/>                  
				</View>
				{this.state.error && 
				<View style = {styles.error_box}>
					<Text style = {styles.error_text}>
						{this.state.error}
					</Text>
				</View>}
			 </View>
		)
	}
}
const styles = StyleSheet.create({
	settings_label : {
		fontSize : 16, 
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