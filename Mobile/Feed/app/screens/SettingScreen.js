import React from 'react';
import {Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class SettingScreen extends React.Component {
	render() {
		return (
			<View style = {styles.container}>
        <Text>Settings</Text>
            </View>
			)
	}
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'flex-start',
    padding : 10,
    paddingTop: 40
  }
});