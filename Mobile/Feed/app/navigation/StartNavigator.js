

import React from 'react';
import {Component} from 'react'
import {Platform, Keyboard, ActivityIndicator, ViewContainer, AsyncStorage, AppRegistry, StyleSheet, Text, View, ListView, TouchableOpacity, TouchableHighlight, Navigator} from 'react-native';
import StartScreen from '../screens/StartScreen'
import RegisterName from '../screens/register/RegisterName'
import RegisterPhoneNumber from '../screens/register/RegisterPhoneNumber'
import RegisterEmail from '../screens/register/RegisterEmail'
import RegisterUsername from '../screens/register/RegisterUsername'
import RegisterConfirmCode from '../screens/register/RegisterConfirmCode'
import RegisterPassword from '../screens/register/RegisterPassword'
import Icon from 'react-native-vector-icons/FontAwesome';
import MenuScreen from '../screens/MenuScreen'
import LoginScreen from '../screens/LoginScreen'
import CommentScreen from '../screens/CommentScreen'
import FbCreate from '../screens/register/FbCreate'
import TestHTTP from '../screens/TestHTTP'
import SettingsScreen from '../screens/SettingsScreen'
import WelcomeScreen from '../screens/register/WelcomeScreen'
import RecoveryScreen from '../screens/RecoveryScreen'
import RecoverPassword from '../screens/RecoverPassword'
import FeedScreen from '../screens/FeedScreen'
import NotificationScreen from '../screens/NotificationScreen'
import Spinner from 'react-native-loading-spinner-overlay';
import BottomTabBar from '../components/BottomTabBar';

class StartNavigator extends Component {

	constructor(props) {
		super(props)
		this.state = {
			isLoading: true,
			scroll: false
		}
	}

	_renderScene(route, navigator) {
		var globalNavigatorProps = {
			navigator: navigator,
			current_username : this.props.current_username,
			current_user : this.props.current_user,
			asyncStorageLogin : this.props.asyncStorageLogin,
			asyncStorageLogout : this.props.asyncStorageLogout,
			// refreshUserInformation : this.props.refreshUserInformation,
			initializeUserInformation : this.props.initializeUserInformation
		}
		var registerNavigatorProps = {
			first_name : route.first_name,
			last_name : route.last_name,
			phone_number : route.phone_number,
			confirmationPin : route.confirmationPin,
			password : route.password,
			email : route.email
		}
		var screen;
		var bar_color = "white"
		

		switch(route.href){
			case "Login":
				screen =  (<LoginScreen {...globalNavigatorProps}/>);
				break;
			case "Start":
				bar_color = "skyblue"
				screen =  (<StartScreen {...globalNavigatorProps}/>);
				break;
			case "RegisterName":
				screen =  ( <RegisterName  {...globalNavigatorProps} /> );
				break;
			 case "RegisterPhoneNumber":
				screen =  ( <RegisterPhoneNumber {...registerNavigatorProps} {...globalNavigatorProps}  /> );
				break;
			case "RegisterConfirmCode":
				screen =  ( <RegisterConfirmCode {...registerNavigatorProps} {...globalNavigatorProps} /> )
				break;
			case "RegisterPassword":
				screen =  ( <RegisterPassword {...registerNavigatorProps} {...globalNavigatorProps} />)
				break;
			case "RegisterEmail":
				screen =  ( <RegisterEmail {...registerNavigatorProps}{...globalNavigatorProps} />)
				break;
			case "RegisterUsername":
				screen =  (<RegisterUsername {...registerNavigatorProps} {...globalNavigatorProps} />)
				break;
			case "Settings":
				screen =  (<SettingsScreen  {...globalNavigatorProps}/>)
		 		break;
		 	case "Menu":
				screen =  (<MenuScreen {...globalNavigatorProps}/>)
				break;
			case "Comment":
				screen =  (<CommentScreen comment_id={route.comment_id} getPosts={this.props.getPosts} original_post={route.original_post} {...globalNavigatorProps}/>)
				break;
			case "Feed":
				bar_color = "skyblue"
				screen = (<FeedScreen feed={this.props.feed} scroll={this.state.scroll} stopScroll={this.stopScroll.bind(this)} getPosts={this.props.getPosts} {...globalNavigatorProps}/>)
				break;
			case "Notifications":
				screen = (<NotificationScreen notifications={this.props.notifications} {...globalNavigatorProps}/>)
				break;
			case "FbCreate":
				screen =  (<FbCreate fb_token = {route.fb_token} fb_id = {route.fb_id} {...globalNavigatorProps} />)
				break;
			case "Welcome":
				screen =  (<WelcomeScreen {...globalNavigatorProps}/>)
				break;
			case "Recovery":
				screen =  (<RecoveryScreen {...globalNavigatorProps} />)
				break;
			case "RecoverPassword":
				screen =  (<RecoverPassword current_username = {route.username} {...globalNavigatorProps} />)
		 		break;
		 	default:
				screen =  (<View>
							<TouchableOpacity onPress = {() => this.props.navigator.pop()}>
									<Icon name = "chevron-left" size = {30} />
							</TouchableOpacity>
							<Text> {'BRO! DO NOT GO TO THIS ROUTE ${route}'} </Text>
						</View>
					)
		}
		if (Platform.OS == 'ios') var top_bar = (<View style = {{paddingTop : 20, backgroundColor : bar_color}} />)
		else var top_bar = <View/>

		return (<View style = {{flex: 1}}>
					{top_bar}
					{screen}
				</View>
			);
	}
	stopScroll() {
		this.setState({ scroll : false });
	}
	startScroll() {
		this.setState({ scroll : true });
	}
	render() {
		var start = ""
		if (this.props.current_username == "" || this.props.current_username == null) {
			start = "Start"
		}
		else {
			start = "Feed"
		}
		if (this.props.isLoading) {
			return (
					<View style = {styles.container}>
						<ActivityIndicator style={[styles.centering, styles.white]} color="#cccccc" size="large"/>
					</View>
				)
		}
		else {
			return (
				<View style={styles.container}>
					
					<View style={{flex : 1}}>
						<Navigator 
						initialRoute = {{href: start}}
						ref = "appNavigator"
						renderScene = {this._renderScene.bind(this)}
						configureScene={(route, routeStack) =>
						Navigator.SceneConfigs.PushFromRight}
						navigationBar = {
							<BottomTabBar navigator={this.refs.appNavigator} 
							current_username={this.props.current_username} 
							numUnseenNotifications={this.props.numUnseenNotifications}
							resetNotificationCount={this.props.resetNotificationCount}
							startScroll={this.startScroll.bind(this)}/>		
						}
						/>
					</View>
				</View>
	 ) 

	 }  
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor : "white"
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

module.exports = StartNavigator;


