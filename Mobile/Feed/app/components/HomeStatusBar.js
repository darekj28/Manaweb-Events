'use strict'



import React, {Component} from 'react'
import ReactNative, {View} from 'react-native'


class HomeStatusBar extends Component {
	render() {
		return (
			<View style = {styles.statusBarBackground}>
				
			</View>
			)
		}
	}


const styles = ReactNative.StyleSheet.create({
	statusBarBackground: {
		height: 20,
		backgroundColor : 'white'
	}
})

module.exports = HomeStatusBar;