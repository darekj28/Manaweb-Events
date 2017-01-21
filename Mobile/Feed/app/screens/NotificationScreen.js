import React from 'react';
import {Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';

import Notifications from '../components/Notifications'

let url = "https://manaweb-events.herokuapp.com"
let test_url = "http://0.0.0.0:5000"
export default class NotificationScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {current_username : '',
                  notifications : []};
  }

  seeNotifications() {
    fetch(url + "/mobileSeeNotifications", 
        {method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username : this.props.current_username })
        }
      ).then((value) =>{
        // console.log("notifications seen")
        // nothing needed to do here
      })
      .catch((error) => {
      console.log(error);
    });
  }
  componentDidMount() {
    this.seeNotifications.bind(this)();
  }
  componentWillUnmount() {
    this.props.getNotifications();
  }
  render() {
    return (
      <View style = {styles.container}>
        <View style = {{borderBottomColor: 'black', borderBottomWidth: 1}}>
            <Text style={styles.title}>Your Notifications</Text>
        </View>
        <Notifications current_user = {this.props.current_user}
           current_username = {this.props.current_username}
          notifications={this.props.notifications} navigator={this.props.navigator}/>
      </View>
      )
  }
}
const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'flex-start',
    padding : 10,
    paddingTop: 40
  },
  title : {
    fontSize : 20
  }
});