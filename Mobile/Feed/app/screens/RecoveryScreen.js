import React from 'react';
import {Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class RecoveryScreen extends React.Component {
	constructor(){
		super();
		this.state = {
			email_or_phone : ""
		};
	}
	handleChange(input) {
		this.setState({ email_or_phone : input });
	}
	handleSubmit() {

	}
	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity onPress={() => this.props.navigator.pop()}>
	                <Icon name="chevron-left" size={30} />
	            </TouchableOpacity>
				<View style={styles.input_box}> 
					<TextInput onChangeText={this.handleChange.bind(this)}
	                style={styles.input_text}
	                placeholder="Email or phone number"/>
	            </View>
	            <TouchableHighlight style = {styles.submit} onPress = {this.handleSubmit.bind(this)}>
                	<Text style = {styles.submit_text}>
                  	Login!
                	</Text>
                </TouchableHighlight>

			</View>
			)
	}
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection : "column",
    justifyContent: 'space-between',
    padding : 10,
    paddingTop: 40,
    backgroundColor: "white",
    alignItems: 'flex-start'
  },
  input_box: {
    flexDirection : "row",
    flex: 0.075,
    borderColor: "skyblue",
    borderWidth : 1,
    borderRadius : 5
  },
  input_text :{
    flex: 0.65,
  },
  submit : {
    flex: 0.25,
  },
  submit_text : {
    borderColor : "skyblue",
    borderWidth : 1,
    borderRadius : 5,
    textAlign : "center"
  }
});