import React from 'react';
import { Platform, Keyboard, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconBadge from 'react-native-icon-badge';
// import Pusher from 'pusher-js/react-native';
const HIGHLIGHTED = '#90D7ED';
const DEFAULT = 'silver';
const url = "https://manaweb-events.herokuapp.com"
const test_url = "http://0.0.0.0:5000"

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
				this.setState({numUnseen : responseData.count });   
		})
		.catch((error) => {
			console.log(error);
		});
	}
	resetNotificationCount() {
		this.setState({ numUnseen : 0 });
	}
	componentWillReceiveProps(nextProps){
		if (!nextProps.current_username){
			this.setState({selected : 'home'})
		}
	}
	componentDidMount() {
		this.getNotificationCount.bind(this)();
		// this.notificationService.bind('new_notification_for_' + this.props.current_username, function(message) {
  //           this.setState({ numUnseen : this.state.numUnseen + 1 });
  //       }, this);
	}
	componentWillMount() {
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => (this.setState({ show : false })));
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ show : true }));
        // this.pusher = new Pusher('1e44533e001e6236ca17');
        // this.notificationService = this.pusher.subscribe('notifications');
	}
	componentWillUnmount() {
		// this.pusher.disconnect();
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
