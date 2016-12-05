'use strict'



import React, {Component} from 'react'
import ReactNative, {View} from 'react-native'



class ViewContainer extends Component {
	render() {
		return (

			<View style = {styles.viewContainer} >
				{this.props.children}
			</View>
			)
		}
	}


const styles = ReactNative.StyleSheet.create({
	viewContainer: {
		flex: 1,
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "stretch",
		
	}
})

module.exports = ViewContainer;