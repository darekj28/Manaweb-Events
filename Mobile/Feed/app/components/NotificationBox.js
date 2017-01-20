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
            also = " also";
        }
        if (note.numOtherPeople > 1)
            notification = note.sender_name + " and " + 
                note.numOtherPeople + " other people commented on " + whose + " post."
        else if (note.numOtherPeople == 1)
            notification = note.sender_name + 
                " and 1 other person commented on " + whose + " post."
        else 
            notification = note.sender_name + also + " commented on " + whose + " post."
        return notification;
    }
  _navigateToComment() {
    this.props.navigator.push({
      href: "Comment",
      current_username : this.props.current_username,
      comment_id : this.props.note['comment_id'],
      current_user : this.props.current_user

    })
  }

  // removes year
  trimTimeString(string){
    var len = string.length
    var trimString = string.substring(0, len - 6)
    return trimString

  }

	render() {
		var note = this.props.note;
    var container_style;
    if (note.seen) container_style = styles.notification_container;
    else container_style = styles.unseen_notification_container;
    // this will let us change the style if 
		return(
			<TouchableWithoutFeedback onPress={this._navigateToComment.bind(this)}>
            <View style = {container_style}>
	                    <Text style = {styles.text_message}>
	                        {this.getNotificationSyntax.bind(this)(note)} 
	                    </Text>
	                     <Text style = {styles.text_time}>
	                        {this.trimTimeString(note.timeString)}
	                    </Text>
	            </View>
      </TouchableWithoutFeedback>
			);
	}
}
const styles = StyleSheet.create({
  notification_container :{
    flexDirection : "row",
    flex:1,
    justifyContent: 'flex-start', 
    borderBottomColor: '#000000',
    borderBottomWidth: 1
  },
  text_time: {
      flex: .33,
      fontSize: 16,
      textAlignVertical: 'top',
      marginLeft: 4,
      marginTop: 8,
      marginBottom: 8,
      color: 'silver',
      padding : 8
  },
  text_message: {
    flex: 0.67,
    fontSize: 16,
    textAlignVertical: 'top',
    marginLeft: 4,
    marginTop : 8,
    marginBottom : 8,
    color : '#353D41',
    padding: 8
  },
  unseen_notification_container: {
    flexDirection : "row",
    flex:1,
    justifyContent: 'flex-start', 
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    backgroundColor : "coral"
  }
});