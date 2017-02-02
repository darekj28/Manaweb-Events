
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';




const FILTER_BAR_SHORT = 35
const FILTER_BAR_TALL = 35
export default class PostMessageBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            filter_bar_height: new Animated.Value(FILTER_BAR_SHORT),
            filter_enable: [false, false, false]
        };
        this.onClick = this.onClick.bind(this)
        this.setFilter = this.setFilter.bind(this)
        this.handlePostTextChange = this.handlePostTextChange.bind(this);
        this.handlePostSubmit = this.handlePostSubmit.bind(this);
    }

    onClick() {
        let initial = this.props.post_message_expanded ? FILTER_BAR_TALL : FILTER_BAR_SHORT
        let final = this.props.post_message_expanded ? FILTER_BAR_SHORT : FILTER_BAR_TALL
        this.state.filter_bar_height.setValue(initial)
        Animated.timing(
            this.state.filter_bar_height, {toValue: final, duration: this.props.animateDuration}
        ).start();

        this.props.onClick();
    }

    setFilter(index) {
        var newFilter = this.state.filter_enable
        newFilter[index] = !newFilter[index]
        this.setState({filter_enable: newFilter})
        this.props.handleFilterPress(index);
    }
    handlePostTextChange (text) {
        this.props.handlePostTyping(text)
    }
    handlePostSubmit() {
        if (!this.props.canPost) {
            Alert.alert("You must wait 30 seconds before posting again.");
            return;
        }
        if (this.props.newPostContent.length > 0)
            this.props.handlePostSubmit(this.props.newPostContent);
    }

    render() {
        var green = '#90D7ED';
        var red = 'silver';
        if (!this.props.post_message_expanded) {
            return <View/>;
        } else {
            return (
                <View style={{flex:1, justifyContent: 'flex-start', borderBottomColor: '#696969',
                borderBottomWidth: 1, backgroundColor : 'white' }}>
                <View style={[styles.container, {flex: 1}]}>
                    <TextInput
                        style = {styles.text_input}
                        autoFocus = {true}
                        multiline = {true}
                        numberOfLines = {1}
                        underlineColorAndroid={"transparent"}
                        onChangeText={this.handlePostTextChange}
                        placeholder={"What's happening?"}
                        value = {this.props.newPostContent}
                    />
                </View>
                <Animated.View style={[styles.container, {alignItems : 'center', 
                        justifyContent : 'center', borderTopWidth : 1, borderTopColor : 'silver'}]}>
                    <View style = {{flex: 1, flexDirection:'row', borderRightWidth : 1, borderRightColor : 'silver'}}>
                        <TouchableOpacity style={{flex : 1}} onPress={() => this.setFilter(0)}>
                            <View style={styles.filter_wrapper}>
                                {!this.state.filter_enable[0] && <Icon name = "md-swap" size = {25} color = {red}/>}
                                {this.state.filter_enable[0] && <Icon name = "md-swap" size = {25} color = {green}/>}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{flex : 1}} onPress={() => this.setFilter(1)}>
                            <View style={styles.filter_wrapper}>
                                {!this.state.filter_enable[1] && <Icon name = "ios-play" size = {25} color = {red}/>}
                                {this.state.filter_enable[1] && <Icon name = "ios-play" size = {25} color = {green}/>}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={{flex : 1}} onPress={() => this.setFilter(2)}>
                            <View style={styles.filter_wrapper}>
                                {!this.state.filter_enable[2] && <Icon name = "md-time" size = {25} color = {red}/>}
                                {this.state.filter_enable[2] && <Icon name = "md-time" size = {25} color = {green}/>}
                            </View>
                        </TouchableOpacity>
                    </View>
                    {this.props.alert && <View style = {{flex: 1, alignItems : 'center', justifyContent : 'center'}}>
                        <Text style={{fontSize: 16, color : 'silver'}}>
                            Post
                        </Text>
                    </View>}
                    {!this.props.alert &&
                        <TouchableOpacity style={{flex : 1}} onPress={this.handlePostSubmit.bind(this)}>
                        <View style = {{flex: 1, backgroundColor: "#90D7ED", 
                                alignItems : 'center', justifyContent : 'center'}}>
                            <Text style={{fontSize: 16, fontWeight : 'bold', color : 'white'}}>
                                Post
                            </Text>
                        </View>
                        </TouchableOpacity>}
                </Animated.View>
            </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
    },
    text: {
        flex: 1,
        fontSize: 20,
        marginLeft: 4,
        color : '#90D7ED',
        textAlignVertical : 'center'
    },
    text_input: {
        flex: 1,
        fontSize: 18,
        paddingLeft : 5,
        paddingRight : 5
    },
    filter_wrapper: {
        alignItems : 'center',
        justifyContent : 'center'
    }
});