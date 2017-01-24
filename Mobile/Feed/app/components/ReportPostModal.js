import React from 'react';
import {Component} from 'react'
import {Platform, Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';


export default class ReportPostModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			reason: "",
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
			reporting_user	: this.props.current_username,
			reported_user 	: this.props.post.poster_id
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
        	alert("Post Reported")
		})
	    .catch((error) => {
	      console.log(error);
	    }).done();
	}
	
	render() {
		return(
			<Modal visible={this.props.display} animationType={"slide"} transparent={false} onRequestClose={() => {return}}>
				{Platform.OS == 'ios' && <View style = {{paddingTop : 20}} />}
				
				<View style={{flex : 1, flexDirection:'column',justifyContent : 'flex-start'}}>
					<View style={styles.top_bar}>
						<View style={{flex: 0.2}}>
							<TouchableOpacity onPress = {this.props.toggleConfirmPasswordModal}>
								<Text style = {{color : '#90D7ED'}}>
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
						<View style={{flex: 0.6}}>
							<Text style = {{textAlign : 'center', fontWeight : 'bold'}}>
								Report 
							</Text>
						</View>
						<View style={{flex: 0.2, justifyContent : 'flex-end', flexDirection : 'row'}}/>
				{/*		<View style={{flex: 0.2, justifyContent : 'flex-end', flexDirection : 'row'}}>
							<TouchableOpacity onPress = {this.confirmPassword.bind(this)}>
								<Text style = {{color : '#90D7ED'}}>
									Update
								</Text>
							</TouchableOpacity>
						</View> */}
					</View>
					<View style={styles.list_container}>
						<Text>
							{this.props.post.postContent}
						</Text>
					</View>

					<View style = {{flex:  0.2}}>
						 <Picker style={styles.picker}  selectedValue= "Inappropriate">
				            <Item label="Spam" value="Spam" />
				            <Item label="Inappropriate" value="Inappropriate" />
				            <Item label="Other" value = "Other"/>
				          </Picker>
					</View>

					<View style = {{flex : 0.3}}>
						<TextInput onTextChange = {this.handleDescriptionChange.bind(this)} 
						placeholder = "Describe Why This Post Is Bad" />
					</View>

					<View style={{flex: 0.1}}>
							<TouchableOpacity onPress = {this.reportPost.bind(this)} style = {styles.update_button}>
								<Text style = {{textAlign : 'center', fontWeight : 'bold', 'color' : 'skyblue'}}>
									Report Post
								</Text>
							</TouchableOpacity>
					</View>
				</View>
				 
				 
			</Modal>
		)
	}
}

const window = Dimensions.get('window');
const styles = StyleSheet.create({
	picker: {

	},
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
	list_container: {
		flex : 0.2,
		paddingTop : 8,
		alignSelf : 'stretch',
		backgroundColor : '#fbfbfb'
	},
	update_button : {
		borderColor : "skyblue",
		borderWidth : 2,
		borderRadius : 5,
		padding: 6,
	}
});