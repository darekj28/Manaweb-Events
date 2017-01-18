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
  initializeUser(){
      AsyncStorage.getItem("current_username").then((value) => {
        if (value) this.setState({ current_username : value })
        this.getNotifications.bind(this)();
        this.seeNotifications.bind(this)();
      }).catch((error) => {
        console.log(error);
      });
  }
  getNotifications() {
      fetch(test_url + "/mobileGetNotifications", 
        {method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username : this.state.current_username })
        }
      ).then((response) => response.json())
      .then((responseData) => {
        if (responseData.notification_list.length > 0) {
              var feed = []
              for (var i = 0; i < responseData['notification_list'].length; i++) {
                var obj = responseData['notification_list'][i]
                  feed.unshift({
                    comment_id : obj['comment_id'],
                    timeString : obj['timeString'],
                    isOP : obj['isOP'],
                    numOtherPeople : obj['numOtherPeople'],
                    sender_name : obj['sender_name'],
                    op_name : obj['op_name']
                })
              }
              this.setState({notifications: feed})
          }    
    })
    .catch((error) => {
      console.log(error);
    });
  }
  seeNotifications() {
    fetch(test_url + "/mobileSeeNotifications", 
        {method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username : this.state.current_username })
        }
      ).catch((error) => {
      console.log(error);
    });
  }
  componentDidMount() {
    this.initializeUser.bind(this)();
  }
  render() {
    return (
      <View style = {styles.container}>
        <View style = {{borderBottomColor: '#000000', borderBottomWidth: 5}}>
            <Text style={styles.title}>Your Notifications</Text>
        </View>
        <Notifications current_user = {this.props.current_user}
           current_username = {this.props.current_username}
          notifications={this.state.notifications} navigator={this.props.navigator}/>
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