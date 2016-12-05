/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView
} from 'react-native';

import ViewContainer from './app/components/ViewContainer';

import HomeStatusBar from './app/components/HomeStatusBar';
import _ from 'lodash'



const people = [
  {userID : "darekj", deck : "UB Control"},

  {userID : "alleny", deck : "RW Vehicles"},
  {userID : "elic", deck : "face"}
]


export default class Manaweb extends Component {
  constructor(props) {
    super(props)
    var ds = new ListView.DataSource({rowHasChanged: (r1, rs) => r1 != r2})
    this.state = {
      peopleDataSource : ds.cloneWithRows(people)
    }
  }

  render() {
    return (
      <ViewContainer>
      <HomeStatusBar/>
        <Text> {'Welcome to Manaweb'} </Text>
        <ListView 
          style = {{ marginTop: 100 }}
          dataSource =  {this.state.peopleDataSource}
          renderRow = { (person) =>  { return this._renderPersonRow(person) } } />
          
      </ViewContainer>
    )
}

_renderPersonRow(person) {
  return (
      <View style = {styles.personRow}>
        <Text style = { styles.personName }> {_.capitalize(person.userID)}  </Text>
         
        </View>
    )
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },

  personRow:{
    flexDirection : "row",
    justifyContent: "center"
  },

  personMoreIcon: {
    color: "green",
    height: 20,
    width: 20
  }
});

AppRegistry.registerComponent('Manaweb', () => Manaweb);
