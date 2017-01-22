import React from 'react';
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
const PROFILE_HEIGHT = 50
const PROFILE_WIDTH = 50
export default class OriginalPost extends React.Component {
    constructor() {
        super();
        this.state = {
            show : true
        };
    }
    toggleShow() {
        this.setState({ show : !this.state.show });
    }
	render() {
		var post = this.props.post;
		return (
			<View style={{  flex:1, flexDirection: 'row', justifyContent: 'flex-start',backgroundColor : 'white'}}>
                <View style={{paddingLeft : 8, paddingTop : 8, paddingBottom :8, justifyContent: 'flex-start'}}>
                    {post.avatar =='nissa' && <Image  style={styles.profile_image} source={require('../static/avatars/nissa.png')} />}
                    {post.avatar == 'chandra' && <Image  style={styles.profile_image} source={require('../static/avatars/chandra.png')} />}
                    {post.avatar == 'elspeth' && <Image  style={styles.profile_image} source={require('../static/avatars/elspeth.png')} />}
                    {post.avatar == 'nicol' && <Image  style={styles.profile_image} source={require('../static/avatars/nicol.png')} />}
                    {post.avatar == 'ugin' && <Image  style={styles.profile_image} source={require('../static/avatars/ugin.png')} />}
                    {post.avatar == 'jace' && <Image  style={styles.profile_image} source={require('../static/avatars/jace.png')} />}
                    {post.avatar == 'liliana' && <Image  style={styles.profile_image} source={require('../static/avatars/liliana.png')} />}
                    {post.avatar == 'ajani' && <Image  style={styles.profile_image} source={require('../static/avatars/ajani.png')} />}
                    {post.avatar == 'nahiri' && <Image  style={styles.profile_image} source={require('../static/avatars/nahiri.png')} />}
                    {post.avatar == 'gideon' && <Image  style={styles.profile_image} source={require('../static/avatars/gideon.png')} />}
                </View>
                <View style={{flex : 1,flexDirection : 'column', justifyContent: 'flex-start' }}>
                    <View style={{flexDirection: 'row', justifyContent : 'flex-start', flexWrap : 'wrap', 
                                            paddingLeft : 8, paddingRight : 8, paddingTop : 8}}> 
                        <Text style = {styles.text_name}>
                            {post.name}
                        </Text>
                        <Text style = {styles.text_userID}>
                            @{post.userID}
                        </Text>
                    </View>
                    {this.state.show && <View style={{justifyContent: 'flex-start', padding : 8, paddingBottom : 25, paddingTop : 25 }}>
                        <Text style = {styles.text_message}>
                            {post.postContent}
                        </Text>
                    </View>}
                    <View style={{justifyContent: 'flex-start', padding : 8, paddingTop : 16}}>
                        {!this.state.show && 
                        <TouchableWithoutFeedback onPress={this.toggleShow.bind(this)}><View><Text style = {styles.toggle_message}>
                            Show
                        </Text></View></TouchableWithoutFeedback>}
                        {this.state.show && 
                        <TouchableWithoutFeedback onPress={this.toggleShow.bind(this)}><View><Text style = {styles.toggle_message}>
                            Hide
                        </Text></View></TouchableWithoutFeedback>}
                    </View>
                    <View style={{justifyContent: 'flex-start', padding : 8, paddingLeft : 5}}>
                        <Text style={styles.text_time}>
                            {post.timeString}
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
        fontSize: 14,
        fontWeight: 'bold',
        textAlignVertical: 'top',
    },
    text_userID: {
        flex: 0,
        fontSize: 14,
        textAlignVertical: 'top',
        color : '#333333',
        paddingLeft : 4
    },
    text_time: {
        flex: 0,
        fontSize: 14,
        textAlignVertical: 'top',
        color : '#333333',
        paddingLeft : 4
    },
    text_message: {
        flex: 0,
        fontSize: 18,
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