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
        <View style={styles.top_bar}>
            <View style={{flex: 1}}>
            </View>
            <Text style = {{flex : 2, textAlign : 'center', fontWeight : 'bold'}}>
                    Your Notifications
            </Text>
            <View style={{flex: 1, justifyContent : 'flex-end', flexDirection : 'row'}}>
            </View>
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
    justifyContent: 'flex-start'
  },
  top_bar : {
    flex : 0.1,
    paddingLeft : 10,
    paddingRight : 10,
    flexDirection : "row",
    justifyContent: "space-around",
    borderBottomColor : '#e1e1e1',
    borderBottomWidth : 1,
    alignItems : 'center'
  },
});