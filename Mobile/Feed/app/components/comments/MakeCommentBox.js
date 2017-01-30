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
    componentDidMount() {
        console.log('o');
        this.refs.makeCommentBox.focus();
    }
	render() {
        var color = this.props.newPostContent.length > 0 ? '#90D7ED' : 'silver';
		return (
            <View style = {{flex: 1, flexDirection : 'row'}}>
    			<View style={{flex:1, flexDirection : 'row', justifyContent: 'flex-start',
                    borderColor: '#000000',borderWidth: 1, paddingRight: 3, margin: 3, borderRadius: 3}}>
                    <TextInput
                        style = {styles.text_input}
                        ref="makeCommentBox"
                        autoFocus = {false}
                        multiline = {true}
                        numberOfLines = {1}
                        underlineColorAndroid={"transparent"}
                        onChangeText={this.handlePostTextChange.bind(this)}
                        placeholder={"What's up bro?"}
                        value = {this.props.newPostContent}
                    />

                </View>
                    <View style = {{flex: 0, justifyContent: 'center', flexDirection: 'row'}}>
                        <TouchableHighlight
                            onPress={this.handlePostSubmit.bind(this)}>
                            <Text style={{fontSize: 15, color: color, padding: 5}}>
                                Comment!
                            </Text>
                        </TouchableHighlight>
                    </View>
            </View>
		);
	}
}
const styles = StyleSheet.create({
    text_input: {
        flex : 1,
        textAlignVertical: 'center',
        fontSize : 16,
        paddingLeft : 4, 
        paddingRight : 4
    },
});
