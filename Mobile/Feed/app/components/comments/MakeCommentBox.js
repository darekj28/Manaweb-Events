import React from 'react';
import { Platform, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const MAKE_COMMENT_BOX_HEIGHT = 30
const PADDING = 5
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
        var color = this.props.newPostContent.length > 0 ? '#90D7ED' : 'silver';
		return (
            <View style = {{height: MAKE_COMMENT_BOX_HEIGHT + 2*PADDING, flexDirection : 'row', borderTopColor : 'silver', borderTopWidth : 1, justifyContent : 'flex-start'}}>
    			<View style={{flex:1, justifyContent: 'flex-start',
                    borderColor: 'silver',borderWidth: 1, margin : 5, borderRadius: 3, height : MAKE_COMMENT_BOX_HEIGHT}}>
                    {Platform.OS == 'ios' && <TextInput
                        style = {styles.ios_text_input}
                        autoFocus = {false}
                        multiline = {true}
                        numberOfLines = {1}
                        underlineColorAndroid={"transparent"}
                        onChangeText={this.handlePostTextChange.bind(this)}
                        placeholder={"Write a comment..."}
                        value = {this.props.newPostContent}
                    />}
                    {Platform.OS != 'ios' && <TextInput
                        style = {styles.android_text_input}
                        autoFocus = {false}
                        multiline = {true}
                        numberOfLines = {1}
                        underlineColorAndroid={"transparent"}
                        onChangeText={this.handlePostTextChange.bind(this)}
                        placeholder={"Write a comment..."}
                        value = {this.props.newPostContent}
                    />}

                </View>
                <View style = {{flex: 0, justifyContent : 'flex-start'}}>
                    <TouchableOpacity onPress={this.handlePostSubmit.bind(this)}>
                        <Text style={{fontSize: 15, color: color, margin : 5, padding : 5, paddingLeft : 0}}>
                            Comment
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
		);
	}
}
const styles = StyleSheet.create({
    ios_text_input: {
        flex : 1,
        textAlignVertical: 'center',
        fontSize : 15,
        paddingLeft : 4,
        paddingRight : 4
    },
    android_text_input: {
        flex : 1,
        textAlignVertical: 'center',
        fontSize : 15,
        paddingLeft : 4,
        paddingRight : 4,
        paddingTop : 7,
        paddingBottom : 4
    },
});
