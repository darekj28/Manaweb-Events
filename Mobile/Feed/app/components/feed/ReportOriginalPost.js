import React from 'react';
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, ScrollView, Alert, Image, Animated} from 'react-native';
const PROFILE_HEIGHT = 30
const PROFILE_WIDTH = 30
export default class ReportOriginalPost extends React.Component {
	render() {
		var post = this.props.post;
		return (
			<View style={{  flex:1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                <View style={{paddingLeft : 6, paddingTop : 6, paddingBottom :6, justifyContent: 'flex-start'}}>
                    {post.avatar =='nissa' && <Image  style={styles.profile_image} source={require('../../static/avatars/nissa.png')} />}
                    {post.avatar == 'chandra' && <Image  style={styles.profile_image} source={require('../../static/avatars/chandra.png')} />}
                    {post.avatar == 'elspeth' && <Image  style={styles.profile_image} source={require('../../static/avatars/elspeth.png')} />}
                    {post.avatar == 'nicol' && <Image  style={styles.profile_image} source={require('../../static/avatars/nicol.png')} />}
                    {post.avatar == 'ugin' && <Image  style={styles.profile_image} source={require('../../static/avatars/ugin.png')} />}
                    {post.avatar == 'jace' && <Image  style={styles.profile_image} source={require('../../static/avatars/jace.png')} />}
                    {post.avatar == 'liliana' && <Image  style={styles.profile_image} source={require('../../static/avatars/liliana.png')} />}
                    {post.avatar == 'ajani' && <Image  style={styles.profile_image} source={require('../../static/avatars/ajani.png')} />}
                    {post.avatar == 'nahiri' && <Image  style={styles.profile_image} source={require('../../static/avatars/nahiri.png')} />}
                    {post.avatar == 'gideon' && <Image  style={styles.profile_image} source={require('../../static/avatars/gideon.png')} />}
                    {post.avatar == 'rip' && <Image  style={styles.profile_image} source={require('../../static/avatars/rip.png')} />}
                </View>
                <View style={{flex : 1,flexDirection : 'column', justifyContent: 'flex-start' }}>
                    <View style={{flexDirection: 'row', justifyContent : 'flex-start', flexWrap : 'wrap', 
                                            paddingLeft : 6, paddingRight : 6, paddingTop : 6}}> 
                        <Text style = {styles.text_name}>
                            {post.name}
                        </Text>
                        {post.userID != "$DELETED_USER" && <Text style = {styles.text_userID}>
                            @{post.userID}
                        </Text>}
                    </View>
                    <View style={{justifyContent: 'flex-start', padding : 6, paddingBottom : 16, paddingTop : 16 }}>
                        <Text style = {styles.text_message} numberOfLines={2}>
                            {post.postContent}
                        </Text>
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
        fontSize: 12,
        fontWeight: 'bold',
        textAlignVertical: 'top',
    },
    text_userID: {
        flex: 0,
        fontSize: 12,
        textAlignVertical: 'top',
        color : '#696969',
        paddingLeft : 4
    },
    text_time: {
        flex: 0,
        fontSize: 12,
        textAlignVertical: 'top',
        color : '#696969',
        paddingLeft : 3
    },
    text_message: {
        flex: 0,
        fontSize: 14,
        textAlignVertical: 'top',
        color : '#333333'
    },
    toggle_message : {
        fontSize : 12,
        color : '#90D7ED'
    },
    profile_image: {
        width: PROFILE_WIDTH,
        height: PROFILE_HEIGHT,
        borderRadius: 4
    }
});