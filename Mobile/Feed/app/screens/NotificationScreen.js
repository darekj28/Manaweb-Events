import React from 'react';
import {ActivityIndicator, InteractionManager, Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,
		TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';

import Notifications from '../components/notifications/Notifications'

let url = "https://manaweb-events.herokuapp.com"
let test_url = "http://0.0.0.0:5000"
export default class NotificationScreen extends React.Component {
  constructor(props) {
      super(props);
      this.state = {renderPlaceholderOnly : true};
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
        )
        .catch((error) => {
        console.log(error);
      });
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
        this.setState({renderPlaceholderOnly: false});
    });
    this.props.getNotifications();
    this.seeNotifications.bind(this)();
  }
  _renderPlaceholderView() {
      return (
          <View style = {styles.container}>
        <ActivityIndicator style={[styles.centering, styles.white]} color="#cccccc" size="large"/>
      </View>
      );
  }
  render() {
    if (this.state.renderPlaceholderOnly) {
          return this._renderPlaceholderView();
      }
    return (
    <View style = {styles.container}>
        <View style={styles.top_bar}>
            <View style={{flex: 1}}>
            </View>
            <Text style = {{flex : 3, textAlign : 'center', fontWeight : 'bold'}}>
                    Your Notifications
            </Text>
            <View style={{flex: 1, justifyContent : 'flex-end', flexDirection : 'row'}}>
            </View>
        </View>
        <Notifications current_user = {this.props.current_user}
            current_username = {this.props.current_username}
            getNotifications = {this.props.getNotifications}
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
    borderBottomColor : 'silver',
    borderBottomWidth : 2,
    alignItems : 'center'
  },
  centering: {
    flex : 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  white: {
    backgroundColor: 'white',
  }
});