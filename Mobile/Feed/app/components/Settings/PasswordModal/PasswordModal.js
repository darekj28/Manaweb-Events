import React from 'react';
import {Component} from 'react'
import {TouchableWithoutFeedback, Platform, Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';
import CurrentPassword from './CurrentPassword';
import NewPassword from './NewPassword';
import ConfirmPassword from './ConfirmPassword';
import dismissKeyboard from 'react-native-dismiss-keyboard';

export default class PasswordModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = { current_password_error : true, 
						new_password_error : true,
						confirm_password_error : "Please confirm your password."};
	}
	handleError(obj) {
		this.setState(obj);
	}
	handleChange(obj) {
		this.setState(obj);
	}
	updatePassword(){
		if (this.state.current_password_error){
			Alert.alert("Your current password is invalid.");
		}
		else if (this.state.new_password_error){
			Alert.alert("Your new password must have at least one uppercase letter and one number.");
		}
		else if (this.state.confirm_password_error) {
			Alert.alert(this.state.confirm_password_error);
		}
		else {
			var url = "https://manaweb-events.herokuapp.com";
			var test_url = "http://0.0.0.0:5000";
			fetch(url + "/mobileUpdatePassword", {
				method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				}, 
				body: JSON.stringify({
					username: this.props.username,
					password: this.state.new_password
				})
			})
			.then((response) => response.json())
			.then((responseData) => {
			Alert.alert(
				"Your password was updated.",
				"",
				[
				{text: 'OK', onPress: () => this.props.togglePasswordModal()}
				])
			}).done();
		}
	}
	render() {
		return(
			<Modal visible={this.props.display} animationType={"slide"} transparent={false} onRequestClose={() => {return}}>
					{Platform.OS == 'ios' && <View style = {{paddingTop : 20}} />}
					<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
					<View style={{flex : 1, flexDirection:'column',justifyContent : 'flex-start'}}>
						<View style={styles.top_bar}>
							<View style={{flex: 0.2}}>
								<TouchableOpacity onPress = {this.props.togglePasswordModal}>
									<Text style = {{color : '#90D7ED'}}>
										Cancel
									</Text>
								</TouchableOpacity>
							</View>
							<View style={{flex: 0.6}}>
								<Text style = {{textAlign : 'center', fontWeight : 'bold'}}>
									Update password
								</Text>
							</View>
							<View style={{flex: 0.2, justifyContent : 'flex-end', flexDirection : 'row'}}>
								<TouchableOpacity onPress = {this.updatePassword.bind(this)}>
									<Text style = {{color : '#90D7ED'}}>
										Update
									</Text>
								</TouchableOpacity>
							</View>
						</View>
						<View style={styles.list_container}>
							<CurrentPassword username={this.props.username} 
											handleChange={this.handleChange.bind(this)}
											handleError={this.handleError.bind(this)}/>
							<NewPassword 	handleChange={this.handleChange.bind(this)}
											handleError={this.handleError.bind(this)}/>
							<ConfirmPassword password={this.state.new_password}
											handleChange={this.handleChange.bind(this)}
											handleError={this.handleError.bind(this)}/>
						</View>
					</View>
				</TouchableWithoutFeedback>
				 
			</Modal>
		)
	}
}
const styles = StyleSheet.create({
	top_bar : {
		flex : 0.1,
		paddingLeft : 10,
		paddingRight : 10,
		flexDirection : "row",
		justifyContent: "space-around",
		borderBottomColor : '#e1e1e1',
		borderBottomWidth : 1,
		alignItems : 'center'
	},
	list_container: {
		flex : 1,
		paddingTop : 8,
		alignSelf : 'stretch',
		backgroundColor : '#fbfbfb'
	},
});