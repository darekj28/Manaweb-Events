
import React from 'react';
import {Component} from 'react'
import {Image, ScrollView, Alert, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions'

class WelcomeScreen extends Component {
	constructor(props) {
	    super(props)
	    this.state = {
		}
	}

	getAvatarImage(avatar) {
    if (avatar) avatar = avatar.toLowerCase()
    else avatar = ""
    if (avatar =='nissa') return ( <Image  style={styles.avatar_image} source={require('../../static/avatars/nissa.png')} />)
    if (avatar == 'chandra') return (<Image  style={styles.avatar_image} source={require('../../static/avatars/chandra.png')} />)
    if (avatar == 'elspeth') return (<Image  style={styles.avatar_image} source={require('../../static/avatars/elspeth.png')} />)
    if (avatar == 'nicol') return (<Image  style={styles.avatar_image} source={require('../../static/avatars/nicol.png')} />)
    if (avatar == 'ugin') return (<Image  style={styles.avatar_image} source={require('../../static/avatars/ugin.png')} />)
    if (avatar == 'jace') return  (<Image  style={styles.avatar_image} source={require('../../static/avatars/jace.png')} />)
    if (avatar == 'liliana') return (<Image  style={styles.avatar_image} source={require('../../static/avatars/liliana.png')} />)
    if (avatar == 'ajani') return (<Image  style={styles.avatar_image} source={require('../../static/avatars/ajani.png')} />)
    if (avatar == 'nahiri') return (<Image  style={styles.avatar_image} source={require('../../static/avatars/nahiri.png')} />)
    if (avatar == 'gideon') return (<Image  style={styles.avatar_image} source={require('../../static/avatars/gideon.png')} />)
    return;
  }
	_navigateToMenu(){
		this.props.navigator.push({
			href: "Feed",
		})
	}
	render() {
		avatar_image = this.getAvatarImage.bind(this)(this.props.current_user.avatar_name)
		return (
			<View style = {styles.container}>
				<Text> 
					Welcome! Your randomly selected avatar is {this.props.current_user.avatar_name}
					{//this.props.current_user.avatar_name
					}
				</Text>
				<TouchableOpacity onPress = {this._navigateToMenu.bind(this)}>
					<Text>
						Click here to continue to the main feed
					</Text>
				</TouchableOpacity>
				{avatar_image}
			</View>
		)
	}
}

let winSize = Dimensions.get('window')
const styles = StyleSheet.create({
	container : {
		padding : 30,
		flexDirection : "column",
		justifyContent: "center",
		alignItems: "center"
	},
	avatar_image : {
    width : winSize.width * 0.4,
    height : winSize.height * 0.4,
    resizeMode : "contain"
  },
})

module.exports = WelcomeScreen