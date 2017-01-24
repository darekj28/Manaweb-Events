import React from 'react';
import {Component} from 'react'
import {Platform, Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';
import CurrentPassword from './CurrentPassword';
import NewPassword from './NewPassword';
import ConfirmPassword from './ConfirmPassword';

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
			alert("Current password is invalid")
		}
		else {
			this.props.submitNewSettings()
			this.props.toggleConfirmPasswordModal()
		}
	}
	
	render() {
		return(
			<Modal visible={this.props.display} animationType={"slide"} transparent={false} onRequestClose={() => {return}}>
				{Platform.OS == 'ios' && <View style = {{paddingTop : 20}} />}
				<View style={{flex : 1, flexDirection:'column',justifyContent : 'flex-start'}}>
					<View style={styles.top_bar}>
						<View style={{flex: 0.2}}>
							<TouchableOpacity onPress = {this.props.toggleConfirmPasswordModal}>
								<Text style = {{color : '#90D7ED'}}>
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
						<View style={{flex: 0.6}}>
							<Text style = {{textAlign : 'center', fontWeight : 'bold'}}>
								Confirm Password
							</Text>
						</View>
						<View style={{flex: 0.2, justifyContent : 'flex-end', flexDirection : 'row'}}/>
				{/*		<View style={{flex: 0.2, justifyContent : 'flex-end', flexDirection : 'row'}}>
							<TouchableOpacity onPress = {this.confirmPassword.bind(this)}>
								<Text style = {{color : '#90D7ED'}}>
									Update
								</Text>
							</TouchableOpacity>
						</View> */}
					</View>
					<View style={styles.list_container}>
						<CurrentPassword username={this.props.username} 
										handleChange={this.handleChange.bind(this)}
										handleError={this.handleError.bind(this)}
										label = {"Enter Current Password To Update"}/>
					</View>
					<View style={{flex: 0.7}}>
							<TouchableOpacity onPress = {this.confirmPassword.bind(this)} style = {styles.update_button}>
								<Text style = {{textAlign : 'center', fontWeight : 'bold', 'color' : 'skyblue'}}>
									Confirm Password To Update Settings
								</Text>
							</TouchableOpacity>
					</View>
				</View>
				 
				 
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
		flex : 0.2,
		paddingTop : 8,
		alignSelf : 'stretch',
		backgroundColor : '#fbfbfb'
	},
	update_button : {
		borderColor : "skyblue",
		borderWidth : 2,
		borderRadius : 5,
		padding: 6,
	}
});