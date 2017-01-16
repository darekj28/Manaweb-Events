
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
} = FBSDK;

import React from 'react';
import {Component} from 'react'
import {Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
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

function contains(collection, item) {
  if(collection.indexOf(item) !== -1) return true;
  else return false;
}

function toggle(collection, item) {
  var idx = collection.indexOf(item);
  if(idx !== -1) collection.splice(idx, 1);
  else collection.push(item);
  return collection;
}

class FeedScreen extends Component {
  static populateActivities() {
     return ['SCG Atlanta', 'Activity 2', 'Activity 3', 'Activity 4']
  }

  constructor(props) {
    super(props)
    this.state = {
      filters : ['Trade', 'Play', 'Chill'],
      filter_enable: [true, true, true],
      post_actions : [],
      alert: false,
      search : '',
      userIdToFilterPosts : '',
      activity_index: 0,
      post_message_expanded: false,
      post_message_height: new Animated.Value(50),
      current_username: "",
      feed: [],
      current_user: {'userID' : 'not initialized'},
      newPostContent: "",
      searchText : "",
      test: ""
    }
    this.selectActivitiesAction = this.selectActivitiesAction.bind(this)
    this.postMessagePressed = this.postMessagePressed.bind(this)
    this._activities = FeedScreen.populateActivities()
    this.refreshScreen = this.refreshScreen.bind(this);
    // this.initializeUserInfo = this.initializeUserInfo.bind(this);
    this.handlePostSubmit = this.handlePostSubmit.bind(this);
    this.handlePostTyping = this.handlePostTyping.bind(this);
    this.initializeUser = this.initializeUser.bind(this);
    this.handleFilterPress = this.handleFilterPress.bind(this);
    this.handleServerPostSubmit = this.handleServerPostSubmit.bind(this);
    this._navigateToHome = this._navigateToHome.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleRightAction = this.handleRightAction.bind(this)

  }


  handlePostTyping (newPostContent) {
    this.setState({newPostContent : newPostContent})
  }


  handleFilterPress(index) {
      var filters = ['Trade', 'Play', 'Chill']
      var this_filter = filters[index]
      var newFilters = toggle(this.state.post_actions, this_filter);
      this.setState({post_actions : newFilters});

      // make an alert
      if (this.state.post_actions.length != 0) this.setState({alert : false});
    // scroll to top
    // $('html, body').animate({scrollTop: 0}, 300);
  }
    handleFeedFilterPress(index) {
      var filters = ['Trade', 'Play', 'Chill']
      var this_filter = filters[index]
      var newFilters = toggle(this.state.filters, this_filter);
      this.setState({filters : newFilters});
      var newFilter = this.state.filter_enable
      newFilter[index] = !newFilter[index]
      this.setState({filter_enable: newFilter})
    }
    handleSearch(text) {
      this.setState({ searchText : text });
    }
    handleFilterUser(userIdToFilterPosts) {
      this.setState({ userIdToFilterPosts : userIdToFilterPosts})
    }
    // updates feed then sends the post to the server
    handlePostSubmit(newPostContent){
      var feed = this.state.feed;

      if (this.state.post_actions.length == 0) {
        this.setState({alert : true});
      }

      else {
        this.setState({alert : false});

        feed.unshift({ 
              postContent: newPostContent, 
              avatar  : this.state.current_user['avatar_name'], 
              name    : this.state.current_user['first_name'] + " " + this.state.current_user['last_name'],
              userID  : this.state.current_user['userID'], 
              time  : "just now", 

              isTrade : contains(this.state.post_actions, "Trade"),
              isPlay  : contains(this.state.post_actions, "Play"),
              isChill : contains(this.state.post_actions, "Chill"),
              numberOfComments : 0,
            });
        setTimeout(function (){
          this.handleServerPostSubmit(newPostContent);
          }.bind(this), 1000)
     }
    }



    // sends the post to the server and refreshes the page
    async handleServerPostSubmit (newPostContent) {

      let url = "https://manaweb-events.herokuapp.com"
      let test_url = "http://0.0.0.0:5000"
      let response = await fetch(url + "/mobileMakePost", {method: "POST",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        body:
        JSON.stringify(
         {
          postContent : newPostContent,
          userID : this.state.current_user['userID'],
          numberOfComments : 0,
          isTrade : contains(this.state.post_actions, "Trade"),
          isPlay  : contains(this.state.post_actions, "Play"),
          isChill : contains(this.state.post_actions, "Chill"),
        })
      })
      let responseData = await response.json();
      if (responseData['result'] == 'success') {
        this.setState({newPostContent : ""})
        this.refreshScreen(false);
      }
      else {
        this.setState({newPostContent: 'failure...'})
      }
    }

  async refreshScreen(initialize) {
    let url = "https://manaweb-events.herokuapp.com"
    let test_url = "http://0.0.0.0:5000"
    let response = await fetch(url + "/mobileGetPosts", {method: "POST",
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

    if (responseData['result'] == 'success'){
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
         }
    }
  }


  handleTitlePress() {
    Alert.alert('Manaweb is pressed');
  };

  handleRightAction() {
    // Alert.alert('Menu pressed')
    this.handleLogout();
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

  async initializeUser(){
     let value = await AsyncStorage.getItem("current_username")
     console.log(value)
     // add mobile get current user
        if (value != null) {
          this.setState({"current_username" : value})
        }
  }

  handleLogout() {
    AsyncStorage.setItem("current_username", "").then((value) => {

          LoginManager.logOut()
          this._navigateToHome();  
      });
  }

  _navigateToHome(){
    this.props.navigator.push({
    href: "Start"
    })
  }
  imageStyle(index) {
        if (!this.state.filter_enable[index]) {
            return {
                marginLeft: 8,
                marginRight: 8,
                width: 30,
                height: 30,
                tintColor: '#d9534f'
            }
        } else {
            return {
                marginLeft: 8,
                marginRight: 8,
                width: 30,
                height: 30,
                tintColor : '#5cb85c'
            }
        }

    }

  componentWillMount() {
      this.initializeUser().done();
      this.refreshScreen(true).done();
      // this.refreshScreen(true);

  }


  render() {

    var alert;
    if ((this.state.alert)) {
      alert = <Text>
              Bro! You must select something to do before you post man!
              </Text>;
    }
    let filterIcon1 = require('../components/res/icon1.png')
    let filterIcon2 = require('../components/res/icon2.png')
    let filterIcon3 = require('../components/res/icon3.png')
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

            {/*
            <Text>
              {this.state.post_actions}
            </Text>
            */}

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
            <TextInput
                style = {styles.text_input}
                autoFocus = {true}
                multiline = {false}
                numberOfLines = {1}
                underlineColorAndroid={"transparent"}
                onChangeText={this.handleSearch.bind(this)}
                placeholder={'Search...'}
                value = {this.state.searchText}
            />
            <Animated.View style = {{flexDirection:'row', height: this.state.post_message_height}}>
                <PostMessageBox
                    onClick={(event) => this.postMessagePressed()}
                    animateDuration={ANIMATE_DURATION}
                    post_message_expanded={this.state.post_message_expanded}
                    handleFilterPress = {this.handleFilterPress}
                    newPostContent = {this.state.newPostContent}
                    handlePostTyping = {this.handlePostTyping}
                    handlePostSubmit = {this.handlePostSubmit}
                    newPostContent = {this.state.newPostContent}
                    >
                </PostMessageBox>
            </Animated.View>
            <View style = {{flex: 0.85, zIndex :10000, flexDirection:'row'}}>
                <TouchableWithoutFeedback onPress={() => this.handleFeedFilterPress.bind(this)(0)}>
                    <Image  style={this.imageStyle.bind(this)(0)}
                        source={filterIcon1}>
                    </Image>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => this.handleFeedFilterPress.bind(this)(1)}>
                    <Image  style={this.imageStyle.bind(this)(1)}
                        source={filterIcon2}>
                    </Image>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback onPress={() => this.handleFeedFilterPress.bind(this)(2)}>
                    <Image  style={this.imageStyle.bind(this)(2)}
                        source={filterIcon3}>
                    </Image>
                </TouchableWithoutFeedback>
            </View>
            <Feed posts = {this.state.feed} searchText = {this.state.searchText} filters = {this.state.filters} 
            userIdToFilterPosts={this.state.userIdToFilterPosts} handleFilterUser={this.handleFilterUser.bind(this)} 
            currentUser = {this.state.current_user}
                navigator = {this.props.navigator} username = {this.state.current_username}/>

            

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
  text_input: {
      flex: 1,
      fontSize: 20,
      zIndex : 10000
  }
});

module.exports = FeedScreen
