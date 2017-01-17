import React from 'react';
import {Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';

export default class NotificationBox extends React.Component {
	constructor(props) {
		super(props);
	}
	getNotificationSyntax(note) {
        var whose; var also; var notification;
        if (note.isOP) { 
            whose = "your";
            also = "";
        }
        else {
            whose = note.op_name + "'s";
            also = "also";
        }
        if (note.numOtherPeople > 1)
            notification = note.sender_name + " and " + 
                note.numOtherPeople + " other people commented on " + whose + " post."
        else if (note.numOtherPeople == 1)
            notification = note.sender_name + 
                " and 1 other person commented on " + whose + " post."
        else 
            notification = note.sender_name + " " + also + " commented on " + whose + " post."
        return notification;
    }
  _navigateToComment() {
    this.props.navigator.push({
      href: "Comment",
      username : this.props.username,
      comment_id : this.props.note['comment_id']
    })
  }
	render() {
		var note = this.props.note;
		return(
			<TouchableWithoutFeedback onPress={this._navigateToComment.bind(this)}>
				<View style={{flex:1, justifyContent: 'flex-start', borderBottomColor: '#000000',
	                borderBottomWidth: 1}}>
                <View style={{flex: 1, flexDirection:'row', justifyContent: 'flex-start'}}>
	                <View style={{flex: 1, flexDirection:'row'}}>
	                    <Text style = {styles.text_message}>
	                        {this.getNotificationSyntax.bind(this)(note)} 
	                    </Text>
	                     <Text style = {styles.text_time}>
	                        {note.timeString}
	                    </Text>
	                </View>
                  </View>
	            </View>
            </TouchableWithoutFeedback>
			);
	}
}
const styles = StyleSheet.create({
  text_time: {
      flex: 1,
      fontSize: 16,
      textAlignVertical: 'top',
      marginLeft: 4,
      marginTop: 6,
      color: 'silver'
  },
  text_message: {
    flex: 1,
    fontSize: 16,
    textAlignVertical: 'top',
    marginLeft: 16,
    marginBottom : 30,
    color : '#353D41'
  }
});