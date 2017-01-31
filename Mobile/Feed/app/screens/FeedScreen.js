
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */


const FBSDK = require('react-native-fbsdk');
const {
	LoginManager,
} = FBSDK;

import Spinner from 'react-native-loading-spinner-overlay';
import React from 'react';
import {Component} from 'react'
import {ActivityIndicator, Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
			Alert, Image, Animated, TouchableWithoutFeedback, ScrollView, Keyboard} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons';
import ActionBar from '../actionbar/ActionBar'; // downloaded from https://github.com/Osedea/react-native-action-bar
// import Menu, {SubMenu, MenuItem} from 'rc-menu'; // rc-menu https://github.com/react-component/menu MIT liscence
// import ReactDOM from 'react-dom';
// import ModalPicker from 'react-native-modal-picker' // https://www.npmjs.com/package/react-native-modal-picker
import ModalDropdown from 'react-native-modal-dropdown'; // https://github.com/sohobloo/react-native-modal-dropdown
import PostMessageBox from '../components/feed/PostMessageBox'
import FeedBox from '../components/feed/FeedBox'
import Feed from '../components/feed/Feed'
import LogoAndSearchBar from '../components/feed/LogoAndSearchBar'
import ActivityAndFilterBar from '../components/feed/ActivityAndFilterBar'
const SEARCH_BAR_HEIGHT = 45
// const SEARCH_BAR_COLOR = "#90D7ED"
const SEARCH_BAR_COLOR = "skyblue"
const ACTIVITY_BAR_HEIGHT = 40
const ACTIVITY_BAR_COLOR = "white"
const POST_MESSAGE_HEIGHT_SHORT = 50
const POST_MESSAGE_HEIGHT_TALL = 150
const ANIMATE_DURATION = 400

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
	constructor(props) {
		super(props)
		this.state = {
				filters : ['Trade', 'Play', 'Chill'],
				filter_enable: [true, true, true],
				post_actions : [],
				alert: true,
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
				test: "",
				loading: true,
				display_make_post : false,
				canPost : true
		}
		this.spamTimer;
		this.selectActivitiesAction = this.selectActivitiesAction.bind(this)
		this.postMessagePressed = this.postMessagePressed.bind(this)
		this.handlePostSubmit = this.handlePostSubmit.bind(this);
		this.handlePostTyping = this.handlePostTyping.bind(this);
		this.handleFilterPress = this.handleFilterPress.bind(this);
		this.handleServerPostSubmit = this.handleServerPostSubmit.bind(this);
		this._navigateToHome = this._navigateToHome.bind(this);
		this.handleRightAction = this.handleRightAction.bind(this)
	}
	handlePostTyping (newPostContent) {
			this.setState({newPostContent : newPostContent})
			if (newPostContent && this.state.post_actions.length != 0) this.setState({ alert : false });
			else this.setState({ alert : true });
	}

	handleFilterPress(index) {
			var filters = ['Trade', 'Play', 'Chill']
			var this_filter = filters[index]
			var newFilters = toggle(this.state.post_actions, this_filter);
			this.setState({post_actions : newFilters});

			// make an alert
			if (this.state.newPostContent && this.state.post_actions.length != 0) this.setState({ alert : false });
			else this.setState({ alert : true });
			// scroll to top
			// $('html, body').animate({scrollTop: 0}, 300);
	}

	handleFeedFilterPress(index) {
			var newFilter = this.state.filter_enable
			var allFeedsWillBeOff = true
			for (var i = 0; i < newFilter.length; i++) {
					if (i == index && !newFilter[i]) {
							allFeedsWillBeOff = false
					}
					if (i != index && newFilter[i]) {
							allFeedsWillBeOff = false
					}
			}
			if (allFeedsWillBeOff) {
					Alert.alert('Don\'t filter out all the feeds.')
					return
			}
			newFilter[index] = !newFilter[index]
			this.setState({filter_enable: newFilter})
			var filters = ['Trade', 'Play', 'Chill']
			var this_filter = filters[index]
			var newFilters = toggle(this.state.filters, this_filter);
			this.setState({filters : newFilters});
	}
	handleSearch(text) {
			this.setState({ searchText : text });
	}
	handleFilterUser(userIdToFilterPosts) {
			if (userIdToFilterPosts == this.state.userIdToFilterPosts)
					this.setState({userIdToFilterPosts : ""});
			else this.setState({ userIdToFilterPosts : userIdToFilterPosts});
	}

	// updates feed then sends the post to the server
	handlePostSubmit(newPostContent){
			var feed = this.state.feed;
			if (this.state.post_actions.length == 0) {
				this.setState({alert : true});
				alert("You must select a filter before submitting your post")
			}
			else {
				this.setState({alert : false});
				feed.unshift({
							postContent: newPostContent,
							avatar  : this.props.current_user['avatar_name'],
							name    : this.props.current_user['first_name'] + " " + this.props.current_user['last_name'],
							userID  : this.props.current_user['userID'],
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
	handleServerPostSubmit (newPostContent) {
		var url = "https://manaweb-events.herokuapp.com"
		var test_url = "http://0.0.0.0:5000"
		fetch(url + "/mobileMakePost", {method: "POST",
					headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
				},
			body:
			JSON.stringify(
			 {
				postContent : newPostContent,
				username : this.props.current_user.userID,
				numberOfComments : 0,
				isTrade : contains(this.state.post_actions, "Trade"),
				isPlay  : contains(this.state.post_actions, "Play"),
				isChill : contains(this.state.post_actions, "Chill"),
			})
		}).then((response) => response.json())
			.then((responseData) => {

				if (responseData['result'] == 'success') {
					this.setState({newPostContent : "", canPost : false});
					this.props.getPosts();
				}
				else {
					this.setState({newPostContent: 'failure...'})
				}
			}).done()
		this.spamTimer = setTimeout(() => {this.setState({ canPost: true })}, 30000);
	}
	handleTitlePress() {
		Alert.alert('Manaweb is pressed');
	};
	handleRightAction() {
		this.props.handleLogout.bind(this)();
	}
	selectActivitiesAction() {
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
	_navigateToHome(){
		this.props.navigator.push({
		href: "Start"
		})
	}

	initializeUserInfo(){
			this.setState({current_user : this.props.current_user})
			this.setState({current_username : this.props.current_user.userID})
	}
	componentDidMount() {
			this.initializeUserInfo.bind(this)();
	}
	componentWillUnmount(){
		clearTimeout(this.spamTimer)
	    this.keyboardWillHideListener.remove();
	}

	componentWillMount () {
    	this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => this.collapseMessageBox());
  	}

	render() {
		let filterIcon1 = require('../components/res/icon1.png')
		let filterIcon2 = require('../components/res/icon2.png')
		let filterIcon3 = require('../components/res/icon3.png')
		let dropdownIcon = require('./res/down_arrow.png')
		return (
				<View style = {styles.container}>
					 <TouchableWithoutFeedback onPress={() => this.collapseMessageBox()}>
							 <View style = {{height: SEARCH_BAR_HEIGHT}}>
									 <LogoAndSearchBar color = {SEARCH_BAR_COLOR} searchText={this.state.searchText}
											onChange={this.handleSearch.bind(this)} activityText="Grand Prix San Jose">
										</LogoAndSearchBar>
							 </View>
					 </TouchableWithoutFeedback>
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
										canPost={this.state.canPost}
										alert={this.state.alert}
										>
								</PostMessageBox>
						</Animated.View>
						<TouchableWithoutFeedback onPress={() => this.collapseMessageBox()}>
							 <View style = {{height: SEARCH_BAR_HEIGHT}}>
									 <ActivityAndFilterBar
											 color = {ACTIVITY_BAR_COLOR}
											 activityText = {'Baltimore'}
											 searchText={this.state.searchText}
											 onChange={this.handleSearch.bind(this)}
											 filter_enable = {this.state.filter_enable}
											 filterText = {this.state.filters}
											 onFilterChange = {this.handleFeedFilterPress.bind(this)}
											 >
									 </ActivityAndFilterBar>
							 </View>
					 </TouchableWithoutFeedback>
						<Feed posts = {this.props.feed} searchText = {this.state.searchText} filters = {this.state.filters}
						userIdToFilterPosts={this.state.userIdToFilterPosts} handleFilterUser={this.handleFilterUser.bind(this)}
						current_user = {this.props.current_user} scroll={this.props.scroll} stopScroll={this.props.stopScroll}
								navigator = {this.props.navigator} current_username = {this.props.current_user.userID}
								/>
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
		backgroundColor : 'white'
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
			fontSize: 20
	}
});

module.exports = FeedScreen
