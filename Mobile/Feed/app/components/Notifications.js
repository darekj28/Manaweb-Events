import React from 'react';
import {Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';

import NotificationBox from './NotificationBox'

export default class Notifications extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<View>
				{this.props.notifications.map(function(note) {
					return (<NotificationBox note={note} username={this.props.username} navigator={this.props.navigator}/>);	
				})}
			</View>
			)
	}
}