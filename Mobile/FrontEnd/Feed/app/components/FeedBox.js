import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';

const PROFILE_HEIGHT = 40
const PROFILE_WIDTH = 40

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

export default class FeedBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
      const avatar_prefix = './res/'
      const avatar_extension = '.png'
      const post = this.props.post
      avatar_list = ['nissa', 'chandra', 'elspeth', 'nicol', 'ugin', 'jace', 'liliana', 'ajani', 'nahiri', 'gideon']
        return (
            <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start', borderBottomColor: 'silver',
                borderBottomWidth: 1}}>
                <View style={{flex: 0, justifyContent: 'flex-start'}}>
                    {post.avatar =='nissa' && <Image  style={styles.profile_image} source={profileImages.nissa} />}
                    {post.avatar == 'chandra' && <Image  style={styles.profile_image} source={profileImages.chandra} />}
                    {post.avatar == 'elspeth' && <Image  style={styles.profile_image} source={profileImages.elspeth} />}
                    {post.avatar == 'nicol' && <Image  style={styles.profile_image} source={profileImages.nicol} />}
                    {post.avatar == 'ugin' && <Image  style={styles.profile_image} source={profileImages.ugin} />}
                    {post.avatar == 'jace' && <Image  style={styles.profile_image} source={profileImages.jace} />}
                    {post.avatar == 'liliana' && <Image  style={styles.profile_image} source={profileImages.liliana} />}
                    {post.avatar == 'ajani' && <Image  style={styles.profile_image} source={profileImages.ajani} />}
                    {post.avatar == 'nahiri' && <Image  style={styles.profile_image} source={profileImages.nahiri} />}
                    {post.avatar == 'gideon' && <Image  style={styles.profile_image} source={profileImages.gideon} />}
                </View>


                <View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start'}}>
                    <View style={{flex: 1, height: PROFILE_HEIGHT, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Text style = {styles.text_name}>
                            {post.name}
                        </Text>

                        <Text style = {styles.text_userID}>
                            {'@' + post.userID}
                        </Text>
                        <Text style = {styles.text_userID}>
                            {'\u22c5' + post.timestamp}
                        </Text>
                        <View style={{flex: 1}}>
                        </View>

                        <View style={{flex: 0, margin: 1, flexDirection: 'row'}}>
                            { post.isTrade &&
                                <Image  style={styles.feed_filter_image} source={require('./res/icon1.png')} />
                            }
                            { post.isPlay &&
                                <Image  style={styles.feed_filter_image} source={require('./res/icon2.png')} />
                            }
                            { post.isChill &&
                                <Image  style={styles.feed_filter_image} source={require('./res/icon3.png')} />
                            }
                        </View>
                    </View>

                    <TouchableHighlight onPress={() => Alert.alert('Pressed')}>
                        <Text style = {styles.text_message} numberOfLines={5}>
                            {post.postContent}
                        </Text>
                    </TouchableHighlight>

                    <View style={{flex: 1, flexDirection:'row'}}>
                        <Image  style={styles.comments_image} source={require('./res/comments.png')} />
                        <Text style = {{color: 'mediumseagreen'}}>
                            {5}
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
      fontSize: 18,
      fontWeight: 'bold',
      textAlignVertical: 'top',
      marginLeft: 4,
      marginRight: 4,
      marginTop: 2
  },
  text_userID: {
      flex: 0,
      fontSize: 18,
      textAlignVertical: 'top',
      marginTop: 2,
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
    fontSize: 18,
    textAlignVertical: 'top',
    marginLeft: 4,
    flex: 0.8
  },
  profile_image: {
    width: PROFILE_WIDTH,
    height: PROFILE_HEIGHT,
    borderRadius: 2,
    marginTop: 4,
    marginLeft: 4
  },
  feed_filter_image: {
      width: 20,
      height: 20,
      borderWidth: 1,
      padding: 3,
      borderColor: '#333333',
      marginTop: 2,
      tintColor: 'green'
  },
  comments_image: {
      width: 30,
      height: 30,
      tintColor: 'mediumseagreen'
  }
});
