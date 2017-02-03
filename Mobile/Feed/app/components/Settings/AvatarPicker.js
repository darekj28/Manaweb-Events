import React from 'react';
import {Component} from 'react'
import {Platform, Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';

const avatar_list = ['nissa', 'chandra', 'elspeth', 'nicol', 'ugin', 'jace', 'liliana', 'ajani', 'nahiri', 'gideon']

export default class AvatarPicker extends React.Component {
	getAvatar(avatar) {
		var avatar = avatar.toLowerCase()
		if (avatar =='nissa') return    (<Image  style={styles.avatar_image} source={require('../../static/avatars/nissa.png')} />)
		if (avatar == 'chandra') return (<Image  style={styles.avatar_image} source={require('../../static/avatars/chandra.png')} />)
		if (avatar == 'elspeth') return (<Image  style={styles.avatar_image} source={require('../../static/avatars/elspeth.png')} />)
		if (avatar == 'nicol') return 	(<Image  style={styles.avatar_image} source={require('../../static/avatars/nicol.png')} />)
		if (avatar == 'ugin') return 	(<Image  style={styles.avatar_image} source={require('../../static/avatars/ugin.png')} />)
		if (avatar == 'jace') return  	(<Image  style={styles.avatar_image} source={require('../../static/avatars/jace.png')} />)
		if (avatar == 'liliana') return (<Image  style={styles.avatar_image} source={require('../../static/avatars/liliana.png')} />)
		if (avatar == 'ajani') return 	(<Image  style={styles.avatar_image} source={require('../../static/avatars/ajani.png')} />)
		if (avatar == 'nahiri') return 	(<Image  style={styles.avatar_image} source={require('../../static/avatars/nahiri.png')} />)
		if (avatar == 'gideon') return 	(<Image  style={styles.avatar_image} source={require('../../static/avatars/gideon.png')} />)
		if (avatar == 'rip') return 	(<Image  style={styles.avatar_image} source={require('../../static/avatars/rip.png')} />)
		return;
	}
	getAvatarList() {
		picker_list = [];
		for (var i = 0; i < avatar_list.length; i++) {
			var avatar = avatar_list[i]
			var label = avatar.charAt(0).toUpperCase() + avatar.slice(1);
			picker_list.push(<Picker.Item key = {i} label= {label} value = {avatar} />)
		}
		return picker_list;
	}
	handleChange(avatar) {
		var obj = {};
		obj["avatar"] = avatar;
		this.props.handleChange(obj);
	}
	render() {
		return(
			<Modal visible={this.props.display} animationType={"slide"} transparent={false} onRequestClose={() => {return}}>
				{Platform.OS == 'ios' && <View style = {{paddingTop : 20}} />}
				<View style={{flex : 1, flexDirection:'column',justifyContent : 'flex-start'}}>
					<View style={styles.top_bar}>
						<View style={{flex: 0.2}}></View>
						<View style={{flex: 0.6}}>
							<Text style = {{textAlign : 'center', fontWeight : 'bold'}}>
								Select your avatar
							</Text>
						</View>
						<View style={{flex: 0.2, justifyContent : 'flex-end', flexDirection : 'row'}}>
							<TouchableOpacity onPress = {this.props.toggleAvatarPicker}>
								<Text style = {{color : '#90D7ED'}}>
									Done
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style={{flex : 1, paddingTop : 16, backgroundColor : 'white'}}>
						<View style={{alignItems : 'center'}}>
							{this.getAvatar(this.props.avatar)}
						</View>
						<Picker selectedValue={this.props.avatar} onValueChange={this.handleChange.bind(this)}>
							{this.getAvatarList()}
						</Picker> 
					</View>
				</View>
			</Modal>
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
		borderBottomColor : '#e1e1e1',
		borderBottomWidth : 1,
		alignItems : 'center'
	},
	avatar_image : {
		width : 160,
		height : 160,
		borderRadius : 80
	},
});