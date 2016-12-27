import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';

const PROFILE_HEIGHT = 40
const PROFILE_WIDTH = 40

var profileImages = [
    require('./res/prof1.png'),
    require('./res/prof2.png'),
    require('./res/prof3.png')
];

export default class FeedBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        return (
            <View style={{flex:1, justifyContent: 'flex-start', borderBottomColor: '#000000',
                borderBottomWidth: 1}}>
                <View style={{flex: 1, flexDirection:'row', justifyContent: 'flex-start'}}>
                    <Image  style={styles.profile_image}
                        source={profileImages[this.props.image_ID]}>
                    </Image>
                    <Text style = {styles.text_name}>
                        {'Blob Blob'}
                    </Text>
                    <Text style = {styles.text_userID}>
                        {'@blobblob'}
                    </Text>
                    <View style={{flex: 1}}/>
                    <View style={{flex: 0, margin: 1}}>
                        <Text style = {styles.text_feed_type}>
                            {'Trade'}
                        </Text>
                    </View>
                </View>
                <View style={{flex: 1, flexDirection:'row'}}>
                    <View style={{width: PROFILE_WIDTH}}>
                    </View>
                    <Text style = {styles.text_message}>
                        {this.props.post.postContent} 
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
