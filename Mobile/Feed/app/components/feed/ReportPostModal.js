import React from 'react';
import {Component} from 'react'
import {KeyboardAvoidingView, TouchableWithoutFeedback, Item, Platform, Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,
	View,ListView,TouchableOpacity,TouchableHighlight, TextInput, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';
import ReportOriginalPost from './ReportOriginalPost';
import dismissKeyboard from 'react-native-dismiss-keyboard';

export default class ReportPostModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			reason: "Inappropriate",
			description: "",
		}
	}

	handleReasonChange(reason){
		this.setState({reason : reason})
	}

	handleDescriptionChange(description) {
		this.setState({description : description})
	}

	reportPost(){
		const url = "https://manaweb-events.herokuapp.com"
		const test_url = "http://0.0.0.0:5000"
		var obj = {
			unique_id 		: this.props.post.unique_id,
			reason 			: this.state.reason,
			description 	: this.state.description,
			reporting_user	: this.props.current_user.userID,
			reported_user 	: this.props.post.userID
		}
		fetch(url + "/mobileReportPost",
			{method: "POST",
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(obj)
			})
		.then((response) => response.json())
		.then((responseData) => {
			if (responseData.result == 'success'){
				Alert.alert(
				"Post reported",
				"Press OK to return to your feed",
				[
				{text: 'OK', onPress: () => this.handleReturn.bind(this)()}
				])
			}
		})
	    .catch((error) => {
	      console.log(error);
	    }).done();
	}

	handleReturn(){
		this.props.toggleReportModal()
	}

	render() {
		var content = <View style={{flex : 1, flexDirection:'column',justifyContent : 'flex-start', backgroundColor : '#fbfbfb'}}>
					<View style={styles.top_bar}>
						<View style={{flex: 0.2}}>
							<TouchableOpacity onPress = {this.handleReturn.bind(this)}>
								<Text style = {{color : '#90D7ED'}}>
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
						<View style={{flex: 0.6}}>
							<Text style = {{textAlign : 'center', fontWeight : 'bold'}}>
								Report post
							</Text>
						</View>
						<View style={{flex: 0.2, justifyContent : 'flex-end', flexDirection : 'row'}}/>
					</View>

					<View style={styles.list_container}>
						<Text style = {styles.report_caption}>
							Post to be reported:
						</Text>
						<ScrollView contentContainerStyle={styles.report_section}>
							<ReportOriginalPost post={this.props.post}/>
						</ScrollView>
					</View>
					<View style={styles.list_container}>
						<Text style = {styles.report_caption}>
								Select offense:
						</Text>
						<View style = {styles.report_section}>
							<Picker style = {{flex : 1, justifyContent : 'center'}} 
								itemStyle={{color : '#90D7ED', fontSize : 18, fontWeight : 'bold'}} selectedValue={this.state.reason}
							onValueChange={this.handleReasonChange.bind(this)}>
								<Picker.Item label= {"Inappropriate"} value = {"Inappropriate"} />
								<Picker.Item label= {"Spam"} value = {"Spam"} />
								<Picker.Item label= {"Other"} value = {"Other"} />
							</Picker>
						</View>
					</View>
					<View style={styles.list_container}>
						<Text style = {styles.report_caption}>
							Additional comments:
						</Text>
						<View style = {styles.report_section}>
							<TextInput
							style = {{flex : 1, padding: 5, fontSize : 16 }}
							onChangeText = {this.handleDescriptionChange.bind(this)}
							multiline = {true}
                        	numberOfLines = {1}
                        	underlineColorAndroid={"transparent"}
							/>
						</View>
					</View>
					<View style = {{flex : 0.05}}/>

					<View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
						<TouchableOpacity onPress = {this.reportPost.bind(this)} style = {styles.report_button}>
							<Text style = {styles.report_text}>
								Report Post
							</Text>
						</TouchableOpacity>
					</View>
					<View style = {{flex: 0.1}}></View>
				</View>
		if (this.props.post == null) {return null;}
		else
		return(
			<Modal visible={this.props.display} animationType={"slide"} transparent={false} onRequestClose={() => {return}}>
				{Platform.OS == 'ios' && <View style = {{paddingTop : 20}} />}
				{Platform.OS == "ios" && 
				<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
					<KeyboardAvoidingView style = {{flex: 1}} behavior="padding">
						{content}
					</KeyboardAvoidingView>
				</TouchableWithoutFeedback>}
				{Platform.OS != "ios" && 
				<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
					<View style={{flex : 1}}>
						{content}
					</View>
				</TouchableWithoutFeedback>}
			</Modal>
		)
	}
}

const window = Dimensions.get('window');
const styles = StyleSheet.create({
	report_caption : {
		fontWeight : 'bold',
		fontSize : 16
	},
	top_bar : {
		flex : 0,
		paddingLeft : 10,
		paddingRight : 10,
		paddingTop: 10,
		paddingBottom: 10,
		flexDirection : "row",
		justifyContent: "space-around",
		borderBottomColor : '#e1e1e1',
		borderBottomWidth : 1,
		alignItems : 'center',
		backgroundColor : 'white'
	},
	list_container: {
		flex : 1,
		padding : 8,
		alignSelf : 'stretch',
		backgroundColor : '#fbfbfb',
		justifyContent : 'flex-start'
	},
	report_button : {
		borderColor : "#90D7ED",
		backgroundColor: '#90D7ED',
		borderWidth : 2,
		borderRadius : 5,
		padding: 6,
		flexDirection: 'row',
		flex: 0
	},
	report_text: {
		textAlign : 'center',
		fontWeight : 'bold',
		color : 'white',
		flex: 0,
		paddingHorizontal: 10
	},
	report_section : {
		flex : 1,
		justifyContent: "flex-start", 
		backgroundColor : 'white', 
		padding: 5, 
		borderRadius : 5, 
		borderColor : 'silver', 
		borderWidth : 1,
		overflow : "hidden"
	}
});
