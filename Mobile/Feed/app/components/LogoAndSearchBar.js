import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View, TextInput, Alert, Image} from 'react-native';


var titleIcon = require('./res/logo4.png')
const LOGO_HEIGHT = 30
const SEARCH_BAR_PROPORTION = 0.7

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
                <View style={{flex: SEARCH_BAR_PROPORTION, flexDirection: 'row'}}>
                    <View style = {styles.search_input_wrapper}>
                        <TextInput
                            style = {styles.search_input}
                            value = {this.props.searchText}
                            onChangeText={this.props.onChange}
                            autoFocus = {false}
                            multiline = {false}
                            numberOfLines = {1}
                            underlineColorAndroid={"transparent"}
                            placeholder={'Search'}
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
    text_input: {
        flex: 1,
        fontSize: 25,
        padding: 2,
        textAlignVertical: 'center'
    },
    search_input_wrapper: {
        flexDirection: 'column',
        flex: 1.0,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: 'white',
        padding: 0,
        borderRadius: 5,
        marginRight: 5
    }
});
