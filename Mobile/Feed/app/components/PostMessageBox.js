
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import renderIf from './renderIf'




export default class PostMessageBox extends Component {
    constructor(props) {
        super(props);
        this.state = {showText: true};

        // Toggle the state every second
        setInterval(() => {
            this.setState({ showText: !this.state.showText });
        }, 1000);
    }

    render() {
        // let display = this.state.showText ? this.props.text : ' ';
        return (
            <View style={styles.container}>
                {renderIf(this.state.showText,
                    <Text style = {styles.text}>
                        {this.props.text}
                    </Text>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'flex-start',
  },
  text: {
    fontSize: 25,
    color: 'black',
    textAlign: 'left',
    textAlignVertical: 'center',
  },
});
