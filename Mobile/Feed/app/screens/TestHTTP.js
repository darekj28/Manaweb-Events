
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {Alert, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../components/ViewContainer';
import HomeStatusBar from '../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import MyDatePicker from '../components/MyDatePicker';
import DatePicker from 'react-native-datepicker';






class TestHTTP extends Component {
  constructor(props) {
    super(props)

  }



  testPost(){
    fetch("http://0.0.0.0:5000/testMobileApi", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      body: 
        JSON.stringify(
        {
         test : "test string"
        })

    })
    .then((response) => response.json())
    .then((responseData) => {
        Alert.alert(
            "POST Response",
            "Response Body -> " + JSON.stringify(responseData)
        )
    })
    .done();
  }


 

  render() {
    return (
      <View style = {styles.container}>

              <TouchableHighlight style = {styles.button} onPress = {(event) => this.testPost()}>
                <Text style = {styles.buttonText}>
                  Test POST !
                </Text>
              </TouchableHighlight>
      </View>
    )
  }


}

const styles = StyleSheet.create({
  input : {
    color : "coral",
    height: 35,
    marginTop: 10,
    padding : 4,
    fontSize : 18,
    borderWidth : 1,
    borderColor : "#48bbec",
    marginLeft : 20,
    marginRight : 35
  },
  container: {
    flex:1,
    justifyContent: 'flex-start',
    padding : 10,
    paddingTop: 40
  },
  button :{
    height: 35,
    marginTop: 10,
    padding : 4,
    borderWidth : 1,
    borderColor : "#48bbec",
    marginLeft : 20,
    marginRight : 35,
    backgroundColor: "black"
  },
  buttonText : {
    justifyContent: "center",
    alignItems: "center",
    color: "white"
  }

});

module.exports = TestHTTP
