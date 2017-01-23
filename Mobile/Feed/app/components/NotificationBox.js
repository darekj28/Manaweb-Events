import React from 'react';
import {Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';

var profileImages = {
    nissa: require('./static/avatars/nissa.png'),
    chandra: require('./static/avatars/chandra.png'),
    elspeth: require('./static/avatars/elspeth.png'),
    nicol: require('./static/avatars/nicol.png'),
    ugin: require('./static/avatars/ugin.png'),
    jace: require('./static/avatars/jace.png'),
    liliana: require('./static/avatars/liliana.png'),
    ajani: require('./static/avatars/ajani.png'),
    nahiri: require('./static/avatars/nahiri.png'),
    gideon: require('./static/avatars/gideon.png'),
};

const PROFILE_HEIGHT = 50
const PROFILE_WIDTH = 50

export default class NotificationBox extends React.Component {
	constructor(props) {
		super(props);
	}
	getNotificationFirst(note) {
        var also; var notification;
        if (note.isOP) { 
            also = "";
        }
        else {
            also = " also";
        }
        if (note.numOtherPeople > 1)
            notification = note.sender_name + " and " + note.numOtherPeople + " other people commented on "
        else if (note.numOtherPeople == 1)
            notification = note.sender_name + " and 1 other person commented on "
        else 
            notification = note.sender_name + also + " commented on "
        return notification;
    }
    getNotificationSecond(note) {
        var whose;
        if (note.isOP) { 
            whose = "your";
        }
        else {
            whose = note.op_name + "'s";
        }
        return whose + " post";
    }
    _navigateToComment() {
        this.props.navigator.push({
            href: "Comment",
            current_username : this.props.current_username,
            comment_id : this.props.note['comment_id'],
            current_user : this.props.current_user
        })
    }
    
    // trimTimeString(string){
    //     var len = string.length
    //     var trimString = string.substring(0, len - 5)
    //     return trimString
    // }

	render() {
		var note = this.props.note;
        var container_style;
        if (note.seen) {
            container_style = styles.notification_container;
            text_message = styles.text_message;
            text_time = styles.text_time;
            text_message_clickable = styles.text_message_clickable;
        }
        else {
            container_style = styles.unseen_notification_container;
            text_message = styles.unseen_text_message;
            text_time = styles.unseen_text_time;
            text_message_clickable = styles.unseen_text_message;
        }
	   	return(
	   		<TouchableOpacity onPress={this._navigateToComment.bind(this)}>
                <View style={container_style}>
                    <View style={{flex: 0, justifyContent: 'flex-start'}}>
                        {note.avatar =='nissa' && <Image  style={styles.profile_image} source={profileImages.nissa} />}
                        {note.avatar == 'chandra' && <Image  style={styles.profile_image} source={profileImages.chandra} />}
                        {note.avatar == 'elspeth' && <Image  style={styles.profile_image} source={profileImages.elspeth} />}
                        {note.avatar == 'nicol' && <Image  style={styles.profile_image} source={profileImages.nicol} />}
                        {note.avatar == 'ugin' && <Image  style={styles.profile_image} source={profileImages.ugin} />}
                        {note.avatar == 'jace' && <Image  style={styles.profile_image} source={profileImages.jace} />}
                        {note.avatar == 'liliana' && <Image  style={styles.profile_image} source={profileImages.liliana} />}
                        {note.avatar == 'ajani' && <Image  style={styles.profile_image} source={profileImages.ajani} />}
                        {note.avatar == 'nahiri' && <Image  style={styles.profile_image} source={profileImages.nahiri} />}
                        {note.avatar == 'gideon' && <Image  style={styles.profile_image} source={profileImages.gideon} />}
                    </View>
                    <View style={{flex : 1, flexDirection : 'column'}}>
                        <View style={{flex : 1, flexDirection : 'row',padding : 8}}>
                            <Text style = {text_message}>
                                {this.getNotificationFirst(note)} 
                                <Text style = {text_message_clickable}>
                                    {this.getNotificationSecond(note)}
                                </Text>
                                .
                            </Text>
                        </View>
                        <View style={{flex : 1, padding : 8}}>
                            <Text style = {text_time}>
                                {note.timeString}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
	   		);
	}
}
const styles = StyleSheet.create({
    notification_container :{
        flex:1,
        justifyContent: 'flex-start',
        flexDirection : 'row', 
        borderBottomColor: 'silver',
        borderBottomWidth: 1,
        backgroundColor : 'white'
    },
    text_time: {
        flex: 1,
        fontSize: 14,
        textAlignVertical: 'top',
        color: 'silver'
    },
    text_message: {
        fontSize: 14,
        flex : 1,
        textAlignVertical: 'top',
        color : '#333333'
    },
    text_message_clickable : {
        color : '#90D7ED'
    },
    unseen_text_time: {
        flex: 1,
        fontSize: 14,
        textAlignVertical: 'top',
        color: 'white'
    },
    unseen_text_message: {
        flex: 1,
        fontSize: 14,
        textAlignVertical: 'top',
        color : 'white'
    },
    unseen_notification_container: {
        flex:1,
        justifyContent: 'flex-start',
        flexDirection : 'row', 
        borderBottomColor: 'white',
        borderBottomWidth: 1,
        backgroundColor : '#90D7ED'
    },
    profile_image: {
        width: PROFILE_WIDTH,
        height: PROFILE_HEIGHT,
        borderRadius: 4,
        margin : 8
    }
});