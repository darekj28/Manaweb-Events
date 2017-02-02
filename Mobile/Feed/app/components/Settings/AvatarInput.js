import React from 'react';
import {Component} from 'react'
import {Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';

export default class AvatarInput extends React.Component {
	render() {
		var currentAvatar = this.props.avatar;
		var currentAvatarLabel = currentAvatar.charAt(0).toUpperCase() + currentAvatar.slice(1);
		return(
				<View style = {styles.input_container}> 
					<Text style = {styles.settings_label}>
						AVATAR
					</Text>
					<View style={styles.settings_input_container}>
						<TouchableOpacity onPress = {this.props.toggleAvatarPicker}>
							<Text style = {styles.settings_input}> 
								{currentAvatarLabel}
							</Text>     
						</TouchableOpacity>             
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
		height : 40
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
});