import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';

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
        var length = post.name.length + post.userID.length 
        


        return (
            <TouchableOpacity onPress={this._navigateToComment.bind(this)}>
                <View style={{flex:1, flexDirection: 'row', justifyContent: 'flex-start',
                                borderBottomColor: 'silver', borderBottomWidth: 1,backgroundColor : 'white'}}>
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
                            <View style={{flex : 1, height : 50, flexDirection: 'row', justifyContent : 'flex-start', 
                                        paddingLeft : 8, paddingBottom : 20, paddingTop : 8}}>
                                <Text style = {styles.text_name} numberOfLines={1}>
                                    <Text onPress={this.handleFilterUser.bind(this)}>{post.name}</Text> 
                                    <Text style={styles.text_userID}> @{post.userID} 
                                        <Text style={{flex : 1}}> &#8226; {post.time} </Text>
                                    </Text>
                                </Text>
                            </View>
                            <View style={{flex: 0, paddingTop : 8, paddingRight : 6, flexDirection: 'row'}}>
                                { post.isTrade && <View style={styles.feed_filter_image}><Icon name = "md-swap" size = {16} color = "#696969"/></View>}
                    
                                { post.isPlay && <View style={styles.feed_filter_image}><Icon name = "ios-play" size = {16} color = "#696969"/></View>}
                                
                                { post.isChill && <View style={styles.feed_filter_image}><Icon name = "md-time" size = {16} color = "#696969"/></View>}
                            </View>
                        </View>

                        <Text style = {styles.text_message} numberOfLines={6}>
                            {post.postContent}
                        </Text>

                        <View style={{flex: 1, paddingLeft : 8, flexDirection:'row'}}>
                            <View style={{flex : 1, flexDirection : 'row'}}>
                                <Icon name = "ios-text" size = {25} color = "#90D7ED" />
                                <Text style = {{color: '#90D7ED', fontSize : 12, marginTop : 5, marginLeft : 2}}>
                                    {post.numberOfComments}
                                </Text>
                            </View>
                            <View style={{flex : 0, paddingRight : 8}}>
                                <ModalDropdown
                                    defaultIndex={0}
                                    defaultValue={DROP_DOWN_OPTIONS[0]}
                                    dropdownStyle={styles.dropdown_box}
                                    options={DROP_DOWN_OPTIONS}
                                    onSelect={(idx, value) => {this.props.toggleReportModal(this.props.post)}}
                                    renderRow={this._dropdown_renderRow.bind(this)}
                                    renderSeparator = {
                                    (sectionID, rowID, adjacentRowHighlighted) =>
                                    {/*This removes default gray line*/}}>
                                
                                    <Icon name = "ios-more" size = {25} color = "#90D7ED"/>
                                </ModalDropdown>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    text_name: {
        flex: 0,
        color: '#90D7ED',
        fontSize: 14,
        fontWeight: 'bold',
        textAlignVertical: 'top'
    },
    text_userID: {
        flex: 1,
        fontSize: 13,
        fontWeight : 'normal',
        textAlignVertical: 'top',
        color : '#696969',
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
        paddingLeft : 4
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
    }
});
