import React from 'react';
import {Component} from 'react'
import {Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons';

export default class MakePostModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 	post : "",
						filter_enable: [false, false, false] };
	}
	handleChange(value) {
		this.setState({ post : value });
	}
	setFilter(index) {
        var newFilter = this.state.filter_enable;
        newFilter[index] = !newFilter[index];
        this.setState({filter_enable: newFilter});
        this.props.handleFilterPress(index);
    }
	handleSubmit() {
        if (this.state.post.length > 0)
            this.props.handlePostSubmit(this.state.post);
    }
	render() {
		var green = '#5cb85c';
        var red = '#d9534f';
		return(
			<Modal visible={this.props.display} animationType={"slide"} transparent={false}>
				<View style={{flex : 1, flexDirection:'column',justifyContent : 'flex-start'}}>
					<View style={styles.top_bar}>
						<View style={{flex: 0.2}}>
							<TouchableOpacity onPress = {this.props.toggleMakePostModal}>
								<Text style = {{color : '#90D7ED'}}>
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
						<View style={{flex: 0.6}}>
							<Text style = {{textAlign : 'center', fontWeight : 'bold'}}>
								Post a message
							</Text>
						</View>
						<View style={{flex: 0.2, justifyContent : 'flex-end', flexDirection : 'row'}}>
							<TouchableOpacity onPress = {this.handleSubmit.bind(this)}>
								<Text style = {{color : '#90D7ED'}}>
									Post
								</Text>
							</TouchableOpacity>
						</View>
					</View>
					<View style = {{flexDirection:'row'}}>
                        <TouchableOpacity style={styles.filter_wrapper} onPress={() => this.setFilter(0)}>
                            <View style={{flexDirection : 'row'}}>
                                {!this.state.filter_enable[0] && <Icon name = "md-swap" size = {25} color = {red}/>}
                            	{!this.state.filter_enable[0] && <Text style={styles.filter_label_neg}>Trade</Text>}
                                {this.state.filter_enable[0] && <Icon name = "md-swap" size = {25} color = {green}/>}
                            	{this.state.filter_enable[0] && <Text style={styles.filter_label_pos}>Trade</Text>}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.filter_wrapper} onPress={() => this.setFilter(1)}>
                            <View style={{flexDirection : 'row'}}>
                                {!this.state.filter_enable[1] && <Icon name = "ios-play" size = {25} color = {red}/>}
                            	{!this.state.filter_enable[1] && <Text style={styles.filter_label_neg}>Play</Text>}
                                {this.state.filter_enable[1] && <Icon name = "ios-play" size = {25} color = {green}/>}
                            	{this.state.filter_enable[1] && <Text style={styles.filter_label_pos}>Play</Text>}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.filter_wrapper} onPress={() => this.setFilter(2)}>
                            <View style={{flexDirection : 'row'}}>
                                {!this.state.filter_enable[2] && <Icon name = "md-time" size = {25} color = {red}/>}
                            	{!this.state.filter_enable[2] && <Text style={styles.filter_label_neg}>Chill</Text>}
                                {this.state.filter_enable[2] && <Icon name = "md-time" size = {25} color = {green}/>}
                            	{this.state.filter_enable[2] && <Text style={styles.filter_label_pos}>Chill</Text>}
                            </View>
                        </TouchableOpacity>
                    </View>
					<View style={styles.list_container}>
						<TextInput style = {styles.text_input}
                        	autoFocus = {true}
                        	multiline = {true}
                        	numberOfLines = {1}
                        	underlineColorAndroid={"transparent"}
                        	onChangeText={this.handleChange.bind(this)}
                        	placeholder={"What's happening?"}
                        	value={this.state.post}/>
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
	list_container: {
		flex : 1,
		paddingTop : 8,
		alignSelf : 'stretch',
		backgroundColor : 'white'
	},
	text_input: {
  	    flex: 1,
  	    paddingLeft : 16,
  	    paddingRight : 16,
  	    fontSize: 20,
  	    textAlignVertical: 'center',
  	},
  	filter_wrapper: {
  		flex : 1,
        alignItems : 'center',
        padding : 8
    },
    filter_label_neg : {
    	color : '#d9534f',
    	fontSize : 13,
    	paddingLeft : 4,
    	paddingTop : 4
    },
    filter_label_pos : {
    	color : '#5cb85c',
    	fontSize : 13,
    	paddingLeft : 4,
    	paddingTop : 4
    }
});