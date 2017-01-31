import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View, TextInput, Alert, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

var titleIcon = require('../res/logo4.png')
const LOGO_HEIGHT = 30
const SEARCH_BAR_PROPORTION = 0.5

export default class LogoAndSearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        return (
            <View style={{flex:1, flexDirection: 'row', backgroundColor: this.props.color, alignItems:'center'}}>
                <View style={{flex: 1 - SEARCH_BAR_PROPORTION, margin: 5}}>
                    <Image  style={styles.logo} source={titleIcon} />
                </View>
                <View style={{flex: SEARCH_BAR_PROPORTION, flexDirection: 'row', borderRadius : 5}}>
                    <View style = {styles.search_input_wrapper}>
                        <TextInput
                            style = {styles.search_input}
                            value = {this.props.searchText}
                            onChangeText={this.props.onChange}
                            autoFocus = {false}
                            multiline = {false}
                            numberOfLines = {1}
                            underlineColorAndroid={"transparent"}
                            placeholder={'Search posts...'}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
      width: LOGO_HEIGHT,
      height: LOGO_HEIGHT,
    },
    search_input: {
        flex: 1,
        fontSize: 16,
        padding: 4,
        textAlignVertical: 'center',
        height : 30
    },
    search_input_wrapper: {
        flexDirection: 'row',
        flex: 1.0,
        marginTop: 5,
        marginBottom: 5,
        padding: 0,
        borderRadius : 4,
        backgroundColor : 'white',
        marginRight: 5,
        height : 30
    }
});
