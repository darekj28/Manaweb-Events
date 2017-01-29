import React from 'react';
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const HIGHLIGHTED = '#90D7ED';
const DEFAULT = 'silver';

export default class BottomTabBar extends React.Component {
	constructor() {
		super();
		this.state = { selected : 'home' };
	}
	homePress() {
		this.setState({ selected : 'home' }, this.navigateToFeed.bind(this));
	}
	settingsPress() {
		this.setState({ selected : 'settings' }, this.navigateToSettings.bind(this));
	}
	notificationPress() {
		this.setState({ selected : 'notifications'}, this.navigateToNotifications.bind(this));
	}
	navigateToFeed() {
		// this.props.navigator.push({
  //           href: "Feed",
  //       })
	}
	navigateToSettings() {
		// this.props.navigator.push({
  //           href: "Settings",
  //       })
	}
	navigateToNotifications() {
		// this.props.navigator.push({
  //           href: "Notification",
  //       })
	}
	render() {
		var selected = this.state.selected;
		var home = selected == 'home' ? HIGHLIGHTED : DEFAULT;
		var settings = selected == 'settings' ? HIGHLIGHTED : DEFAULT;
		var notifications = selected == 'notifications' ? HIGHLIGHTED : DEFAULT;
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
				<TouchableWithoutFeedback style={styles.tab} onPress={this.notificationPress.bind(this)}>
					<View style={styles.tab_content}>
						<Icon name = "md-mail" size={25} color={notifications}/>
						<Text style={[{color: notifications}, styles.tab_text]}>Notifications</Text>
					</View>
				</TouchableWithoutFeedback>
			</View>
			);
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
	}
})