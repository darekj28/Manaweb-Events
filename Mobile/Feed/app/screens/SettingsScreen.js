import React from 'react';
import {Component} from 'react'
import {Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';
import AvatarPicker from 	'../components/settings/AvatarPicker';
import NameInput from 		'../components/settings/NameInput';
import EmailInput from 		'../components/settings/EmailInput';
import PhoneInput from 		'../components/settings/PhoneInput';
import AvatarInput from 	'../components/settings/AvatarInput';
import PasswordModal from 	'../components/settings/passwordmodal/PasswordModal';
import PasswordModalLink from '../components/settings/passwordmodal/PasswordModalLink';
import LogoutButton from 	'../components/settings/LogoutButton';
export default class SettingsScreen extends Component {
	constructor(props) {
		super(props);
		this.state = {
			current_username 				: this.props.current_user.userID,
			current_user 					: this.props.current_user,
			first_name						: this.props.current_user.first_name,
			last_name 						: this.props.current_user.last_name,
			email 							: this.props.current_user.email,
			phone_number 					: this.props.current_user.phone_number,
			avatar 							: this.props.current_user.avatar_name,
			display_avatar_picker 			: false,
			display_password_change 		: false
		};
	}
	handleChange(obj) {
		this.setState(obj);
	}
	submitNewSettings() {
		var errorCheckResult = this.errorCheck.bind(this)();
		var canSubmit = errorCheckResult.result
		var errorMessage = errorCheckResult.reason
		if (canSubmit) {
			var url = "https://manaweb-events.herokuapp.com"
			var test_url = "http://0.0.0.0:5000"
			fetch(url + "/mobileUpdateSettings", {method: "POST",
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				}, 
			body: 
			JSON.stringify({
				username: this.state.current_username,
				first_name : this.state.first_name,
				last_name : this.state.last_name,
				email : this.state.email,
				phone_number : this.state.phone_number,
				avatar : this.state.avatar
			})
			})
			.then((response) => response.json())
			.then((responseData) => {
			this.props.refreshInfo.bind(this)();
			alert("Settings Updated")
			}).done();
		}
		else {
			alert(errorMessage)
		}
	}
	errorCheck() {
		var canSubmit = true;
		var reason = "";
		if (this.state.first_name_validation.result != 'success') {
		 	canSubmit = false;
		 	reason = "Error with first name"
		 	// reason = this.state.first_name_validation.error
		}
		if (this.state.last_name_validation.result != 'success') {
			canSubmit = false;
			reason = "Error with last name"
			// reason = this.state.last_name_validation.error
		}
		if (this.state.email_validation.result != 'success') {
			canSubmit = false;
			reason = "Error with email"
			// reason = this.state.email_validation.error
		}
		if (this.state.phone_number_validation.result != 'success') {
			canSubmit = false;
			reason = "Error with phone number"
			// reason = this.state.phone_number_validation.error
		}
		return {result: canSubmit, reason : reason};
	}
	toggleAvatarPicker() {
		this.setState({display_avatar_picker : !this.state.display_avatar_picker});
	}
	togglePasswordModal() {
		this.setState({display_password_change : !this.state.display_password_change})
	}
	listViewRenderRow(input_element){
		return input_element
	}
	checkForChanges() {
		var hasChanges = false;
		if (this.state.first_name 	!== this.props.current_user.first_name) hasChanges = true
		if (this.state.last_name 	!== this.props.current_user.last_name) hasChanges = true
		if (this.state.email 		!== this.props.current_user.email) hasChanges = true
		if (this.state.phone_number !== this.props.current_user.phone_number) hasChanges = true
		if (this.state.avatar 		!== this.props.current_user.avatar_name) hasChanges = true
		return hasChanges;
	}

	render() {
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		var data = 
		[
			<NameInput value={this.state.first_name} 	handleChange={this.handleChange.bind(this)} label="First name" name="first_name"/>,
			<NameInput value={this.state.last_name} 	handleChange={this.handleChange.bind(this)} label="Last name" name="last_name"/>,
			<EmailInput value={this.state.email} 		handleChange={this.handleChange.bind(this)}/>, 
			<PhoneInput value={this.state.phone_number} handleChange={this.handleChange.bind(this)} prevPhone={this.state.current_user.phone_number}/>,
			<AvatarInput avatar={this.state.avatar} 	toggleAvatarPicker={this.toggleAvatarPicker.bind(this)}/>,
			<PasswordModalLink togglePasswordModal={this.togglePasswordModal.bind(this)}/>, 
			<LogoutButton handleLogout={this.props.handleLogout}/>
		]
		var dataSource = ds.cloneWithRows(data)
		return (
			<View style = {styles.container}>
				<AvatarPicker handleChange={this.handleChange.bind(this)} display={this.state.display_avatar_picker}
								avatar={this.state.avatar} toggleAvatarPicker={this.toggleAvatarPicker.bind(this)}/>
				<PasswordModal display={this.state.display_password_change} togglePasswordModal={this.togglePasswordModal.bind(this)} 
								username={this.state.current_username}/>
				<View style = {styles.top_bar}>
					<View style={styles.left}>
					</View>
					<Text style={styles.middle}> 
						Account Settings
					</Text> 
					<View style = {styles.right}>
						<TouchableOpacity onPress = {this.submitNewSettings.bind(this)}>
							<Text style = {{color : '#90D7ED'}}>
								Update
							</Text>
						</TouchableOpacity>
					</View>
				</View>
				<ListView style={styles.list_container} dataSource={dataSource} renderRow={this.listViewRenderRow.bind(this)}/>  
			</View> 
		)
	}
}

const styles = StyleSheet.create({
 	container: {
		flex: 1,
		flexDirection : "column",
		justifyContent: 'space-between',
		backgroundColor: "white",
		alignItems: 'flex-start'
	},
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
	left : {
		flex : 1
	},
	middle: {
		flex : 2,
		textAlign: "center",
		fontWeight : 'bold'
	},
	right: {
		flex:1,
		flexDirection : "row",
		justifyContent : "flex-end"
	},
});
