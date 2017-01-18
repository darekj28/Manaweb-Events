import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View, TextInput, Alert, Image} from 'react-native';


var titleIcon = require('./res/logo4.png')
const FILTER_HEIGHT = 25
const ACTIVITY_PROPORTION = 0.55

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

    render() {

        return (
            <View style={{flex:1, flexDirection: 'row', backgroundColor: this.props.color, alignItems:'center'}}>
                <View style={{flex: ACTIVITY_PROPORTION, margin: 5}}>
                    <Text style = {styles.activity_text}>
                        {this.props.activityText}
                    </Text>
                </View>
                <View style={{flex: 0, flexDirection: 'row'}}>
                    <View style = {styles.filter_wrapper}>
                        <Image  style={styles.filter_image} source={filters.trade} />
                        <Text style = {styles.filter_text}>
                            {'Trade'}
                        </Text>
                    </View>
                    <View style = {styles.filter_wrapper}>
                        <Image  style={styles.filter_image} source={filters.play} />
                        <Text style = {styles.filter_text}>
                            {'Play'}
                        </Text>
                    </View>
                    <View style = {styles.filter_wrapper}>
                        <Image  style={styles.filter_image} source={filters.chill} />
                        <Text style = {styles.filter_text}>
                            {'Chill'}
                        </Text>
                    </View>
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
    },
});
