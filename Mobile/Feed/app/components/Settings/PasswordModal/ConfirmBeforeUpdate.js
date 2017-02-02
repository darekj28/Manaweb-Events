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

export default class ConfirmBeforeUpdate extends React.Component {
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

	confirmPassword(){
		if (this.state.current_password_error) {
			Alert.alert("Password is invalid.")
		}
		else {
			this.props.submitNewSettings();
		}
	}
	
	render() {
		var update = !this.state.current_password ?
			<Text style={styles.disabled_update}>Update</Text> :
			<TouchableOpacity onPress={this.confirmPassword.bind(this)}>
				<Text style={styles.enabled_update}>Update</Text>
			</TouchableOpacity>;
		return(
			<Modal visible={this.props.display} animationType={"slide"} transparent={false} onRequestClose={() => {return}}>
				{Platform.OS == 'ios' && <View style = {{paddingTop : 20}} />}
				<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
				<View style={{flex : 1, flexDirection:'column',justifyContent : 'flex-start'}}>
					<View style={styles.top_bar}>
						<View style={{flex: 1}}>
							<TouchableOpacity onPress = {this.props.toggleConfirmPasswordModal}>
								<Text style = {{color : '#90D7ED'}}>
									Back
								</Text>
							</TouchableOpacity>
						</View>
						<View style={{flex: 3}}>
							<Text style = {{textAlign : 'center', fontWeight : 'bold'}}>
								Confirm Password
							</Text>
						</View>
						<View style={{flex: 1, justifyContent : 'flex-end', flexDirection : 'row'}}>
							{update}
						</View>
					</View>
					<View style={styles.list_container}>
						<CurrentPassword username={this.props.username} 
										handleChange={this.handleChange.bind(this)}
										handleError={this.handleError.bind(this)}
										label = {"Confirm password"}/>
					</View>
				</View>
				</TouchableWithoutFeedback>		 
			</Modal>
		)
	}
}

const window = Dimensions.get('window');
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
	enabled_update : {
		color : '#90D7ED',
		fontWeight : 'bold'
	},
	disabled_update : {
		color : 'silver'
	}
});