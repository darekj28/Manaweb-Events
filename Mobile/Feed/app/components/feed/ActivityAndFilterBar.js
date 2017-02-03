import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View, TextInput, Alert, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
var titleIcon = require('../res/logo4.png')
const FILTER_HEIGHT = 25
const ACTIVITY_PROPORTION = 0.5

const FILTER_NAMES = ['Trade', 'Play', 'Chill']

export default class LogoAndSearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    imageStyle(index) {
        if (!this.props.filter_enable[index]) {
            return {
                height: FILTER_HEIGHT,
                width: FILTER_HEIGHT,
                tintColor: '#d9534f'
            }
        } else {
            return {
                height: FILTER_HEIGHT,
                width: FILTER_HEIGHT,
                tintColor : '#5cb85c'
            }
        }
    }

    filterText(index) {
        // if (this.props.filter_enable[index]) {
            return FILTER_NAMES[index]
        // } else {
        //     return ''
        // }
    }


    render() {
        var green = '#5cb85c';
        var red = '#d9534f';
        return (
            <View style={{flex:1, flexDirection: 'row', backgroundColor: this.props.color, alignItems:'center', borderBottomWidth : 1, borderBottomColor : '#696969'}}>
                <View style={{flex: 5, margin: 3}}>
                    <View style = {styles.search_input_wrapper}>
                        <Icon style={{position : 'absolute', left :5, top : 3}} name = "ios-search" 
                                size = {20} color = "#696969"/>
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
                <View style={{flex: 0, flexDirection: 'row', paddingRight : 4}}>
                    <TouchableOpacity onPress={() => this.props.onFilterChange(1)}>
                        <View style = {styles.filter_wrapper}>
                            {!this.props.filter_enable[1] && <FAIcon name = "play" size = {18} color = {red}/>}
                            {this.props.filter_enable[1] && <FAIcon name = "play" size = {18} color = {green}/>}
                            <Text style = {styles.filter_text}>
                                {this.filterText.bind(this)(1)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.onFilterChange(0)}>
                        <View style = {styles.filter_wrapper}>
                            {!this.props.filter_enable[0] && <FAIcon name = "handshake-o" size = {18} color = {red}/>}
                            {this.props.filter_enable[0] && <FAIcon name = "handshake-o" size = {18} color = {green}/>}
                            <Text style = {styles.filter_text}>
                                {this.filterText.bind(this)(0)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.onFilterChange(2)}>
                        <View style = {styles.filter_wrapper}>
                            {!this.props.filter_enable[2] && <FAIcon name = "snowflake-o" size = {18} color = {red}/>}
                            {this.props.filter_enable[2] && <FAIcon name = "snowflake-o" size = {18} color = {green}/>}
                            <Text style = {styles.filter_text}>
                                {this.filterText.bind(this)(2)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
      width: FILTER_HEIGHT,
      height: FILTER_HEIGHT,
    },
    activity_text: {
      fontSize: 25,
      color: 'white',
      textAlign: 'left',
      textAlignVertical: 'center',
      justifyContent: 'center',
    },
    filter_wrapper: {
        margin: 1,
        marginLeft: 10,
        marginRight: 10,
        alignItems : 'center'
    },
    filter_image: {
      height: FILTER_HEIGHT,
      width: FILTER_HEIGHT,
    },
    filter_text: {
      color: '#696969',
      fontSize: 10,
      fontWeight : 'bold'
    },
    search_input: {
        flex: 1,
        fontSize: 14,
        padding: 5,
        paddingLeft : 25,
        paddingBottom : 7,
        textAlignVertical: 'center',
        height : 30
    },
    search_input_wrapper: {
        flexDirection: 'row',
        flex: 1.0,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 2,
        borderColor : '#696969',
        borderWidth : 1,
        borderRadius : 5,
        backgroundColor : 'white',
        marginRight: 5,
        height : 30
    }
});
