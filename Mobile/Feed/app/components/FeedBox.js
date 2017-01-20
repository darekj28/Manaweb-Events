import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';

const PROFILE_HEIGHT = 50
const PROFILE_WIDTH = 50
const COMMENT_HEIGHT = 25
const DOT_WIDTH = 30
const DROP_DOWN_OPTIONS = ['Report Post']

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

var otherImages = {
    filter1: require('./res/icon1.png'),
    filter2: require('./res/icon2.png'),
    filter3: require('./res/icon3.png'),
    comments: require('./res/comments.png'),
    more: require('./res/dots.png'),
}

export default class FeedBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    _dropdown_renderRow(rowData, rowID, highlighted) {
        return (
            <TouchableHighlight underlayColor='silver'>
                <View style={styles.dropdown_row}>
                    <Text style={[styles.dropdown_row_text, highlighted && {color: 'black'}]}>
                        {DROP_DOWN_OPTIONS}
                    </Text>
                </View>
            </TouchableHighlight>
        );
    }

    _navigateToComment() {
        this.props.navigator.push({
            href: "Comment",
            current_username : this.props.current_username,
            comment_id : this.props.post['comment_id'],
            current_user: this.props.current_user
        })
    }

    handleFilterUser() {
      this.props.handleFilterUser(this.props.post['userID']);
    }

    render() {
        const post = this.props.post

        let commentIcon = require('./res/comments.png')
        return (
            <TouchableWithoutFeedback onPress={this._navigateToComment.bind(this)}>
                <View style={{  flex:1, flexDirection: 'row', justifyContent: 'flex-start',
                                borderBottomColor: 'silver', borderBottomWidth: 1}}>
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
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                            <View style={{flex : 1, height : 50, flexDirection: 'row', justifyContent : 'flex-start', flexWrap : 'wrap', 
                                        paddingLeft : 8, paddingBottom : 20, paddingTop : 8}}>
                                <TouchableHighlight onPress={this.handleFilterUser.bind(this)}>
                                    <Text style = {styles.text_name}>
                                        {post.name}
                                    </Text>
                                </TouchableHighlight>
                                <Text style = {styles.text_userID}>
                                    @{post.userID}
                                </Text>
                                <Text style = {styles.text_userID}>
                                    &#8226; {post.time}
                                </Text>
                            </View>

                            <View style={{flex: 0, margin: 1, paddingTop : 8, paddingRight : 6, flexDirection: 'row'}}>
                                { post.isTrade &&
                                    <Image  style={styles.feed_filter_image} source={otherImages.filter1} />
                                }
                                { post.isPlay &&
                                    <Image  style={styles.feed_filter_image} source={otherImages.filter2} />
                                }
                                { post.isChill &&
                                    <Image  style={styles.feed_filter_image} source={otherImages.filter3} />
                                }
                            </View>
                        </View>

                        <Text style = {styles.text_message} numberOfLines={6}>
                            {post.postContent}
                        </Text>

                        <View style={{flex: 1, paddingLeft : 8, flexDirection:'row'}}>
                            <Image  style={styles.comments_image} source={otherImages.comments} />
                            <Text style = {{color: '#90D7ED', fontSize : 12, marginTop : 2}}>
                                {post.numberOfComments}
                            </Text>
                            <View style = {{flex: 1}}>
                            </View>

                            <ModalDropdown
                                defaultIndex={0}
                                defaultValue={DROP_DOWN_OPTIONS[0]}
                                dropdownStyle={styles.dropdown_box}
                                options={DROP_DOWN_OPTIONS}
                                onSelect={(idx, value) => {Alert.alert('Report post pressed')}}
                                renderRow={this._dropdown_renderRow.bind(this)}
                                renderSeparator = {
                                    (sectionID, rowID, adjacentRowHighlighted) =>
                                    {/*This removes default gray line*/}}>

                                    <Image  style={styles.dropdown_image}
                                        source={otherImages.more}>
                                    </Image>
                            </ModalDropdown>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    text_name: {
        flex: 0,
        color: '#90D7ED',
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
    text_feed_type: {
        fontSize: 14,
        flex: 0,
        textAlignVertical: 'top',
        color: 'silver',
        borderColor: 'silver',
        borderWidth: 2,
        borderRadius: 1,
    },
    text_message: {
        fontSize: 14,
        textAlignVertical: 'top',
        flex: 0.8,
        paddingBottom : 20,
        paddingLeft : 8,
        paddingRight : 8,
        color : "#333333"
    },
    profile_image: {
        width: PROFILE_WIDTH,
        height: PROFILE_HEIGHT,
        borderRadius: 4,
        marginTop: 8,
        marginLeft: 8
    },
    feed_filter_image: {
        width: 14,
        height: 14,
        borderWidth: 0,
        padding: 4,
        borderColor: '#333333',
        tintColor: '#333333'
    },
    comments_image: {
        width: COMMENT_HEIGHT,
        height: COMMENT_HEIGHT,
        tintColor: '#90D7ED'
    },
    dropdown_box: {
        borderColor: 'gray',
        paddingTop: 2,
        paddingBottom: 2,
        paddingRight: 10,
        paddingLeft: 3,
        height: 35,
        borderWidth: 2,
        borderRadius: 4,
    },
    dropdown_row: {
        flex: 0,
        flexDirection: 'row',
    },
    dropdown_row_text: {
        marginHorizontal: 4,
        fontSize: 16,
        color: 'gray',
        textAlignVertical: 'center',
    },
    dropdown_image: {
        width: DOT_WIDTH,
        height: DOT_WIDTH / 2,
        tintColor: '#90D7ED',
        marginRight : 6,
        marginTop : 2
    },
});
