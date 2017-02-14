import React from 'react';
import { Platform, Keyboard, AppState, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconBadge from 'react-native-icon-badge';
import Pusher from 'pusher-js/react-native';
import PushNotification from 'react-native-push-notification';
const HIGHLIGHTED = '#90D7ED';
const DEFAULT = 'silver';
const url = "https://manaweb-events.herokuapp.com"
const test_url = "http://0.0.0.0:5000"

function getNotificationSyntax(note) {
	var whose; var also; var notification;
	if (note.isOP) { 
		whose = "your";
		also = "";
	}
	else {
		whose = note.op_name + "'s";
		also = " also";
	}
	if (note.numOtherPeople > 1)
		notification = note.sender_name + " and " + 
				note.numOtherPeople + " other people commented on " + whose + " post."
	else if (note.numOtherPeople == 1)
		notification = note.sender_name + 
				" and 1 other person commented on " + whose + " post."
	else 
		notification = note.sender_name + also + " commented on " + whose + " post."
	return notification;
}
export default class BottomTabBar extends React.Component {
	constructor() {
		super();
		this.state = { selected : 'home', numUnseen : 0 };
	}
	homePress() {
		var currentRoute = this.props.navigator.getCurrentRoutes().pop().href;
		if (this.state.selected != 'home')
			this.navigate.bind(this)("Feed");
		else if (currentRoute != "Feed")
			this.props.navigator.pop();
		else if (currentRoute == "Feed")
			this.props.startScroll();
		this.setState({ selected : 'home' });
	}
	settingsPress() {
		if (this.state.selected != 'settings') {
			this.navigate.bind(this)("Settings");
		}
		this.setState({ selected : 'settings' });
	}
	notificationsPress() {
		if (this.state.selected != 'notifications') {
			this.navigate.bind(this)("Notifications");
		}
		this.resetNotificationCount.bind(this)();
		this.setState({ selected : 'notifications' });
	}
	navigate(href) {
		this.props.navigator.replace({
	        href: href
	    })
	}
	getNotificationCount() {
		fetch(url + "/mobileGetNotificationCount", 
				{method: "POST",
							headers: {
								'Accept': 'application/json',
								'Content-Type': 'application/json'
						},
						body: JSON.stringify({ username : this.props.current_username })
				}
			).then((response) => response.json())
			.then((responseData) => {
				this.setState({ numUnseen : responseData.count });   
		})
		.catch((error) => {
			console.log(error);
		});
	}
	getPostById(comment_id) {
        fetch(url + "/mobileGetPostById",
            {method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment_id : comment_id })
            }
        ).then((response) => response.json())
        .then((responseData) => {
            var original_post = {
                postContent : responseData.post['body'],
                avatar      : responseData.post['avatar'],
                name        : responseData.post['first_name'] + ' ' + responseData.post['last_name'],
                userID      : responseData.post['poster_id'],
                time        : responseData.post['time'],
                comment_id  : responseData.post['comment_id'],
                unique_id   : responseData.post['unique_id'],
                timeString  : responseData.post['timeString'] 
            };
            this.props.navigator.push({
                href: "Comment",
                original_post : original_post,
                comment_id : comment_id,
            })
        })
        .catch((error) => {
            console.log(error);
        });
    }
	initializePushNotifications(){
		PushNotification.configure({
			onNotification: function(notification) {
				var comment_id;
				if (Platform.OS == 'ios') comment_id = notification.userInfo.comment_id;
				else if (Platform.OS == 'android') comment_id = notification.tag.comment_id;
				this.getPostById.bind(this)(comment_id);
			}.bind(this)
		});
	}
	getPushNotifications(current_username){
		fetch(url + "/mobileGetPushNotifications", 
			{method: "POST",
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
					},
					body: JSON.stringify({ username : current_username })
			}
		).then((response) => response.json())
		.then((responseData) => {
			PushNotification.setApplicationIconBadgeNumber(responseData['num_notifications'])
			if (responseData['push_notifications'].length > 0) {
				for (var i = 0; i < responseData['push_notifications'].length; i++) {
					var obj = responseData['push_notifications'][i]
					var data = {
						comment_id : obj['comment_id']
					}
					if (Platform.OS ===  'ios'){
						PushNotification.localNotification({
							message : getNotificationSyntax(obj),
							userInfo : data,
						})
					}
					else if (Platform.OS === 'android'){
						PushNotification.localNotification({
							tag : data,
							message : getNotificationSyntax(obj),
						})
					}
				}
			}
		})
		.catch((error) => {
			console.log(error);
		}).done();
	}
	resetNotificationCount() {
		this.setState({ numUnseen : 0 });
	}
	componentWillReceiveProps(nextProps){
		if (!nextProps.current_username){
			this.setState({selected : 'home', initialized : false });
			if (this.pusher) this.pusher.disconnect();
		}
		else if (nextProps.current_username && !this.state.initialized) {
			this.notificationService.bind('new_notification_for_' + nextProps.current_username.toLowerCase(), function(message) {
	            this.setState({ numUnseen : this.state.numUnseen + 1 });
	            if (AppState.currentState == "background") {
	            	this.getPushNotifications.bind(this)(nextProps.current_username);
	            }
	        }, this);
	        this.setState({ initialized : true });
		}
	}
	componentDidMount() {
		this.getNotificationCount.bind(this)();
	}
	componentWillMount() {
		this.initializePushNotifications.bind(this)();
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this.setState({ show : false }));
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ show : true }));
        Pusher.logToConsole = true;
        this.pusher = new Pusher('1e44533e001e6236ca17');
        this.notificationService = this.pusher.subscribe('notifications');
	}
	componentWillUnmount() {
		this.keyboardDidHideListener.remove();
		this.keyboardDidShowListener.remove();
	}
	render() {
		var selected = this.state.selected;
		var home = selected == 'home' ? HIGHLIGHTED : DEFAULT;
		var settings = selected == 'settings' ? HIGHLIGHTED : DEFAULT;
		var notifications = selected == 'notifications' ? HIGHLIGHTED : DEFAULT;

		if (this.props.current_username) {
			if (!this.state.show || (Platform.OS == 'ios'))
				return (
				<View style = {styles.container}>
					<TouchableWithoutFeedback style={styles.tab} onPress={this.homePress.bind(this)}>
						<View style={styles.tab_content}>
							<Icon name = "md-home" size={25} color={home}/>
							<Text style={[{color: home}, styles.tab_text]}>Home</Text>
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback style={styles.tab} onPress={this.settingsPress.bind(this)}>
						<View style={styles.tab_content}>
							<Icon name = "md-settings" size={25} color={settings}/>
							<Text style={[{color: settings}, styles.tab_text]}>Settings</Text>
						</View>
					</TouchableWithoutFeedback>
					{this.state.numUnseen == 0 &&
					<TouchableWithoutFeedback style={styles.tab} onPress={this.notificationsPress.bind(this)}>
						<View style={styles.tab_content}>
							<Icon name = "md-mail" size={25} color={notifications}/>
							<Text style={[{color: notifications}, styles.tab_text]}>Notifications</Text>
						</View>
					</TouchableWithoutFeedback>}
					{this.state.numUnseen > 0 &&
					<TouchableWithoutFeedback style={styles.tab} onPress={this.notificationsPress.bind(this)}>
						<View style={styles.tab_content}>
							<IconBadge
								MainElement={<Icon name = "md-mail" size={25} color={notifications}/>}
							 BadgeElement={<View/>}
							 IconBadgeStyle = {styles.notification_badge}
							/>
							<Text style={[{color: notifications}, styles.tab_text]}>Notifications</Text>
						</View>
					</TouchableWithoutFeedback>}
				</View>
				)
			else return <View/>;
		}
		else return <View/>;
	}
}
const styles = StyleSheet.create({
	container : {
		flex : 0.1,
		flexDirection:'row',
		borderTopWidth : 1,
		borderTopColor : 'silver',
		backgroundColor : 'white',
		justifyContent: "space-around",
		alignItems : 'center'
	},
	tab : {
		flex: 1,
		alignItems : 'center',
		justifyContent : 'center'
	},
	tab_content : {
		flex: 1,
		alignItems : 'center',
		justifyContent : 'center'
	},
	tab_text : {
		fontSize : 12,
		fontWeight: 'bold'
	},
	notification_badge : {
		alignSelf: "center",
		width : 10,
		height : 10,
		borderRadius : 5,
		left : 15,
		bottom : 10,
		position : 'absolute'
	},
})
