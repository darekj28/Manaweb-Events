import React from 'react';
import {Component} from 'react'
import { TouchableOpacity, AppRegistry,StyleSheet,Text,View, TextInput, Alert, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

var titleIcon = require('../res/logo4.png')
const LOGO_HEIGHT = 30
const SEARCH_BAR_PROPORTION = 0.9

export default class LogoAndSearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {

        return (
            <View style={{flex:1, flexDirection: 'row', backgroundColor: this.props.color, alignItems:'center', paddingLeft:5, paddingRight : 5}}>
                <View style={{flex: 0.2, margin: 5}}>
                    <Image  style={styles.logo} source={titleIcon} />
                </View>
                <View style={{flex: 2, alignItems : 'center', overflow : 'hidden'}}>
                    <Text style = {styles.activity_text} >
                        {this.props.activityText}
                    </Text>
                </View>
                <View style={{flex: 0.2, flexDirection : 'row', justifyContent : 'flex-end', alignItems: 'center', flexDirection : 'row'}}>
                    <TouchableOpacity onPress={()=> this.props.expandMakePost()}>
                        <FAIcon name = "pencil-square-o" size = {22} color = "white"/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logo: {
      width: LOGO_HEIGHT,
      height: LOGO_HEIGHT,
      tintColor : 'white'
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
    },
    activity_text: {
      fontSize: 18,
      color: 'white',
    },
});
