import React from 'react';
import {Component} from 'react'
import {Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';

export default class PasswordModalLink extends React.Component {
	render() {
		return(
			<TouchableOpacity style = {{flex : 1, alignItems : 'center', justifyContent : 'center', padding : 5 }} onPress={this.props.togglePasswordModal}>
				<View style={styles.button}>
					<Text style = {styles.settings_clickable}> 
						Change your password
					</Text>
				</View>
			</TouchableOpacity>
		)
	}
}
const styles = StyleSheet.create({
	settings_clickable : {
		fontSize : 14,
		color: 'white',
	},
	button : {flex : 1, backgroundColor : '#90D7ED', alignItems: 'center', 
					justifyContent : 'center', borderRadius:60, borderColor : '#90D7ED', borderWidth : 1, 
					height : 30, width : 180}
});