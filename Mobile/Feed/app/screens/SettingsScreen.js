
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {Alert, Image, Modal, Picker, AsyncStorage, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

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
      old_password : "",
      new_password: "",
      first_name_validation: {result : 'success'},
      last_name_validation: {result : 'success'},
      email_validation : {result : 'success'},
      phone_number_validation : {result : 'success'},
      new_password_validation : {result: 'success'},
      old_password_validation : {result : 'failure'},
      display_avatar_picker : false,
      display_password_change : false
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
      this.setState({phone_number_validation: responseData})
    })
    .done();
  }


  // validates the new password, right now we don't have them type in their new password twice
  validateNewPassword(new_password) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobilePasswordValidation", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        password: new_password,
        password_confirm: new_password
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({new_password_validation : responseData})
    })
    .done();
  }

  handleEmailChange(email) {
    this.setState({email : email})
    if (email == this.state.current_user.email){
      var output = {result : 'success'}
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
      if (phone_number == this.state.current_user.phone_number){
        var output = {result : 'succces'}
        this.setState({phone_number_error : output})
      }
      else {
      this.validatePhoneNumber.bind(this)(phone_number);
      }
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

  // makes the fetch request to submit the new settings
  submitNewSettings() {
    var errorCheckResult = this.errorCheck.bind(this)();
    var canSubmit = errorCheckResult.result
    var errorMessage = errorCheckResult.reason
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
        this.props.refreshInfo.bind(this)();
        alert("Settings Updated")
      }).done();
    }
    else {
      alert(errorMessage)
    }
  }
  // checks if we can submit the output, i.e. no errors
  errorCheck() {
      var canSubmit = true;
      var reason = ""
      if (this.state.first_name_validation.result != 'success') {
         canSubmit = false;
         reason = "Error with first name"
         // reason = this.state.first_name_validation.error
      }
      if (this.state.last_name_validation.result != 'success') {
        canSubmit = false;
        reason = "Error with last name"
        // reason = this.state.last_name_validation.error
      }
      if (this.state.email_validation.result != 'success') {
        canSubmit = false;
        reason = "Error with email"
        // reason = this.state.email_validation.error
      }
      if (this.state.phone_number_validation.result != 'success') {
        canSubmit = false;
        reason = "Error with phone number"
        // reason = this.state.phone_number_validation.error
      }
      return {result: canSubmit, reason : reason};
  }
  toggleAvatarPicker() {
    this.setState({display_avatar_picker : !this.state.display_avatar_picker})
  }
  togglePasswordModal() {
    this.setState({display_password_change : !this.state.display_password_change})
  }
  getErrorMessage(field){
    var validation_output_dict = {}
    validation_output_dict['first_name'] = this.state.first_name_validation;
    validation_output_dict['last_name'] = this.state.last_name_validation;
    validation_output_dict['email'] = this.state.email_validation;
    validation_output_dict['phone_number'] = this.state.phone_number_validation
    validation_output_dict['new_password'] = this.state.new_password_validation
    validation_output_dict['old_password'] = this.state.old_password_validation
    var this_validation_output = validation_output_dict[field]
    if (this_validation_output.result != 'success') {
      return (
                <View style = {styles.error_box}>
                  <Text style = {styles.error_text}>
                       {this_validation_output.error}
                  </Text>
                  </View>
        )
    }
    else return;
  }
  getAvatarImage(avatar) {
    var avatar = avatar.toLowerCase()
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

  generateAvatarInput() {
    var picker_list = this.generateAvatarPickerList.bind(this)()
    var currentAvatar = this.state.avatar
    var currentAvatarLabel = currentAvatar.charAt(0).toUpperCase() + currentAvatar.slice(1);
    var avatarImage = this.getAvatarImage.bind(this)(this.state.avatar)
    return (
              <View style = {styles.input_container}> 
                <Text style = {styles.settings_label}>
                    Avatar
                  </Text>
                  <View style={{flexDirection : 'row'}}>
                     <TouchableOpacity style = {{justifyContent : 'flex-start', flex : 0, paddingLeft:8}} 
                        onPress = {this.toggleAvatarPicker.bind(this)}>
                        <View style={{flexDirection : 'column',  alignItems : 'center'}}> 
                            {avatarImage}
                            <Text style = {{fontSize : 12}}> 
                              {currentAvatarLabel}
                            </Text>     
                        </View> 
                    </TouchableOpacity>   
                    <View style={{flex : 1}}>
                    </View>
                </View>           
             </View>
      )
  }
    generateFirstNameInput() {
    var first_name_error = this.getErrorMessage.bind(this)('first_name')
    return (
        <View style = {styles.input_container}> 
                <Text style = {styles.settings_label}>
                    First name
                  </Text>
                 <TextInput 
                      style = {styles.settings_input}
                      placeholder = "First name" 
                      maxLength = {20}
                      onChangeText = {this.handleFirstNameChange.bind(this)}
                      value = {this.state.first_name}
                  />                  
                  {first_name_error}
             </View>
      )
  }
    generateLastNameInput(){
    var last_name_error = this.getErrorMessage.bind(this)('last_name')
    return (
              <View style = {styles.input_container}> 
                <Text style = {styles.settings_label}>
                    Last name
                  </Text>
                 <TextInput 
                      style = {styles.settings_input}
                      placeholder = "Last name" 
                      maxLength = {20}
                      onChangeText = {this.handleLastNameChange.bind(this)}
                      value = {this.state.last_name}
                  />                  
                  {last_name_error}
             </View>
      )
  }
  generateEmailInput() {
    var email_error = this.getErrorMessage.bind(this)('email')
    return(
               <View style = {styles.input_container}> 
                <Text style = {styles.settings_label}>
                    Email
                  </Text>
                 <TextInput 
                      style = {styles.settings_input}
                      placeholder = "Last name" 
                      maxLength = {20}
                      onChangeText = {this.handleEmailChange.bind(this)}
                      value = {this.state.email}
                  />                  
                  {email_error}
             </View>
      )
  }
  generatePhoneNumberInput() {
    var phone_number_error = this.getErrorMessage.bind(this)('phone_number')
    return (
              <View style = {styles.input_container}> 
                <Text style = {styles.settings_label}>
                    Phone number
                  </Text>
                  <TextInput
                  onChangeText = {this.handlePhoneNumberChange.bind(this)}
                  style = {styles.settings_input}
                  placeholder = "Phone number"
                  value = {this.state.phone_number}
                  keyboardType = "number-pad"
                  dataDetectorTypes = "phoneNumber"
                  maxLength = {14}
                />
                  {phone_number_error}
             </View>
      )
  }
  validateOldPassword(old_password) {
    var url = "https://manaweb-events.herokuapp.com"
    var test_url = "http://0.0.0.0:5000"
    fetch(url + "/mobileCheckPassword", {method: "POST",
    headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }, 
      body: 
      JSON.stringify(
       {
        username : this.state.current_username,
        password: old_password
        
      })
    })
    .then((response) => response.json())
    .then((responseData) => {
      this.setState({old_password_validation : responseData})
    })
    .done();
  }

  handleOldPasswordChange(old_password) {
    this.setState({old_password : old_password})
    this.validateOldPassword.bind(this)(old_password)
  }

  handleNewPasswordChange(new_password){
    this.setState({new_password: new_password})
    this.validateNewPassword.bind(this)(new_password)
  }
  updatePassword(){
    if (this.state.old_password_validation.result != 'success') {
      alert("Current password is invalid")
    }
    else if (this.state.new_password_validation.result != 'success') {
      alert("New password is of invalid form : " + this.state.new_password_validation.error)
    }
    else {
      var url = "https://manaweb-events.herokuapp.com"
      var test_url = "http://0.0.0.0:5000"
      fetch(url + "/mobileUpdatePassword", {method: "POST",
      headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }, 
        body: 
        JSON.stringify(
         {
          username: this.state.current_username,
          password: this.state.new_password
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        // this.togglePasswordModal.bind(this)();
        Alert.alert(
          "Password Succesfully Updated!",
          "Returning To Previous Settings",
          [
            {text: 'OK', onPress: () => this.togglePasswordModal.bind(this)()}
          ])
      }).done();
    }
  }

  generatePasswordModal() {
    var old_password_input = this.generateOldPasswordInput.bind(this)()
    var new_password_input = this.generateNewPasswordInput.bind(this)()

    return  (
          <Modal
            visible={this.state.display_password_change}
              animationType={"slide"}
              transparent={false}>
                <View style={{flex : 1, flexDirection:'column',justifyContent : 'flex-start', paddingTop: 30}}>
                    <View style={{ flex : 0.1, flexDirection : 'row', justifyContent : 'space-around', paddingLeft : 10, paddingRight : 10}}>
                        <View style={{flex: 0.2}}>
                            <TouchableOpacity onPress = {this.togglePasswordModal.bind(this)}>
                                <Text style = {{color : '#90D7ED'}}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 0.6}}>
                            <Text style = {{textAlign : 'center', fontWeight : 'bold'}}>
                                Update password
                            </Text>
                        </View>
                        <View style={{flex: 0.2, justifyContent : 'flex-end', flexDirection : 'row'}}>
                            <TouchableOpacity onPress = {this.updatePassword.bind(this)}>
                                <Text style = {{color : '#90D7ED'}}>
                                    Update
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex : 1, paddingLeft : 16}}>
                        {old_password_input}
                        {new_password_input} 
                    </View>
                </View>
                 
                 
          </Modal>
      )
  }

  generatePasswordLink() {
      return (
            <TouchableOpacity style = {{alignItems : 'center'}} onPress = {this.togglePasswordModal.bind(this)}>
                    <Text style = {styles.settings_clickable}> 
                        Change your password
                    </Text>
                </TouchableOpacity>
        )
  }

  generateOldPasswordInput() {
    var old_password_error = this.getErrorMessage.bind(this)('old_password')
    return  (<View style = {{flexDirection:'column', paddingBottom : 16}}> 
                <Text style = {{fontSize : 16, fontWeight : 'bold', padding: 8}}>
                    Current password
                  </Text>
                 <TextInput
                  onChangeText = {this.handleOldPasswordChange.bind(this)}
                  style = {{fontSize : 16, padding : 8, height : 40}} placeholder = "Password"
                  secureTextEntry = {true}
                  maxLength = {20}
                />
                 {old_password_error}
             </View>
          )
  }

  generateNewPasswordInput() {
    var new_password_error = this.getErrorMessage.bind(this)('new_password')
    return  (<View style = {{flexDirection : 'column'}}> 
                <Text style = {{fontSize : 16, fontWeight :'bold', padding : 8}}>
                    New password
                  </Text>
                 <TextInput
                  onChangeText = {this.handleNewPasswordChange.bind(this)}
                  style = {{fontSize : 16, padding : 8, height : 40}} placeholder = "Password"
                  secureTextEntry = {true}
                  maxLength = {20}
                />
                 {new_password_error}
             </View>
          )
  }


  generateLogoutButton(){
    return (
      <TouchableOpacity
         onPress = {this.props.handleLogout}
         style = {{alignItems: 'center'}}>
          <Text style = {styles.settings_clickable}>
            Sign out
          </Text>
         </TouchableOpacity>
      )
  }


  // for some reason this needs to go here
  listViewRenderRow(input_element){
    return input_element
  }

  initializeUserInfo(){
    this.setState({current_username : this.props.current_user.userID})
    this.setState({current_user : this.props.current_user})
    this.setState({first_name : this.props.current_user.first_name})
    this.setState({last_name : this.props.current_user.last_name})
    this.setState({email : this.props.current_user.email})
    this.setState({phone_number : this.props.current_user.phone_number})
    this.setState({avatar : this.props.current_user.avatar_name})
  }

  componentDidMount() {
    // initialize all the states to previous values
    this.initializeUserInfo.bind(this)();
  }

  checkForChanges() {
    var hasChanges = false;
    if (this.state.first_name != this.current_user.first_name) hasChanges = true
    if (this.state.last_name != this.current_user.last_name) hasChanges = true
    if (this.state.email != this.current_user.email) hasChanges = true
    if (this.state.phone_number != this.current_user.phone_number) hasChanges = true
    if (this.state.avatar != this.current_user.avatar_name) hasChanges = true
    return hasChanges
  }

  // componentWillUnmount(){
  //   var hasChanges = this.checkForChanges.bind(this)()
  // }

  render() {
    var first_name_input = this.generateFirstNameInput.bind(this)()
    var last_name_input = this.generateLastNameInput.bind(this)()
    var email_input = this.generateEmailInput.bind(this)()
    var phone_number_input = this.generatePhoneNumberInput.bind(this)()
    var avatar_input = this.generateAvatarInput.bind(this)()
    var password_modal  = this.generatePasswordModal.bind(this)()
    var password_link = this.generatePasswordLink.bind(this)()
    var logout_button = this.generateLogoutButton.bind(this)()
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    var data = [first_name_input, last_name_input, email_input, phone_number_input
                ,avatar_input, password_link, logout_button]
    var dataSource = ds.cloneWithRows(data)
    return (
        <View style = {styles.container}>
              <Modal 
              visible={this.state.display_avatar_picker}
              animationType={"slide"}
              transparent={false}
                >
                <View style={{flex : 1, flexDirection:'column',justifyContent : 'flex-start', padding : 10, paddingTop: 30}}>
                    <View style={{ flex : 0.1, flexDirection : 'row', justifyContent : 'space-around', paddingLeft : 10, paddingRight : 10}}>
                        <View style={{flex: 0.2}}>
                        </View>
                        <View style={{flex: 0.6}}>
                            <Text style = {{textAlign : 'center', fontWeight : 'bold'}}>
                                Select your avatar
                            </Text>
                        </View>
                        <View style={{flex: 0.2, justifyContent : 'flex-end', flexDirection : 'row'}}>
                            <TouchableOpacity onPress = {this.toggleAvatarPicker.bind(this)}>
                                <Text style = {{color : '#90D7ED'}}>
                                    Done
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flex : 1}}>
                        <View style={{alignItems : 'center'}}>
                            {this.getAvatarImage.bind(this)(this.state.avatar)}
                        </View>
                        <Picker selectedValue={this.state.avatar}
                            onValueChange={this.handleAvatarChange.bind(this)}>
                            {picker_list}
                        </Picker> 
                    </View>
                </View>
                 
              </Modal>
              {password_modal}
            <View style = {styles.top_bar}>
              <TouchableOpacity style = {styles.back_button}
                // onPress = {() => this.props.navigator.pop()}
                >
              </TouchableOpacity>

              <Text style = {styles.logo}> 
                Account Settings
              </Text> 

              <View style = {styles.cog_box}>
                <TouchableOpacity 
                    style = {{}}
                    onPress = {this.submitNewSettings.bind(this)}>
                    <Text style = {{color : '#90D7ED'}}>
                        Update
                    </Text>
                </TouchableOpacity>
              </View>
            </View>
                <ListView
                  style={styles.list_container}
                  dataSource={dataSource}
                  renderRow={this.listViewRenderRow.bind(this)}
                />  
          </View> 
    )
  }
}


let winSize = Dimensions.get('window')
const styles = StyleSheet.create({
  input_box :{ 
    flexDirection : "column",
    width : winSize.width * 0.925,
    height: winSize.height * 0.15,
    borderRadius : 5,
    borderColor: "skyblue",
    padding: 5,
    borderWidth : 2
  },
  input_top_row : {
    flexDirection: "row",
    flex: 0.5,
    backgroundColor: "skyblue"
  },
  instruction_box: {
    flex : 0.4,
    flexDirection: "column",
    padding : 5

  },
  instruction_text : {
      flex: 1
  },
  user_input_container:{
    flex: 0.6,
    backgroundColor : "coral",
    flexDirection: "column"

  },
  input_text: {
    flex: 1,
    padding : 5

  },
 container: {
    flex: 1,
    flexDirection : "column",
    justifyContent: 'space-between',
    paddingTop: 30,
    backgroundColor: "white",
    alignItems: 'flex-start'
  },
  top_bar : {
    flex : 0.1,
    paddingLeft : 10,
    paddingRight : 10,
    flexDirection : "row",
    justifyContent: "space-around",
  },
  list_container: {
    flex : 1,
    alignSelf : 'stretch'
  },
  back_button :{
    flex : 1,
  },
  back_button_text: {
  },
  logo: {
    flex : 2,
    textAlign: "center",
    fontWeight : 'bold'
  },
  cog_box: {
    flex:1,
    flexDirection : "row",
    justifyContent : "flex-end"
  },
  // instruction_box :{
  //   flex : 0.3,
  // },
  // instruction_text : {
  //   fontSize : 16
  // },

  // input_box: {
  //   flexDirection : "column",
  //   borderColor: "skyblue",
  //   borderWidth : 1,
  //   borderRadius : 5,
  //   width : winSize.width * 0.95,
  //   height: winSize.height * 0.15,
  //   justifyContent: "flex-start"
  //   // backgroundColor: "skyblue"
  // },
  // input_text :{
  //   flex: 0.6,
  //   backgroundColor: "coral",
  //   padding : 8,
  //   alignSelf: "flex-start"
  // },
  // input_top_row: {
  //   flexDirection: "row",
  //   flex : 0.5,
  //   // backgroundColor: "skyblue"
  // },
  clear_button : {
    flex: 0.05,
    justifyContent: "center"
  },
  error_box : {
    flex: 0.5,
    flexDirection : "row",
    backgroundColor: "teal"
  },
  error_text : {
    color : "red"
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
    borderColor: "skyblue",
    borderWidth : 1,
    borderRadius : 5,
    width : winSize.width * 0.95,
    height: winSize.height * 0.25
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
    width : 80,
    height : 80,
    borderRadius : 8
  },
  password_box: {
    flexDirection : "column",
    borderColor: "skyblue",
    borderWidth : 1,
    borderRadius : 5,
    padding: 20,
    width : winSize.width * 0.925,
    height: winSize.height * 0.25
    // backgroundColor: "skyblue"
  },
  password_modal_button : {
  },
  logout_button: {
    backgroundColor: "orange",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"

  },
  logout_text: {
    fontSize: 36,
    textAlign: "center",
    textAlignVertical: "center"
  },
  logout_box: {
    flexDirection: "row",
    borderColor: "skyblue",
    borderWidth : 1,
    borderRadius : 5,
    width : winSize.width * 0.925,
    height: winSize.height * 0.15
  },
  settings_label : {
    fontSize : 16, 
    fontWeight : 'bold', 
    padding: 8
  },
  settings_input : {
    fontSize : 16, 
    padding : 8, 
    height : 35
  },
  settings_clickable : {
    fontSize : 16,
    color: '#90D7ED',
    padding : 8
  },

  input_container : {
    flexDirection:'column',
    paddingLeft : 16,
    paddingBottom : 8,
    borderColor: 'skyblue',
  }

});

module.exports = SettingsScreen
