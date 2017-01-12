import React from 'react';
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
const PROFILE_HEIGHT = 40
const PROFILE_WIDTH = 40
export default class CommentBox extends React.Component {
	render() {
		var comment = this.props.comment;
		return (
			<View style={{flex:1, justifyContent: 'flex-start', borderBottomColor: '#000000',
                borderBottomWidth: 1}}>
                <View style={{flex: 1, flexDirection:'row', justifyContent: 'flex-start'}}>
                      
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
                    <Text style = {styles.text_name}>
                        {comment.name}
                    </Text>
                    <Text style = {styles.text_userID}>
                        {comment.userID}
                    </Text>
                    <View style={{flex: 1}}/>
                    
                </View>
                <View style={{flex: 1, flexDirection:'row'}}>
                    <View style={{width: PROFILE_WIDTH}}>
                    </View>
                    <Text style = {styles.text_message}>
                        {comment.commentContent} 
                    </Text>
                </View>
            </View>
			);
	}
}
const styles = StyleSheet.create({
  text_name: {
      flex: 0,
      fontSize: 18,
      fontWeight: 'bold',
      textAlignVertical: 'top',
      marginLeft: 4,
      marginTop: 2
  },
  text_userID: {
      flex: 0,
      fontSize: 18,
      textAlignVertical: 'top',
      marginLeft: 4,
      marginTop: 2,
      color: 'silver'
  },
  text_feed_type: {
      fontSize: 16,
      flex: 0,
      textAlignVertical: 'top',
      color: 'silver',
      borderColor: 'silver',
      borderWidth: 2,
      borderRadius: 1,
      marginTop: 1,
      marginRight: 3,
      marginLeft: 2,
  },
  text_message: {
    flex: 1,
    fontSize: 18,
    textAlignVertical: 'top',
    marginLeft: 4
  },
  profile_image: {
    width: PROFILE_WIDTH,
    height: PROFILE_HEIGHT,
    marginTop: 2,
    marginLeft: 2
  },
});