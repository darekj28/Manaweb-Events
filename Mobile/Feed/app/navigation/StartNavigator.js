

import React from 'react';
import {Component} from 'react'
import {ActivityIndicator, ViewContainer, AsyncStorage, AppRegistry, StyleSheet, Text, View, ListView, TouchableOpacity, TouchableHighlight, Navigator} from 'react-native';
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
			isLoading: true
		}
		// this.initializeUser = this.initializeUser.bind(this);
	}

	_renderScene(route, navigator) {
		var globalNavigatorProps = {
			navigator: navigator,
		}
		var screen;
		var current_username = this.props.current_username
		var current_user = this.props.current_user
		switch(route.href){
			case "Login":
				screen =  (<LoginScreen {...globalNavigatorProps} asyncStorageLogin = {this.props.asyncStorageLogin}/>);
				break;
			case "Start":
				screen =  (<StartScreen {...globalNavigatorProps} />);
				break;
			case "RegisterName":
				screen =  ( <RegisterName  {...globalNavigatorProps} /> );
				break;
			 case "RegisterPhoneNumber":
				screen =  ( <RegisterPhoneNumber first_name = {route.first_name} last_name = {route.last_name}
							 {...globalNavigatorProps}  /> );
				break;
			case "RegisterConfirmCode":
				screen =  ( <RegisterConfirmCode first_name = {route.first_name} last_name = {route.last_name} 
					phone_number = {route.phone_number} confirmationPin = {route.confirmationPin} {...globalNavigatorProps} /> )
				break;
			case "RegisterPassword":
				screen =  ( <RegisterPassword first_name = {route.first_name} last_name = {route.last_name} 
					phone_number = {route.phone_number} {...globalNavigatorProps} />)
				break;
			case "RegisterEmail":
				screen =  ( <RegisterEmail first_name = {route.first_name} last_name = {route.last_name}
					phone_number = {route.phone_number} password = {route.password} {...globalNavigatorProps} />)
				break;
			case "RegisterUsername":
				screen =  (<RegisterUsername first_name = {route.first_name} last_name = {route.last_name}
					phone_number = {route.phone_number} password = {route.password} email = {route.email} 
					asyncStorageLogin = {this.props.asyncStorageLogin} {...globalNavigatorProps} />)
				break;
			case "Settings":
				screen =  (<SettingsScreen
					{...globalNavigatorProps}/>)
		 		break;
		 	case "Menu":
				screen =  (<MenuScreen asyncStorageLogout = {this.props.asyncStorageLogout} current_user = {this.props.current_user}
				current_username = {this.props.current_username} 
				refreshUserInformation = {this.props.refreshUserInformation}
				{...globalNavigatorProps}/>)
				break;
			case "Comment":
				screen =  (<View style={{flex : 1}}>
								<View style={{flex : 1}}>
								<CommentScreen current_username={this.props.current_username} comment_id={route.comment_id} 
								current_user = {this.props.current_user} {...globalNavigatorProps}/>
								</View>
								<BottomTabBar {...globalNavigatorProps}/>
							</View>)
				break;
			case "Feed":
				screen = (<FeedScreen {...globalNavigatorProps}/>)
				break;
			case "Notification":
				screen = (<NotificationScreen {...globalNavigatorProps}/>)
				break;
			case "FbCreate":
				screen =  (<FbCreate fb_token = {route.fb_token} fb_id = {route.fb_id} {...globalNavigatorProps} />)
				break;
			case "Welcome":
				screen =  (<WelcomeScreen current_user = {this.props.current_user} {...globalNavigatorProps}/>)
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
		return screen;
	}

	componentWillMount() {

	}

	render() {
		var start = ""
		if (this.props.current_username == "" || this.props.current_username == null) {
			start = "Start"
		}
		else {
			start = "Menu"
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
				<Navigator 
				initialRoute = {{href: start}}
				ref = "appNavigator"
				style = {styles.navigatorStyles}
				renderScene = {this._renderScene.bind(this)}
				configureScene={(route, routeStack) =>
				Navigator.SceneConfigs.PushFromRight}
				/>
	 ) 

	 }  
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor : "#F5FCFF"
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


