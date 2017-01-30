import React from 'react';
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
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
		if (this.state.selected != 'home') {
			this.navigate.bind(this)("Feed");
		}
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

	render() {

		var selected = this.state.selected;
		var home = selected == 'home' ? HIGHLIGHTED : DEFAULT;
		var settings = selected == 'settings' ? HIGHLIGHTED : DEFAULT;
		var notifications = selected == 'notifications' ? HIGHLIGHTED : DEFAULT;

		if (this.props.current_username)
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
								MainElement={<View>
								<Icon name = "md-mail" size={25} color={notifications}/>
								<Text style={[{color: notifications}, styles.tab_text]}>Notifications</Text>
							</View>}
							 BadgeElement={<Text style={{color:'#FFFFFF'}}> {this.props.numUnseenNotifications} </Text>}
							 IconBadgeStyle = {styles.notification_badge}
							/>
						</View>
					</TouchableWithoutFeedback>}
				</View>
				);
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
	},
})