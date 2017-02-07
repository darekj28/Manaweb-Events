import React from 'react';
import {Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, Easing, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';

var profileImages = {
    nissa:      require('../../static/avatars/nissa.png'),
    chandra:    require('../../static/avatars/chandra.png'),
    elspeth:    require('../../static/avatars/elspeth.png'),
    nicol:      require('../../static/avatars/nicol.png'),
    ugin:       require('../../static/avatars/ugin.png'),
    jace:       require('../../static/avatars/jace.png'),
    liliana:    require('../../static/avatars/liliana.png'),
    ajani:      require('../../static/avatars/ajani.png'),
    nahiri:     require('../../static/avatars/nahiri.png'),
    gideon:     require('../../static/avatars/gideon.png'),
    rip:        require('../../static/avatars/rip.png')
};

const PROFILE_HEIGHT = 50
const PROFILE_WIDTH = 50

export default class NotificationBox extends React.Component {
	constructor(props) {
		super(props);
        this.animatedValue = new Animated.Value(0);
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
    getPostById() {
        let url = "https://manaweb-events.herokuapp.com"
        let test_url = "http://0.0.0.0:5000"
        fetch(url + "/mobileGetPostById",
            {method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment_id : this.props.note['comment_id'] })
            }
        ).then((response) => response.json())
        .then((responseData) => {
            var original_post = {
                postContent : responseData.post['body'],
                avatar      : responseData.post['avatar'],
                name        : responseData.post['first_name'] + ' ' + responseData.post['last_name'],
                userID      : responseData.post['poster_id'],
                time        : responseData.post['time'],
                comment_id  : responseData.post['comment_id'],
                unique_id   : responseData.post['unique_id'],
                timeString  : responseData.post['timeString'] 
            };
            this.props.navigator.push({
                href: "Comment",
                original_post : original_post,
                comment_id : this.props.note['comment_id'],
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }
    _navigateToComment() {
        this.getPostById.bind(this)();
    }
    animate () {
        this.animatedValue.setValue(0)
        Animated.timing(
            this.animatedValue,
            {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear
            }
        ).start(() => this.animatedValue.setValue(0))
    }
    componentDidMount() {
        if (!this.props.note.seen)
            this.animate();
    }
	render() {
		var note = this.props.note;
        const backgroundColor = this.animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ["white", "#8FD8D4", "white"]
        });
        const borderBottomColor = this.animatedValue.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: ["silver", "silver", "silver"]
        });
        const textColor = this.animatedValue.interpolate({ 
            inputRange: [0, 0.35, 0.5, 0.65, 1],
            outputRange: ["#333333", "#333333", "#333333", "#333333", "#333333"]
        });
        const timeColor = this.animatedValue.interpolate({ 
            inputRange: [0, 0.5, 1],
            outputRange: ["silver", "silver", "silver"]
        });
        const clickableColor = this.animatedValue.interpolate({ 
            inputRange: [0, 0.5, 1],
            outputRange: ["#90D7ED", "#90D7ED", "#90D7ED"]
        });
	   	return(
	   		<TouchableOpacity style={{marginBottom : 4}} onPress={this._navigateToComment.bind(this)}>
                <Animated.View style={{flex:1,justifyContent: 'flex-start',flexDirection : 'row', borderBottomColor,borderBottomWidth: 2,backgroundColor}}>
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
                            <Animated.Text style = {{fontSize: 14,flex : 1,textAlignVertical: 'top',color : textColor}}>
                                {this.getNotificationFirst(note)} 
                                <Animated.Text style = {{color : clickableColor}}>
                                    {this.getNotificationSecond(note)}
                                </Animated.Text>
                                .
                            </Animated.Text>
                        </View>
                        <View style={{flex : 1, padding : 8}}>
                            <Animated.Text style = {{fontSize: 14,flex : 1,textAlignVertical: 'top',color: timeColor}}>
                                {note.timeString}
                            </Animated.Text>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
	   		);
	}
}
const styles = StyleSheet.create({
    profile_image: {
        width: PROFILE_WIDTH,
        height: PROFILE_HEIGHT,
        borderRadius: 25,
        margin : 8
    }
});