import React from 'react';
import {Component} from 'react'
import {TouchableWithoutFeedback, Item, Platform, Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,
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
			reason: "Spam",
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
				"Click OK to return to the feed",
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
		if (this.props.post == null) {return null;}
		else
		return(
			<Modal visible={this.props.display} animationType={"slide"} transparent={false} onRequestClose={() => {return}}>
				{Platform.OS == 'ios' && <View style = {{paddingTop : 20}} />}
				<TouchableWithoutFeedback onPress={() => dismissKeyboard()}>
				<View style={{flex : 1, flexDirection:'column',justifyContent : 'flex-start', backgroundColor : '#fbfbfb'}}>
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
						<ReportOriginalPost post={this.props.post}/>
					</View>
					<View style={styles.list_container}>
						<Text style = {styles.report_caption}>
								Select offense:
						</Text>
						<Picker style = {{flex : 1}} selectedValue={this.state.reason}
						onValueChange={this.handleReasonChange.bind(this)}>
								<Picker.Item  label= {"Inappropriate"} value = {"Inappropriate"} />
								<Picker.Item  label= {"Spam"} value = {"Spam"} />
								<Picker.Item  label= {"Other"} value = {"Other"} />
						</Picker>
					</View>
					<View style={styles.list_container}>
						<Text style = {styles.report_caption}>
							Additional comments:
						</Text>
						<View style = {{flex : 0.4, justifyContent: "flex-start", padding: 5, borderRadius : 5, borderColor : 'silver', borderWidth : 1}}>
							<TextInput
							style = {{flex : 1, padding: 5, fontSize : 16 }}
							onChangeText = {this.handleDescriptionChange.bind(this)}
							multiline = {true}
                        	numberOfLines = {1}
                        	underlineColorAndroid={"transparent"}
							maxLength = {40}
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
				</TouchableWithoutFeedback>
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
	}
});
