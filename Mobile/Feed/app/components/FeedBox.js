import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';

const PROFILE_HEIGHT = 40
const PROFILE_WIDTH = 40



export default class FeedBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    _navigateToComment() {
      this.props.navigator.push({
        href: "Comment",
        username : this.props.username,
        comment_id : this.props.post['comment_id']
      })
    }
    render() {
      const avatar_prefix = './res/'
      const avatar_extension = '.png'
      const post = this.props.post
      avatar_list = ['nissa', 'chandra', 'elspeth', 'nicol', 'ugin', 'jace', 'liliana', 'ajani', 'nahiri', 'gideon']
        return (
            <TouchableWithoutFeedback onPress={this._navigateToComment.bind(this)}>
              <View style={{flex:1, justifyContent: 'flex-start', borderBottomColor: '#000000',
                borderBottomWidth: 1}}>
                <View style={{flex: 1, flexDirection:'row', justifyContent: 'flex-start'}}>
                      
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


                    <Text style = {styles.text_name}>
                        {post.name}
                    </Text>

                    <Text style = {styles.text_userID}>
                        {post.userID}
                    </Text>
                    <View style={{flex: 1}}/>
                    <View style={{flex: 0, margin: 1}}>
                        { post.isTrade && <Text style = {styles.text_feed_type}> Trade </Text> }
                        { post.isPlay && <Text style = {styles.text_feed_type}> Play </Text> }
                        { post.isChill && <Text style = {styles.text_feed_type}> Chill </Text> }
                    </View>
                    
                </View>
                <View style={{flex: 1, flexDirection:'row'}}>
                    <View style={{width: PROFILE_WIDTH}}>
                    </View>
                    <Text style = {styles.text_message}>
                        {post.postContent} 
                    </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
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
