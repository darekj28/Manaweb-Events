import React from 'react';
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
const PROFILE_HEIGHT = 50
const PROFILE_WIDTH = 50
export default class CommentBox extends React.Component {
	render() {
		var comment = this.props.comment;
		return (
			<View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start',
                                borderBottomColor: 'silver', borderBottomWidth: 2,backgroundColor : 'white'}}>
                <View style={{flex: 0, paddingLeft : 8, paddingTop: 8, justifyContent: 'flex-start'}}>
                    {comment.avatar =='nissa' && <Image  style={styles.profile_image} source={require('../static/avatars/nissa.png')} />}
                    {comment.avatar == 'chandra' && <Image  style={styles.profile_image} source={require('../static/avatars/chandra.png')} />}
                    {comment.avatar == 'elspeth' && <Image  style={styles.profile_image} source={require('../static/avatars/elspeth.png')} />}
                    {comment.avatar == 'nicol' && <Image  style={styles.profile_image} source={require('../static/avatars/nicol.png')} />}
                    {comment.avatar == 'ugin' && <Image  style={styles.profile_image} source={require('../static/avatars/ugin.png')} />}
                    {comment.avatar == 'jace' && <Image  style={styles.profile_image} source={require('../static/avatars/jace.png')} />}
                    {comment.avatar == 'liliana' && <Image  style={styles.profile_image} source={require('../static/avatars/liliana.png')} />}
                    {comment.avatar == 'ajani' && <Image  style={styles.profile_image} source={require('../static/avatars/ajani.png')} />}
                    {comment.avatar == 'nahiri' && <Image  style={styles.profile_image} source={require('../static/avatars/nahiri.png')} />}
                    {comment.avatar == 'gideon' && <Image  style={styles.profile_image} source={require('../static/avatars/gideon.png')} />}
                </View>
                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start'}}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <View style={{flex : 0, height : 50, flexDirection: 'row', justifyContent : 'flex-start', flexWrap : 'wrap', 
                                            paddingLeft : 8, paddingRight : 8, paddingTop : 8}}>    
                            <Text style = {styles.text_name} numberOfLines={1}>
                                <Text>{comment.name}</Text> 
                                <Text style={styles.text_userID}> @{comment.userID} 
                                    <Text style={{flex : 1}}> &#8226; {comment.time} </Text>
                                </Text>
                            </Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <View style={{flex : 0, paddingLeft : 8, paddingRight : 8 }}>
                            <Text style = {styles.text_message}>
                                {comment.postContent} 
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

		);
	}
}
const styles = StyleSheet.create({
    text_name: {
        flex: 0,
        color: '#333333',
        fontSize: 14,
        fontWeight: 'bold',
        textAlignVertical: 'top',
    },
    text_userID: {
        flex: 1,
        fontSize: 13,
        fontWeight : 'normal',
        textAlignVertical: 'top',
        color : '#696969',
        paddingLeft : 4
    },
    text_message: {
        flex: 0,
        fontSize: 14,
        textAlignVertical: 'top',
        color : '#333333',
        marginBottom : 30
    },
    profile_image: {
        width: PROFILE_WIDTH,
        height: PROFILE_HEIGHT,
        borderRadius: 4
    }
});