
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import Dimensions from 'Dimensions';



const avatar_list = ['nissa', 'chandra', 'elspeth', 'nicol', 'ugin', 'jace', 'liliana', 'ajani', 'nahiri', 'gideon']

class SettingsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {

      current_username: "",
      current_user: {},
      first_name : "",
      last_name : "",
      email : "",
      phone_number: "",
      raw_phone_number : "",
      avatar : "",
      first_name_validation: {result : 'success'},
      last_name_validation: {result : 'success'},
      email_validation : {result : 'success'},
      phone_number_validation : {result : 'success'},
      display_picker : false
      // password coming soon
    }
  }

    validateFirstName(first_name) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileNameValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        name: first_name
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({first_name_validation : responseData})
    }).done();
  }

  validateLastName(last_name) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileNameValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        name: last_name
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({last_name_validation : responseData})
    }).done();
  }

  validateEmail(email) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileEmailValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        email : email
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({email_validation : responseData})
    })
    .done();
  }


  validatePhoneNumber(phone_number) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobilePhoneNumberValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        phone_number : phone_number
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({validation_output : responseData})
    })
    .done();
  }

  handleEmailChange(email) {
    this.setState({email : email})
    if (email == this.state.current_user.email){
      ouput = {}
      output['result'] = 'success'
      this.setState({email_validation : output})
    }
    else {
      this.validateEmail.bind(this)(email);
    }
  }

  handleFirstNameChange(first_name) {
    this.setState({first_name: first_name});
    this.validateFirstName(first_name);
  }

  handleLastNameChange(last_name) {
    this.setState({last_name: last_name}) 
    this.validateLastName(last_name);
  }

  handlePhoneNumberChange(phone_number) {
      var raw_phone_number = ""
      for (var i = 0; i < phone_number.length; i++) {
        var c = phone_number[i]
        if (!isNaN(c) && c != " "){
            raw_phone_number = raw_phone_number + c;
          }
      }
      this.setState({raw_phone_number : raw_phone_number})
      var length = raw_phone_number.length
      this.setState({length : length})
      var new_phone_number = "";
      if (length > 0 && length <= 3) {
        new_phone_number = "(" + raw_phone_number;
      }
      if (length == 4) {
        new_phone_number = "(" + raw_phone_number.substring(0,3) + ") " + raw_phone_number.substring(3,4)
      }

      if (length > 4 && length <= 6) {
        new_phone_number = "(" + raw_phone_number.substring(0,3) + ") " + raw_phone_number.substring(3, length)
      }

      if (length > 6) {
        new_phone_number = "(" + raw_phone_number.substring(0,3) + ") " + raw_phone_number.substring(3, 6) + "-" + raw_phone_number.substring(6, length)
      }
      this.setState({phone_number : new_phone_number});  
      this.validatePhoneNumber(phone_number);
  }

  handleAvatarChange(avatar) {
    this.setState({avatar: avatar})
  }

  generateAvatarPickerList() {
    picker_list = [];
    for (var i = 0; i < avatar_list.length; i++) {
        var avatar = avatar_list[i]
        var label = avatar.charAt(0).toUpperCase() + avatar.slice(1);
        picker_list.push(<Picker.Item key = {i} label= {label} value = {avatar} />)
    }
    return picker_list
  }

  initializeUserInformation(){
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileGetCurrentUserInfo", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        username: this.state.current_username
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      var thisUser = responseData.thisUser;
      this.setState({first_name : thisUser.first_name})
      this.setState({last_name : thisUser.last_name})
      this.setState({email : thisUser.email})
      this.setState({phone_number : thisUser.phone_number})
      this.setState({avatar : thisUser.avatar_name})
      this.setState({current_user : responseData.thisUser})
      
    }).done();

  }

  initializeUserName(){
    AsyncStorage.getItem("current_username").then((value) => {
      this.setState({current_username: value});
      this.initializeUserInformation.bind(this)()
    })
  }

  // makes the fetch request to submit the new settings
  submitNewSettings() {
    var canSubmit = this.errorCheck.bind(this)();
    if (canSubmit) {
      var url = "https://manaweb-events.herokuapp.com"
      var test_url = "http://0.0.0.0:5000"
      fetch(url + "/mobileUpdateSettings", {method: "POST",
      headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }, 
        body: 
        JSON.stringify(
         {
          username: this.state.current_username,
          first_name : this.state.first_name,
          last_name : this.state.last_name,
          email : this.state.email,
          phone_number : this.state.phone_number,
          avatar : this.state.avatar
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        this.initializeUserName.bind(this)();
        alert("Settings Updated")
      }).done();
    }
  }

  // checks if we can submit the output, i.e. no errors
  errorCheck() {
      var canSubmit = true;
      if (this.state.first_name_validation.result != 'success') {
        alert('first_name');
         canSubmit = false;
      }
      if (this.state.last_name_validation.result != 'success') {
        alert("last_name")
        canSubmit = false;
      }
      if (this.state.email_validation.result != 'success') {
        alert("email")
        canSubmit = false;
      }
      return canSubmit;
  }

  togglePicker() {
    this.setState({display_picker : !this.state.display_picker})
  }

  getErrorMessage(field){
    var validation_output_dict = {}
    validation_output_dict['first_name'] = this.state.first_name_validation;
    validation_output_dict['last_name'] = this.state.last_name_validation;
    validation_output_dict['email'] = this.state.email_validation;
    validation_output_dict['phone_number'] = this.state.phone_number_validation
    var this_validation_output = validation_output_dict[field]
    if (this_validation_output.result != 'success') {
      return (
                  <Text style = {styles.error_text}>
                       {this_validation_output.error}
                  </Text>
        )
    }
    else return;
  }

  componentWillMount() {
    this.initializeUserName.bind(this)();
    // initialize all the states to previous values
  }

  getAvatarImage(avatar) {
    if (avatar =='nissa') return ( <Image  style={styles.avatar_image} source={require('../static/avatars/nissa.png')} />)
    if (avatar == 'chandra') return (<Image  style={styles.avatar_image} source={require('../static/avatars/chandra.png')} />)
    if (avatar == 'elspeth') return (<Image  style={styles.avatar_image} source={require('../static/avatars/elspeth.png')} />)
    if (avatar == 'nicol') return (<Image  style={styles.avatar_image} source={require('../static/avatars/nicol.png')} />)
    if (avatar == 'ugin') return (<Image  style={styles.avatar_image} source={require('../static/avatars/ugin.png')} />)
    if (avatar == 'jace') return  (<Image  style={styles.avatar_image} source={require('../static/avatars/jace.png')} />)
    if (avatar == 'liliana') return (<Image  style={styles.avatar_image} source={require('../static/avatars/liliana.png')} />)
    if (avatar == 'ajani') return (<Image  style={styles.avatar_image} source={require('../static/avatars/ajani.png')} />)
    if (avatar == 'nahiri') return (<Image  style={styles.avatar_image} source={require('../static/avatars/nahiri.png')} />)
    if (avatar == 'gideon') return (<Image  style={styles.avatar_image} source={require('../static/avatars/gideon.png')} />)
    return;
  }

  render() {
    var first_name_error = this.getErrorMessage.bind(this)('first_name')
    var last_name_error = this.getErrorMessage.bind(this)('last_name')
    var email_error = this.getErrorMessage.bind(this)('email')
    var phone_number_error = this.getErrorMessage.bind(this)('phone_number')
    var picker_list = this.generateAvatarPickerList.bind(this)()
    var currentAvatar = this.state.avatar
    var currentAvatarLabel = currentAvatar.charAt(0).toUpperCase() + currentAvatar.slice(1);
    var avatarImage = this.getAvatarImage.bind(this)(this.state.avatar)
    return (
        <View style = {styles.container}>
              <Modal 
              visible={this.state.display_picker}
              animationType={"slide"}
              transparent={false}
                >
                 <Picker
                  selectedValue={this.state.avatar}
                  onValueChange={this.handleAvatarChange.bind(this)}>
                      {picker_list}
                </Picker> 
                <TouchableHighlight onPress = {this.togglePicker.bind(this)}>
                  <Text>
                    Return
                  </Text>
                </TouchableHighlight>
              </Modal>

            <View style = {styles.top_bar}>
              <TouchableOpacity style = {styles.back_button}
                // onPress = {() => this.props.navigator.pop()}
                >
                <Icon name = "chevron-left" size = {20}/>
              </TouchableOpacity>

              <Text style = {styles.logo}> 
                Logo
              </Text> 

              <View style = {styles.cog_box}>
                <Icon name = "cog" size = {20} style = {styles.cog}/> 
              </View>
            </View>


              <View style = {styles.input_box}>
                  <Text style = {styles.instruction_text}>
                    First Name
                  </Text>
                  <TextInput 
                      style = {styles.input_text}
                      placeholder = "First Name" 
                      maxLength = {20}
                      onChangeText = {this.handleFirstNameChange.bind(this)}
                      value = {this.state.first_name}
                  />  

                   {first_name_error}
              </View> 

              <View style = {styles.input_box}>
                  <Text style = {styles.instruction_text}>
                    Last Name
                  </Text>
                  <TextInput 
                      style = {styles.input_text}
                      placeholder = "Last Name" 
                      maxLength = {20}
                      onChangeText = {this.handleLastNameChange.bind(this)}
                      value = {this.state.last_name}
                  />  
                  {last_name_error}
              </View>   

               <View style = {styles.input_box}> 
                <Text style = {styles.instruction_text}>
                    Email
                  </Text>
                 <TextInput
                  onChangeText = {this.handleEmailChange.bind(this)}
                  style = {styles.input_text} placeholder = "Email"
                  value = {this.state.email}
                />
                 {email_error}
              </View>

              <View style = {styles.input_box}> 
                <Text style = {styles.instruction_text}>
                    Phone Number
                  </Text>
                 <TextInput
                  onChangeText = {this.handlePhoneNumberChange.bind(this)}
                  style = {styles.input_text} placeholder = "Phone Number"
                  value = {this.state.phone_number}
                  keyboardType = "number-pad"
                  dataDetectorTypes = "phoneNumber"
                  maxLength = {14}
                />
                 {phone_number_error}
              </View>

              <View style = {styles.avatar_box}>
                <View style = {styles.avatar_text_column}>
                <Text style = {styles.avatar_text}> 
                    Avatar
                </Text>
                <TouchableOpacity style = {styles.toggle_picker_row} onPress = {this.togglePicker.bind(this)}>
                    <Text style = {styles.current_avatar_text}> 
                      {currentAvatarLabel}
                     </Text>
                     {/* <Icon name = "chevron-right" size = {20} style= {styles.toggle_picker} /> */}
                </TouchableOpacity>
                </View>

                <View style = {styles.avatar_image_container}>
                      {avatarImage
                      }
                </View>
                


              </View>

              <TouchableOpacity 
                style = {styles.submit_settings_box}
                onPress = {this.submitNewSettings.bind(this)}>
                <Text style = {styles.submit_settings_text}>
                    Update Settings!
                </Text>
              </TouchableOpacity>    
          </View> 
    )
  }


}

let winSize = Dimensions.get('window')
const styles = StyleSheet.create({
 container: {
    flex: 1,
    flexDirection : "column",
    justifyContent: 'space-between',
    padding : 10,
    paddingTop: 40,
    backgroundColor: "white",
    alignItems: 'flex-start'
  },


  top_bar : {
    flex : 0.1,
    flexDirection : "row",
    justifyContent: "space-around",
  },

  back_button :{
    flex : 1,
  },

  back_button_text: {

  },

  logo: {
    flex : 1,
    textAlign: "center"
  },

  cog_box: {
    flex:1,
    flexDirection : "row",
    justifyContent : "flex-end"
  },
  // cog : {
  // },

  instruction_box :{
    flex : 0.075,
  },

  instruction_text : {
    fontSize : 16
  },

  input_box: {
    flexDirection : "column",
    flex: 0.1,
    borderColor: "skyblue",
    borderWidth : 1,
    borderRadius : 5,
    width : winSize.width * 0.95
    // backgroundColor: "skyblue"
  },

  input_text :{
    flex: 0.65,
  },

  clear_button : {
    flex: 0.05,
    justifyContent: "center"
  },

  error_box : {
    flex: 0.05,
    flexDirection : "column"
  },

  error_text : {

  },

  submit_settings_box : {
    flex:  0.1, 
    flexDirection : "column",
    justifyContent: "center",
  },

  submit_settings_text : {
  },

  avatar_box: {
    flexDirection : "row",
    flex: 0.1,
    borderColor: "skyblue",
    borderWidth : 1,
    borderRadius : 5,
    width : winSize.width * 0.95,

  },

  avatar_text_column : {
    flex : 0.5
  },

  avatar_row: {
    flexDirection : "row",
    flex: 0.5
  },

  toggle_picker_row : {
    flexDirection : "row",
    flex: 0.5
  },

  toggle_picker : {
    flex : 1
  },

  current_avatar_text: {
    flex: 1
  },

  avatar_image_container : {
    flex : 0.5,
    padding : 10,
  },

  avatar_text: {
    flex: 0.5
  },

  avatar_image : {
    flex: 1,
    width : null,
    height : null,
    resizeMode : "contain"
  }


});

module.exports = SettingsScreen
