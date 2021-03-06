const FBSDK = require('react-native-fbsdk');
const {
	LoginManager,
} = FBSDK;

import Spinner from 'react-native-loading-spinner-overlay';
import React from 'react';
import {Component} from 'react'
import {InteractionManager, ActivityIndicator, Picker, RCTAnimation, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
			Alert, Image, Animated, TouchableWithoutFeedback, ScrollView, Keyboard} from 'react-native';
import dismissKeyboard from 'react-native-dismiss-keyboard';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons';
import ActionBar from '../actionbar/ActionBar'; // downloaded from https://github.com/Osedea/react-native-action-bar
import ModalDropdown from 'react-native-modal-dropdown'; // https://github.com/sohobloo/react-native-modal-dropdown
import PostMessageBox from '../components/feed/PostMessageBox'
import FeedBox from '../components/feed/FeedBox'
import Feed from '../components/feed/Feed'
import LogoAndSearchBar from '../components/feed/LogoAndSearchBar'
import ActivityAndFilterBar from '../components/feed/ActivityAndFilterBar'
const SEARCH_BAR_HEIGHT = 45
const SEARCH_BAR_COLOR = "skyblue"
const ACTIVITY_BAR_HEIGHT = 40
const ACTIVITY_BAR_COLOR = "white"
const POST_MESSAGE_HEIGHT_SHORT = 0
const POST_MESSAGE_HEIGHT_TALL = 150
const ANIMATE_DURATION = 300

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
			renderPlaceholderOnly : true,
			filters : ['Trade', 'Play', 'Chill'],
			filter_enable: [true, true, true],
			post_actions : [],
			alert: true,
			search : '',
			userIdToFilterPosts : '',
			activity_index: 0,
			post_message_expanded: false,
			post_message_height: new Animated.Value(0),
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
		this.postMessagePressed = this.postMessagePressed.bind(this)
		this.handlePostSubmit = this.handlePostSubmit.bind(this);
		this.handlePostTyping = this.handlePostTyping.bind(this);
		this.handleFilterPress = this.handleFilterPress.bind(this);
		this.handleServerPostSubmit = this.handleServerPostSubmit.bind(this);
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
				this.setState({newPostContent : "", canPost: false})
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
					// this.setState({newPostContent : "", canPost : false});
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
	}
	handleRightAction() {
		this.props.handleLogout.bind(this)();
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
					this.postMessagePressed.bind(this)()
			}
	}
	initializeUserInfo(){
		this.setState({current_user : this.props.current_user})
		this.setState({current_username : this.props.current_user.userID})
	}
	componentDidMount() {
		InteractionManager.runAfterInteractions(() => {
	      	this.setState({renderPlaceholderOnly: false});
	    });
		this.initializeUserInfo.bind(this)();
		this.setState({feed : this.props.feed})
	}
	componentWillReceiveProps(nextProps){
		this.setState({feed : nextProps.feed})
	}
	componentWillUnmount(){
		clearTimeout(this.spamTimer)
	    this.keyboardWillHideListener.remove();
	}

	componentWillMount () {
    	this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', () => this.collapseMessageBox());
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
					 <TouchableWithoutFeedback onPress={() => this.collapseMessageBox()}>
							 <View style = {{height: SEARCH_BAR_HEIGHT}}>
									 <LogoAndSearchBar color = {SEARCH_BAR_COLOR} searchText={this.state.searchText}
											onChange={this.handleSearch.bind(this)} 
											expandMakePost={this.postMessagePressed}
											activityText="Event">
										</LogoAndSearchBar>
							 </View>
					 </TouchableWithoutFeedback>
						<Animated.View style = {{flexDirection:'row', height: this.state.post_message_height, borderTopColor : '#696969', borderTopWidth : 1}}>
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
						<Feed posts = {this.state.feed} 
						searchText = {this.state.searchText} 
						filters = {this.state.filters}
						userIdToFilterPosts={this.state.userIdToFilterPosts} 
						handleFilterUser={this.handleFilterUser.bind(this)}
						current_user = {this.props.current_user} 
						scroll={this.props.scroll} 
						stopScroll={this.props.stopScroll}
						getPosts={this.props.getPosts}
						navigator = {this.props.navigator} 
						current_username = {this.props.current_user.userID}
								/>
				</View>

		)
	}
}

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

module.exports = FeedScreen
