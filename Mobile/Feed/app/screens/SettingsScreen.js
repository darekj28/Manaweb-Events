import React from 'react';
import {Component} from 'react'
import {Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';
import AvatarPicker from 	'../components/Settings/AvatarPicker';
import NameInput from 		'../components/Settings/NameInput';
import EmailInput from 		'../components/Settings/EmailInput';
import PhoneInput from 		'../components/Settings/PhoneInput';
import AvatarInput from 	'../components/Settings/AvatarInput';
import PasswordModal from 	'../components/Settings/PasswordModal/PasswordModal';
import PasswordModalLink from '../components/Settings/PasswordModal/PasswordModalLink';
import LogoutButton from 	'../components/Settings/LogoutButton';
import ConfirmBeforeUpdate from '../components/Settings/PasswordModal/ConfirmBeforeUpdate'

function remove(array, value) {
	var index = array.indexOf(value);
	if (index != -1) array.splice(index, 1);
	return array;
}
function add(array, value) {
	var index = array.indexOf(value);
	if (index === -1) array.push(value);
	return array;
}
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
			display_password_confirm		: false,
			display_avatar_picker 			: false,
			display_password_change 		: false,
			error_fields					: [],
			hasChanges 						: false,
			hasPrivateChanges				: false
		};
	}
	handleChange(obj) {
		this.setState(obj, this.checkForChanges.bind(this));
	}
	addError(field) {
		this.setState({ error_fields : add(this.state.error_fields, field) });
	}
	removeError(field) {
		this.setState({ error_fields : remove(this.state.error_fields, field) });
	}
	handleSubmitPress() {
		if (!this.state.hasChanges) {
			alert("No changes have been made")
		}
		else if (!this.state.hasPrivateChanges){
			this.submitNewSettings.bind(this)()
		}
		// if there are changes, give a modal that makes the user confirm their password
		else {
			this.toggleConfirmPasswordModal.bind(this)()
		}
	}

	submitNewSettings() {
		var canSubmit = this.state.error_fields.length === 0;
		var errorMessage = "There's a mistake in one of your fields."
		if (canSubmit) {
			var url = "https://manaweb-events.herokuapp.com"
			var test_url = "http://0.0.0.0:5000"
			fetch(url + "/mobileUpdateSettings", {
				method: "POST",
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
				Alert.alert("Settings updated. Returning to settings...")
			}).done();
		}
		else {
			Alert.alert(errorMessage);
		}
	}
	toggleAvatarPicker() {
		this.setState({display_avatar_picker : !this.state.display_avatar_picker});
	}
	togglePasswordModal() {
		this.setState({display_password_change : !this.state.display_password_change})
	}

	toggleConfirmPasswordModal(){
		this.setState({display_password_confirm : !this.state.display_password_confirm})
	}

	listViewRenderRow(input_element){
		return input_element;
	}
	checkForChanges() {
		var hasChanges = false;
		var fields = ['first_name', 'last_name', 'email', 'phone_number'];
		for (var i = 0; i < fields.length; i++)
			if (this.state[fields[i]] !== this.props.current_user[fields[i]])
				hasChanges = true;
		if (this.state.avatar !== this.props.current_user.avatar_name) hasChanges = true;
		this.setState({ hasChanges : hasChanges }, this.checkForPrivateChanges.bind(this));
	}

	checkForPrivateChanges(){
		var hasPrivateChanges = false;
		var fields = ['email', 'phone_number'];
		for (var i = 0; i < fields.length; i++)
			if (this.state[fields[i]] !== this.props.current_user[fields[i]])
				hasPrivateChanges = true;
		this.setState({ hasPrivateChanges : hasPrivateChanges });	
	}

	render() {
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		var data = 
		[
			<NameInput value={this.state.first_name} current_user = {this.props.current_user}	addError={this.addError.bind(this)} removeError={this.removeError.bind(this)} handleChange={this.handleChange.bind(this)} label="First name" name="first_name"/>,
			<NameInput value={this.state.last_name} current_user = {this.props.current_user}	addError={this.addError.bind(this)} removeError={this.removeError.bind(this)} handleChange={this.handleChange.bind(this)} label="Last name" name="last_name"/>,
			<EmailInput value={this.state.email} 	current_user = {this.props.current_user}	addError={this.addError.bind(this)} removeError={this.removeError.bind(this)} handleChange={this.handleChange.bind(this)}/>, 
			<PhoneInput value={this.state.phone_number} current_user = {this.props.current_user} addError={this.addError.bind(this)} removeError={this.removeError.bind(this)} handleChange={this.handleChange.bind(this)} prevPhone={this.state.current_user.phone_number}/>,
			<AvatarInput avatar={this.state.avatar} current_user = {this.props.current_user}	toggleAvatarPicker={this.toggleAvatarPicker.bind(this)}/>,
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
				<ConfirmBeforeUpdate display={this.state.display_password_confirm} toggleConfirmPasswordModal={this.toggleConfirmPasswordModal.bind(this)} 
				username={this.state.current_username} submitNewSettings = {this.submitNewSettings.bind(this)}/>
				<View style = {styles.top_bar}>
					<View style={styles.left}>
					</View>
					<Text style={styles.middle}> 
						Account Settings
					</Text> 

					<View style = {styles.right}>
						{(this.state.hasChanges && !this.state.hasPrivateChanges) && 
						<TouchableOpacity onPress = {this.handleSubmitPress.bind(this)}>
							<Text style = {styles.enabled_update}>
								Update
							</Text>
						</TouchableOpacity>}
						{this.state.hasPrivateChanges && 
						<TouchableOpacity onPress = {this.toggleConfirmPasswordModal.bind(this)}>
							<Text style = {styles.enabled_update}>
								Update
							</Text>
						</TouchableOpacity>}
						{!this.state.hasChanges && 
						<Text style = {styles.disabled_update}>
							Update
						</Text>}
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
	enabled_update : {
		color : '#90D7ED',
		fontWeight : 'bold'
	},
	disabled_update : {
		fontWeight : 'bold',
		color : 'silver'
	}
});
