
import React from 'react';
import {Component} from 'react'
import {Image, ScrollView, Alert, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';

class WelcomeScreen extends Component {
	constructor(props) {
	    super(props)
	    this.state = {
		}
	}

	_navigateToMenu(){
		this.props.navigator.push({
			href: "Menu",
		})
	}

	render() {
		return (
			<View style = {styles.container}>
				<Text> 
					Welcome! Your randomly selected avatar is 
				</Text>
				<TouchableOpacity onPress = {this._navigateToMenu.bind(this)}>
					<Text>
						Click here to continue to the main feed
					</Text>
				</TouchableOpacity>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	container : {
		padding : 30,
		flexDirection : "column",
		justifyContent: "center",
		alignItems: "center"
	}
})

module.exports = WelcomeScreen