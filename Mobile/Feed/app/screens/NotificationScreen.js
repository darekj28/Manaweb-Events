import React from 'react';
import {Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';

import Notifications from '../components/Notifications'

export default class NotificationScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {current_user : {userID : "not initialized"},
      current_username : '',
                  notifications : []};
  }
  getNotifications() {
      let url = "https://manaweb-events.herokuapp.com"
      let test_url = "http://0.0.0.0:5000"
      fetch(test_url + "/mobileGetNotifications", 
        {method: "POST",
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ comment_id : this.state.current_user })
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
  componentDidMount() {
    this.getNotifications.bind(this)();
  }
  render() {
		return (
			<View style = {styles.container}>
        <Text>Your notifications</Text>
        <Notifications notifications={this.state.notifications} username={this.state.current_username} navigator={this.props.navigator}/>
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
  }
});