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
            <View style={{flex:1, justifyContent: 'flex-start', borderBottomColor: '#000000',
                borderBottomWidth: 1}}>
                <View style={{flex: 1, flexDirection:'row', justifyContent: 'flex-start'}}>

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


                    <Text style = {styles.text_name}>
                        {post.name}
                    </Text>

                    <Text style = {styles.text_userID}>
                        {post.userID}
                    </Text>
                    <View style={{flex: 1}}/>
                    <View style={{flex: 0, margin: 1}}>
                        { post.isTrade && <Text style = {styles.text_feed_type}> Trade </Text>}
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
    borderRadius: 2,
    marginTop: 2,
    marginLeft: 2
  },
  feed_filter_image: {
      width: 20,
      height: 20,
      borderWidth: 3,
      tintColor: 'black'
  }
});
