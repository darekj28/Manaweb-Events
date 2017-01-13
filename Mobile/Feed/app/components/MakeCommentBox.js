import React from 'react';
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const FILTER_BAR_SHORT = 0
const FILTER_BAR_TALL = 35

export default class MakeCommentBox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            filter_bar_height: new Animated.Value(FILTER_BAR_SHORT)
        };
	}
	onClick() {
        let initial = this.props.post_message_expanded ? FILTER_BAR_TALL : FILTER_BAR_SHORT
        let final = this.props.post_message_expanded ? FILTER_BAR_SHORT : FILTER_BAR_TALL
        this.state.filter_bar_height.setValue(initial);
        Animated.timing(
            this.state.filter_bar_height, {toValue: final, duration: this.props.animateDuration}
        ).start();

        this.props.onClick();
    }
    handlePostTextChange (text) {
        this.props.handlePostTyping(text);
    }
    handlePostSubmit() {
        if (this.props.newPostContent.length > 0)
            this.props.handlePostSubmit(this.props.newPostContent);
    }
	render() {
		if (!this.props.post_message_expanded) {
            return (
                <TouchableWithoutFeedback onPress={this.onClick.bind(this)}>
                    <View style={{flex:1, justifyContent: 'flex-start', borderBottomColor: '#000000',
                    borderBottomWidth: 1}}>
                        <Text style = {styles.text}>
                            {'Post a comment'}
                        </Text>
                    </View>

                </TouchableWithoutFeedback>
            );
        } else {
            return (
			<View style={{flex:1, justifyContent: 'flex-start', borderBottomColor: '#000000',
                borderBottomWidth: 1}}>
                <View style={[styles.container, {flex: 1}]}>
                    <TextInput
                        style = {styles.text_input}
                        autoFocus = {true}
                        multiline = {true}
                        numberOfLines = {1}
                        underlineColorAndroid={"transparent"}
                        onChangeText={this.handlePostTextChange.bind(this)}
                        placeholder={'Post a Message'}
                        value = {this.props.newPostContent}
                    />
                </View>
                <Animated.View style={[styles.container, {height: this.state.filter_bar_height}]}>
                    <View style = {{flex: 0.15}}>
                        <TouchableHighlight onPress={this.handlePostSubmit.bind(this)}>
                            <Text style={{fontSize: 15}}>
                                {'COMMENT'}
                            </Text>
                        </TouchableHighlight>
                    </View>
                </Animated.View>
            </View>
			);
		}
	}
}
const styles = StyleSheet.create({
  container: {
      flexDirection:'row',
  },
  text: {
      flex: 1,
      fontSize: 20,
      textAlignVertical: 'center',
      marginLeft: 4
  },
  text_input: {
      flex: 1,
      fontSize: 20,
      textAlignVertical: 'center',
  },
});
