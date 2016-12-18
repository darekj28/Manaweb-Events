
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import renderIf from './renderIf'
import TextField from 'react-native-md-textinput';



const FILTER_BAR_SHORT = 0
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
        this.imageStyle = this.imageStyle.bind(this)
        this.setFilter = this.setFilter.bind(this)
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
    }

    imageStyle(index) {
        if (this.state.filter_enable[index]) {
            return {
                marginLeft: 8,
                marginRight: 8,
                width: 30,
                height: 30,
                tintColor: 'red'
            }
        } else {
            return {
                marginLeft: 8,
                marginRight: 8,
                width: 30,
                height: 30,
            }
        }

    }

    render() {
        let filterIcon1 = require('./res/icon1.png')
        let filterIcon2 = require('./res/icon2.png')
        let filterIcon3 = require('./res/icon3.png')

        if (!this.props.post_message_expanded) {
            return (
                <TouchableWithoutFeedback onPress={this.onClick}>
                    <View style={{flex:1, justifyContent: 'flex-start', borderBottomColor: '#000000',
                    borderBottomWidth: 1}}>
                        <Text style = {styles.text}>
                            {'Post a Message'}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        } else {
            return (
                <View style={{flex:1, justifyContent: 'flex-start', borderBottomColor: '#000000',
                borderBottomWidth: 1}}>
                <View style={[styles.container, {flex: 1}]}>
                    <TextInput
                        style = {styles.text_input}
                        autoFocus = {true}
                        multiline = {true}
                        numberOfLines = {1}
                        underlineColorAndroid={"transparent"}
                        onChangeText={(text) => this.setState({text})}
                        placeholder={'Post a Message'}
                        value={this.state.text}>
                    </TextInput>
                </View>
                <Animated.View style={[styles.container, {height: this.state.filter_bar_height}]}>
                    <View style = {{flex: 0.85, flexDirection:'row'}}>
                        <TouchableHighlight onPress={() => this.setFilter(0)}>
                            <Image  style={this.imageStyle(0)}
                                source={filterIcon1}>
                            </Image>
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => this.setFilter(1)}>
                            <Image  style={this.imageStyle(1)}
                                source={filterIcon2}>
                            </Image>
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => this.setFilter(2)}>
                            <Image  style={this.imageStyle(2)}
                                source={filterIcon3}>
                            </Image>
                        </TouchableHighlight>
                    </View>
                    <View style = {{flex: 0.15}}>
                        <TouchableHighlight onPress={() => Alert.alert('Posted')}>
                            <Text style={{fontSize: 15}}>
                                {'POST'}
                            </Text>
                        </TouchableHighlight>
                    </View>
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
      textAlignVertical: 'center',
      marginLeft: 4
  },
  text_input: {
      flex: 1,
      fontSize: 20,
      textAlignVertical: 'center',
  },
});
