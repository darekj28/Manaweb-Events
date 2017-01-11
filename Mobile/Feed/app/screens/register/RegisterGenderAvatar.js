
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 'use strict';
import React from 'react';
import {Component} from 'react'
import {Alert, Picker, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import ViewContainer from '../../components/ViewContainer';
import HomeStatusBar from '../../components/HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';




const Item = Picker.Item;


class RegisterGenderAvatar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      avatar: "Jace",
      gender: "Male"
    }
    // this.submitAccountCreation = this.submitAccountCreation.bind(this);
  }



  _navigateToRegisterSubmit() {
    
    this.submitAccountCreation();

  }


  submitAccountCreation() {
    
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"


    fetch(url + "/mobileCreateProfile", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        avatar : this.state.avatar,
        gender : this.state.gender,
        birth_day : this.props.birth_day,
        birth_month: this.props.birth_month,
        birth_year: this.props.birth_year,
        password : this.props.password,
        email : this.props.email,
        userID: this.props.userID,
        first_name: this.props.first_name,
        last_name: this.props.last_name,
        password: this.props.password
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
        Alert.alert(
            "POST Response",
            "Response Body -> " + JSON.stringify(responseData.response)
        )
    })
    .done();
  }

  render() {
    return (
      <View style = {styles.container}>
              <TouchableOpacity onPress = {() => this.props.navigator.pop()}>
                <Icon name = "chevron-left" size = {30} />
              </TouchableOpacity>

              <Picker
                selectedValue={this.state.avatar}
                onValueChange={(avatar) => this.setState({avatar: avatar})}>
                <Picker.Item label="Jace" value="Jace" />
                <Picker.Item label="Ugin" value="Ugin" />
                <Picker.Item label="Gideon" value="Gideon" />
                <Picker.Item label="Nissa" value="Nissa" />
                <Picker.Item label="Elspeth" value="Elspeth" />
                <Picker.Item label="Chandra" value="Chandra" />
                <Picker.Item label="Ajani" value="Ajani" />
                <Picker.Item label="Nicol Bolas" value="Nicol" />
                <Picker.Item label="Liliana" value="Liliana" />
              </Picker>

              <Picker
                selectedValue={this.state.gender}
                onValueChange={(gender) => this.setState({gender: gender})}>
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>

              <TouchableHighlight style = {styles.button} onPress = {(event) => this.submitAccountCreation()}>
                <Text style = {styles.buttonText}>
                  Submit!
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

module.exports = RegisterGenderAvatar
