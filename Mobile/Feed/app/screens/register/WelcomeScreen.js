
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

	_getAvatar(avatar) {
		if (avatar) return avatar.charAt(0).toUpperCase() + avatar.slice(1)
	    else return ""
	}

	render() {
		avatar_image = this.getAvatarImage.bind(this)(this.props.current_user.avatar_name)
		return (
			<View style = {styles.container}>
				<View style = {{flex: 1, alignItems: 'center'}}>
					<Text style = {{paddingTop: 10, fontWeight: 'bold'}}>
						Welcome!
					</Text>
					<Text>
						Your avatar is {this._getAvatar.bind(this)(this.props.current_user.avatar_name)}
					</Text>
					<Text>
						You can change it in Settings.
					</Text>
				</View>
				<View style = {{flex: 0}}>
					{avatar_image}
				</View>
				<View style = {{flex : 1, alignItems : 'center'}}>
					<TouchableOpacity style={{flex : 1, justifyContent : 'center'}} onPress = {this._navigateToMenu.bind(this)}>
						<View style = {styles.button}>
							<Text style={styles.button_text}>Begin!</Text>
						</View>
					</TouchableOpacity>
				</View>
				<View style = {{flex : 3}}></View>
			</View>
		)
	}
}

let winSize = Dimensions.get('window')
const styles = StyleSheet.create({
	container : {
		flex: 1,
		flexDirection : "column",
		justifyContent: "flex-start",
		alignItems: "center"
	},
	avatar_image : {
    width : winSize.width * 0.4,
    height : winSize.height * 0.4,
    resizeMode : "contain"
  },
  button : {
	  flex : 1,
	  backgroundColor : '#90d7ed',
	  borderRadius:60,
	  justifyContent : 'center',
	  alignItems : 'center',
	  width : 100,
	  height : 35
  },
  button_text : {color : 'white', fontWeight : 'bold', fontSize : 14},
})

module.exports = WelcomeScreen
