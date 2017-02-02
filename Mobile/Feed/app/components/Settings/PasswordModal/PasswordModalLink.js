import React from 'react';
import {Component} from 'react'
import {Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';

export default class PasswordModalLink extends React.Component {
	render() {
		return(
			<TouchableOpacity style = {{alignItems : 'center'}} onPress={this.props.togglePasswordModal}>
				<Text style = {styles.settings_clickable}> 
					Change your password
				</Text>
			</TouchableOpacity>
		)
	}
}
const styles = StyleSheet.create({
	settings_clickable : {
	fontSize : 18,
	color: '#90D7ED',
	padding : 8
	},
});