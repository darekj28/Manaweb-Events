import React from 'react';
import {Component} from 'react'
import {Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';

export default class LogoutButton extends React.Component {
	render() {
		return(
			<TouchableOpacity onPress = {this.props.handleLogout} style = {{alignItems: 'center'}}>
				<Text style = {styles.settings_clickable}>
					Sign out
				</Text>
		 	</TouchableOpacity>
		)
	}
}
const styles = StyleSheet.create({
	settings_clickable : {
	fontSize : 16,
	color: '#90D7ED',
	padding : 8
	},
});