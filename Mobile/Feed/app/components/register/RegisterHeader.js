import React from 'react';
import {Component} from 'react'
import {Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';
import dismissKeyboard from 'react-native-dismiss-keyboard';

export default class RegisterHeader extends React.Component {
	render() {
		return (
			<View style={styles.top_bar}>
				<View style={{flex: 0.2}}>
					<TouchableOpacity onPress = {() => {dismissKeyboard(); this.props.navigator.pop()}}>
						<Icon name = "chevron-left" size = {20} color = '#90D7ED'/>
					</TouchableOpacity>
				</View>
				<View style={{flex: 0.6}}>
					
				</View>
				<View style={{flex: 0.2, justifyContent : 'flex-end', flexDirection : 'row'}}>
				</View>
			</View>
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
		alignItems : 'center',
		backgroundColor : 'white'
	},
	image : {
		width : 20,
		height : 20,
		alignSelf: 'center'
	}
})