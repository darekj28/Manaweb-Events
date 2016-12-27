
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image, Animated, TouchableWithoutFeedback, ScrollView} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionBar from '../actionbar/ActionBar'; // downloaded from https://github.com/Osedea/react-native-action-bar
// import Menu, {SubMenu, MenuItem} from 'rc-menu'; // rc-menu https://github.com/react-component/menu MIT liscence
// import ReactDOM from 'react-dom';
// import ModalPicker from 'react-native-modal-picker' // https://www.npmjs.com/package/react-native-modal-picker
import ModalDropdown from 'react-native-modal-dropdown'; // https://github.com/sohobloo/react-native-modal-dropdown
import PostMessageBox from '../components/PostMessageBox'
import FeedBox from '../components/FeedBox'
import Feed from '../components/Feed'

const ACTIVITY_BAR_HEIGHT = 40
const ACTIVITY_BAR_COLOR = 'black'
const POST_MESSAGE_HEIGHT_SHORT = 50
const POST_MESSAGE_HEIGHT_TALL = 150
const ANIMATE_DURATION = 700
class FeedScreen extends Component {


  static populateActivities() {
     return ['SCG Atlanta', 'Activity 2', 'Activity 3', 'Activity 4']
  }

  constructor(props) {
    super(props)
    this.state = {
      login_id : "",
      password: "",
      activity_index: 0,
      post_message_expanded: false,
      post_message_height: new Animated.Value(50),
      current_username: "",
      feed: [],
      currentUser: {},
      test: ""
    }
    this.selectActivitiesAction = this.selectActivitiesAction.bind(this)
    this.postMessagePressed = this.postMessagePressed.bind(this)
    this._activities = FeedScreen.populateActivities()
    this.initializeFeed = this.initializeFeed.bind(this);
  }


  async initializeFeed() {
    let url = "https://manaweb-events.herokuapp.com"
    let test_url = "http://0.0.0.0:5000"
    let response = await fetch(test_url + "/mobileGetPosts", {method: "POST",
          headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        feed_name: "BALT"
      })
    })
    let responseData = await response.json();
    

    this.setState({test: "Test changed"})
    if (responseData.post_list.length > 0) {
        var feed = []
        for (var i = 0; i < responseData['post_list'].length; i++) {
          var obj = responseData['post_list'][i]
          feed.unshift({
            postContent : obj['body'],
            avatar    : obj['avatar'],
            name    : obj['first_name'] + ' ' + obj['last_name'],
            userID    : obj['poster_id'],
            time      : obj['time'],
            isTrade   : obj['isTrade'],
            isPlay    : obj['isPlay'],
            isChill   : obj['isChill'],
            comment_id  : obj['comment_id'],
            unique_id   : obj['unique_id'],
            numberOfComments : obj['numComments']
          })
        }
        this.setState({feed: feed})
        this.setState({test: "Test changed"})
    } 

      
  }


  handleTitlePress() {
    Alert.alert('Manaweb is pressed');
  };

  handleRightAction() {
    Alert.alert('Menu pressed')
  }

  selectActivitiesAction() {
    // Alert.alert('Select which activity')
    this.setState({select_activity: !this.state.select_activity})
  }

  postMessagePressed() {
      let initial = this.state.post_message_expanded ? POST_MESSAGE_HEIGHT_TALL : POST_MESSAGE_HEIGHT_SHORT
      let final = this.state.post_message_expanded ? POST_MESSAGE_HEIGHT_SHORT : POST_MESSAGE_HEIGHT_TALL
      this.setState({
          post_message_expanded : !this.state.post_message_expanded  //Step 2
      });
      this.state.post_message_height.setValue(initial)
      Animated.timing(          // Uses easing functions
          this.state.post_message_height, {toValue: final, duration: ANIMATE_DURATION}
      ).start();
  }

  collapseMessageBox() {
      dismissKeyboard();
      if (this.state.post_message_expanded) {
          // We only toggle the message box when it's in the expanded state to close it
          this.postMessagePressed()
      }
  }

  async initializeUsername(){
     let value = await AsyncStorage.getItem("current_username")
        if (value == null) {
          this.setState({"current_username" : ""})
        }
        else {
          this.setState({"current_username" : value})
        }
  }


  async initializeUserInfo(){
    let url = "https://manaweb-events.herokuapp.com"
    let test_url = "http://0.0.0.0:5000"
    let response = await fetch(url + "/mobileGetCurrentUserInfo", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        userID: this.state.current_username
      })
    })
    let responseData = await response.json()
    this.setState({currentUser: responseData['this_user']})
  
  }

  componentWillMount() {
      this.initializeUsername().done();
      this.initializeUserInfo().done();
      this.initializeFeed().done();
        // AsyncStorage.getItem("current_username").then((value) => {
        //   if (value == null){
        //     this.setState({"current_username" : ""})
        //   } else {
        //     this.setState({"current_username": value});
        //   }
        // }).done();
  }


  render() {



    let dropdownIcon = require('./res/down_arrow.png')
    return (

        <View style = {styles.container}>
            <TouchableWithoutFeedback onPress={() => this.collapseMessageBox()}>
                <ActionBar
                    backgroundColor={'#3B373C'}
                    leftIconName={'none'}
                    title={'Manaweb'}
                    titleStyle={styles.titleTextLarge}
                    onTitlePress={this.handleTitlePress}
                    onRightPress={this.handleRightAction}
                    onLeftPress = {() => {}}
                    rightIconName={'menu'}
                />
            </TouchableWithoutFeedback>

              {
                this.state.current_username == "" ?
                <Text>
                  No one is logged in right now...please login!
                  </Text>
                  :
                <Text>
                  Logged in user {this.state.current_username} !!
                </Text>
              }
          
            <Text>
                  Test:  {this.state.test} !!
              </Text>

            <TouchableWithoutFeedback onPress={() => this.collapseMessageBox()}>
                <View style = {styles.containerHorizontal}>
                    <View style = {{flex: 0.85}}>
                        <Text style = {styles.activity_text}>
                            {this._activities[this.state.activity_index]}
                        </Text>
                    </View>

                    <View style = {{flex: 0.15}}>
                        <ModalDropdown  style={styles.dropdown_bar}
                                        defaultIndex={0}
                                        defaultValue={this._activities[0]}
                                        dropdownStyle={styles.dropdown_box}
                                        options={this._activities}
                                        onSelect={(idx, value) => this.setState({activity_index: idx})}
                                        renderRow={this._dropdown_renderRow.bind(this)}>

                                        <Image  style={styles.dropdown_image}
                                                source={dropdownIcon}>
                                        </Image>
                        </ModalDropdown>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <Animated.View style = {{flexDirection:'row', height: this.state.post_message_height}}>
                <PostMessageBox
                    onClick={(event) => this.postMessagePressed()}
                    animateDuration={ANIMATE_DURATION}
                    post_message_expanded={this.state.post_message_expanded}>
                </PostMessageBox>
            </Animated.View>

            <View style={{flex:1}}>

            <Feed posts = {this.state.feed} currentUser = {this.state.currentUser}/>
           
            </View>

        </View>

    )
  }

  // Adjust the color of the rows so that the selected item has a different color
  _dropdown_renderRow(rowData, rowID, highlighted) {
    return (
      <TouchableHighlight underlayColor='cornflowerblue'>
        <View style={styles.dropdown_row}>
          <Text style={[styles.dropdown_row_text, highlighted && {color: 'mediumaquamarine'}]}>
            {rowData}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

var messages = ['This is my first message',
'This is my second message',
'This is my third message',
'This is my fourth message',
'This is my fifth message',
'This is my sixth message',
'This is my seventh message',
'This is my eigth message',
'This is my ninth message',
'This is my tenth message'
]

var createFeedRow = (message, i) =>
    <FeedBox
        key={i}
        message={message}
        image_ID = { i%3 }/>;

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'flex-start',
  },
  containerHorizontal: {
     flexDirection:'row',
     height: ACTIVITY_BAR_HEIGHT,
  },

  titleTextLarge: {
    fontSize: 30
  },
  titleTextSmall: {
    fontSize: 25
  },
  dropdown_bar: {
    borderWidth: 0,
    height: ACTIVITY_BAR_HEIGHT,
    justifyContent: 'center',
    backgroundColor: ACTIVITY_BAR_COLOR,
  },
  activity_text: {
    height: ACTIVITY_BAR_HEIGHT,
    fontSize: 25,
    color: 'white',
    textAlign: 'left',
    textAlignVertical: 'center',
    backgroundColor: ACTIVITY_BAR_COLOR,
    justifyContent: 'center'
  },
  dropdown_box: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 0,
    alignSelf: 'flex-end'
  },
  dropdown_row: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  dropdown_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: 'navy',
    textAlignVertical: 'center',
  },
  dropdown_image: {
    width: 30,
    height: 30,
    tintColor: 'white',
    alignSelf: 'flex-end'
  },
  scrollView: {
    backgroundColor: '#6A85B1',
    height: 300,
  },
});

module.exports = FeedScreen
