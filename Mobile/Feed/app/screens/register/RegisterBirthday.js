
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import MyDatePicker from '../../components/MyDatePicker';
import DatePicker from 'react-native-datepicker';





class RegisterBirthday extends Component {
  constructor(props) {
    super(props)
    this.state = {
      date:"2016-01-02"
    }
  }



  _navigateToRegisterGenderAvatar(email) {
    var birth_day = this.state.date.split('-')[2]
    var birth_month = this.state.date.split('-')[1]
    var birth_year = this.state.date.split('-')[0]
    this.props.navigator.push({
    href: "RegisterGenderAvatar",
    birth_day : birth_day,
    birth_month: birth_month,
    birth_year: birth_year,
    password : this.props.password,
    email : this.props.email,
    userID: this.props.userID,
    first_name: this.props.first_name,
    last_name: this.props.last_name,
    password: this.props.password
    })
  }

  render() {
    return (
      <View style = {styles.container}>

              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {30} />
              </TouchableOpacity>

              <Text> Bro what's your birthday </Text>
              <DatePicker
              style={{width: 200}}
              date={this.state.date}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate="1950-05-01"
              maxDate="2016-06-01"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  marginLeft: 36
                }
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {this.setState({date: date})}}
            />

              <TouchableHighlight style = {styles.button} onPress = {(event) => this._navigateToRegisterGenderAvatar(this.state.password)}>
                <Text style = {styles.buttonText}>
                  Next!
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

module.exports = RegisterBirthday
