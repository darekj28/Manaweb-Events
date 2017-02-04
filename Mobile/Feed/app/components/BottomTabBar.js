import React from 'react';
import { Platform, Keyboard, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import IconBadge from 'react-native-icon-badge';

const HIGHLIGHTED = '#90D7ED';
const DEFAULT = 'silver';

export default class BottomTabBar extends React.Component {
	constructor() {
		super();
		this.state = { selected : 'home' };
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
			this.props.resetNotificationCount();
		}
		this.setState({ selected : 'notifications' });
	}
	navigate(href) {
		this.props.navigator.replace({
	        href: href
	    })
	}

	componentWillReceiveProps(nextProps){
		if (!nextProps.current_username){
			this.setState({selected : 'home'})
		}
	}
	componentWillMount() {
		this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => (this.setState({ show : false })));
		this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this.setState({ show : true }));
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
					{this.props.numUnseenNotifications == 0 &&
					<TouchableWithoutFeedback style={styles.tab} onPress={this.notificationsPress.bind(this)}>
						<View style={styles.tab_content}>
							<Icon name = "md-mail" size={25} color={notifications}/>
							<Text style={[{color: notifications}, styles.tab_text]}>Notifications</Text>
						</View>
					</TouchableWithoutFeedback>}
					{this.props.numUnseenNotifications != 0 &&
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
