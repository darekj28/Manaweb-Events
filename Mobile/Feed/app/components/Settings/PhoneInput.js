import React from 'react';
import {Component} from 'react'
import {Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';

export default class PhoneInput extends React.Component {
	constructor(props ){
		super(props);
		this.state = { error : false };
	}
	handleChange(value) {
		value = this.parseNumber(value);
		var obj = {};
		obj["phone_number"] = value;
		if (value === this.props.prevPhone) this.setState({ error : false });
		else this.validatePhone.bind(this)(value);
		this.props.handleChange(obj);
	}
	parseNumber(phone_number) {
		var raw_phone_number = "";
		for (var i = 0; i < phone_number.length; i++) {
			var c = phone_number[i];
			if (!isNaN(c) && c != " "){
				raw_phone_number = raw_phone_number + c;
			}
		}
		var length = raw_phone_number.length;
		var new_phone_number = "";
		if (length > 0 && length <= 3) {
			new_phone_number = "(" + raw_phone_number;
		}
		if (length == 4) {
			new_phone_number = "(" + raw_phone_number.substring(0,3) + ") " + raw_phone_number.substring(3,4);
		}
		if (length > 4 && length <= 6) {
			new_phone_number = "(" + raw_phone_number.substring(0,3) + ") " + raw_phone_number.substring(3, length);
		}
		if (length > 6) {
			new_phone_number = "(" + raw_phone_number.substring(0,3) + ") " + raw_phone_number.substring(3, 6) + "-" + raw_phone_number.substring(6, length);
		}
		return new_phone_number;
	}
	validatePhone(value) {
		var url = "https://manaweb-events.herokuapp.com"
		var test_url = "http://0.0.0.0:5000"
		fetch(url + "/mobilePhoneNumberValidation", {
			method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			}, 
			body: JSON.stringify({
				phone_number : value
			})
		})
		.then((response) => response.json())
		.then((responseData) => {
			if (responseData.result != "success") {
				this.setState({ error : responseData.error });
				this.props.addError("phone_number");
			}
			else {
				this.setState({ error : false });
				this.props.removeError("phone_number");
			}
		})
		.done();
	}
	render() {
		return(
			<View style = {styles.input_container}> 
				<Text style = {styles.settings_label}>
					Phone number
				</Text>
				<View style={styles.settings_input_container}>
					<TextInput
						onChangeText={this.handleChange.bind(this)}
						style = {styles.settings_input}
						placeholder = "Phone number"
						value = {this.props.value}
						keyboardType = "number-pad"
						dataDetectorTypes = "phoneNumber"
						maxLength = {14}/>              
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