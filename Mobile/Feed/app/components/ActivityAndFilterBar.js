import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View, TextInput, Alert, Image, TouchableHighlight} from 'react-native';


var titleIcon = require('./res/logo4.png')
const FILTER_HEIGHT = 25
const ACTIVITY_PROPORTION = 0.55

const FILTER_NAMES = ['Trade', 'Play', 'Chill']

var filters = {
    trade: require('./res/icon1.png'),
    play: require('./res/icon2.png'),
    chill: require('./res/icon3.png'),
}

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
        if (this.props.filter_enable[index]) {
            return FILTER_NAMES[index]
        } else {
            return ''
        }
    }


    render() {
        return (
            <View style={{flex:1, flexDirection: 'row', backgroundColor: this.props.color, alignItems:'center'}}>
                <View style={{flex: ACTIVITY_PROPORTION, margin: 5}}>
                    <Text style = {styles.activity_text}>
                        {this.props.activityText}
                    </Text>
                </View>

                <View style={{flex: 0, flexDirection: 'row'}}>
                    <TouchableHighlight onPress={() => this.props.onFilterChange(0)}>
                        <View style = {styles.filter_wrapper}>
                            <Image  style={this.imageStyle.bind(this)(0)} source={filters.trade} />
                            <Text style = {styles.filter_text}>
                                {this.filterText.bind(this)(0)}
                            </Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={() => this.props.onFilterChange(1)}>
                        <View style = {styles.filter_wrapper}>
                            <Image  style={this.imageStyle.bind(this)(1)} source={filters.play} />
                            <Text style = {styles.filter_text}>
                                {this.filterText.bind(this)(1)}
                            </Text>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={() => this.props.onFilterChange(2)}>
                        <View style = {styles.filter_wrapper}>
                            <Image  style={this.imageStyle.bind(this)(2)} source={filters.chill} />
                            <Text style = {styles.filter_text}>
                                {this.filterText.bind(this)(2)}
                            </Text>
                        </View>
                    </TouchableHighlight>
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
        margin: 2,
        marginLeft: 6,
        marginRight: 6
    },
    filter_image: {
      height: FILTER_HEIGHT,
      width: FILTER_HEIGHT,
    },
    filter_text: {
      color: 'white',
      fontSize: 12
    },
});
