import React from 'react';
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class MakeCommentBox extends React.Component {
    handlePostTextChange (text) {
        this.props.handlePostTyping(text);
    }
    handlePostSubmit() {
        if (!this.props.canPost) {
            Alert.alert("You must wait 10 seconds before posting again.");
            return;
        }
        if (this.props.newPostContent.length > 0)
            this.props.handlePostSubmit(this.props.newPostContent);
    }
	render() {
		return (
			<View style={{flex:1, height : 60, flexDirection : 'row', justifyContent: 'flex-start',
                borderColor: '#000000',borderWidth: 1, paddingRight: 3, margin: 3, borderRadius: 3}}>
                <TextInput
                    style = {styles.text_input}
                    autoFocus = {false}
                    multiline = {true}
                    numberOfLines = {1}
                    underlineColorAndroid={"transparent"}
                    onChangeText={this.handlePostTextChange.bind(this)}
                    placeholder={"Reply to " + this.props.op + "..."}
                    value = {this.props.newPostContent}
                />
                <TouchableHighlight
                    style = {{justifyContent: 'center'}}
                    onPress={this.handlePostSubmit.bind(this)}>
                    <View style = {{backgroundColor: '#90D7ED', borderRadius: 3, flex: 0}}>
                        <Text style={{fontSize: 15, color: 'white', padding: 3}}>
                            COMMENT!
                        </Text>
                    </View>
                </TouchableHighlight>
            </View>
		);
	}
}
const styles = StyleSheet.create({
    text_input: {
        flex : 1,
        textAlignVertical: 'center',
    },
});
