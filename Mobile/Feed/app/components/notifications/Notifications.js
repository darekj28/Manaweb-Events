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
		if (this.props.notifications.length == 0)
			return ( 
					<Text style={{flex : 1, padding : 32}}> 
						You have no notifications.
					</Text>
				)

		else 
			return (
			<View style={{flex : 1,backgroundColor : '#e5e5e5'}}>
				<ScrollView contentContainerStyle={{backgroundColor : "#e5e5e5", paddingTop : 4}}           
				automaticallyAdjustContentInsets={false}
	            onScroll={() => {}}
	            scrollEventThrottle={200}
	            onPress={() => {Alert.alert('Scroll clicked')}}>
					{this.props.notifications.map(function(note, i) {
						return (<NotificationBox key={i} note={note} 
							current_username = {this.props.current_username} 
							current_user = {this.props.current_user}
							navigator = {this.props.navigator}/>);	
					}, this)}
				</ScrollView>
			</View>
				)
	}
}