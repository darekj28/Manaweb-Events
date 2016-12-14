
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React from 'react';
import {Component} from 'react'
import {  AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
          Alert, Image} from 'react-native';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import ActionBar from '../actionbar/ActionBar'; // downloaded from https://github.com/Osedea/react-native-action-bar
// import Menu, {SubMenu, MenuItem} from 'rc-menu'; // rc-menu https://github.com/react-component/menu MIT liscence
// import ReactDOM from 'react-dom';
// import ModalPicker from 'react-native-modal-picker' // https://www.npmjs.com/package/react-native-modal-picker
import ModalDropdown from 'react-native-modal-dropdown'; // https://github.com/sohobloo/react-native-modal-dropdown
import PostMessageBox from '../components/PostMessageBox'

const ACTIVITY_BAR_HEIGHT = 40
const ACTIVITY_BAR_COLOR = 'black'
class FeedScreen extends Component {


  static populateActivities() {
     return ['SCG Atlanta', 'Activity 2', 'Activity 3', 'Activity 4']
  }

  constructor(props) {
    super(props)
    this.state = {
      login_id : "",
      password: "",
      activity_index: 0,
    }
    this.selectActivitiesAction = this.selectActivitiesAction.bind(this)

    this._activities = FeedScreen.populateActivities()
  }



  handleTitlePress() {
    Alert.alert('Manaweb is pressed');
  };

  handleRightAction() {
    Alert.alert('Menu pressed')
  }

  selectActivitiesAction() {
    // Alert.alert('Select which activity')
    this.setState({select_activity: !this.state.select_activity})
  }


  render() {
    let index = 0;
    const data = [
        { key: index++, section: true, label: 'Vegetables' },
        { key: index++, label: 'Beets' },
        { key: index++, label: 'Red Peppers' },
    ];

    let dropdownIcon = require('./res/down_arrow.png')
    return (
        <View style = {styles.container}>
            <ActionBar
                backgroundColor={'#3B373C'}
                leftIconName={'none'}
                title={'Manaweb'}
                titleStyle={styles.titleTextLarge}
                onTitlePress={this.handleTitlePress}
                onRightPress={this.handleRightAction}
                rightIconName={'menu'}
            />

            <View style = {styles.containerHorizontal}>
                <View style = {{flex: 0.85}}>
                    <Text style = {styles.activity_text}>
                        {this._activities[this.state.activity_index]}
                    </Text>
                </View>

                <View style = {{flex: 0.15}}>
                    <ModalDropdown  style={styles.dropdown_bar}
                                    defaultIndex={0}
                                    defaultValue={this._activities[0]}
                                    dropdownStyle={styles.dropdown_box}
                                    options={this._activities}
                                    onSelect={(idx, value) => this.setState({activity_index: idx})}
                                    renderRow={this._dropdown_renderRow.bind(this)}>

                                    <Image  style={styles.dropdown_image}
                                            source={dropdownIcon}>
                                    </Image>
                    </ModalDropdown>
                </View>
            </View>

            <PostMessageBox text='I love to blink' />

        </View>

    )
  }

  // Adjust the color of the rows so that the selected item has a different color
  _dropdown_renderRow(rowData, rowID, highlighted) {
    return (
      <TouchableHighlight underlayColor='cornflowerblue'>
        <View style={styles.dropdown_row}>
          <Text style={[styles.dropdown_row_text, highlighted && {color: 'mediumaquamarine'}]}>
            {rowData}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'flex-start',
  },
  containerHorizontal: {
     flexDirection:'row',
     flex: 1,
  },
  titleTextLarge: {
    fontSize: 30
  },
  titleTextSmall: {
    fontSize: 25
  },
  dropdown_bar: {
    borderWidth: 0,
    height: ACTIVITY_BAR_HEIGHT,
    justifyContent: 'center',
    backgroundColor: ACTIVITY_BAR_COLOR,
  },
  activity_text: {
    height: ACTIVITY_BAR_HEIGHT,
    fontSize: 25,
    color: 'white',
    textAlign: 'left',
    textAlignVertical: 'center',
    backgroundColor: ACTIVITY_BAR_COLOR,
    justifyContent: 'center'
  },
  dropdown_box: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 0,
    alignSelf: 'flex-end'
  },
  dropdown_row: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  dropdown_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: 'navy',
    textAlignVertical: 'center',
  },
  dropdown_image: {
    width: 30,
    height: 30,
    tintColor: 'white',
    alignSelf: 'flex-end'
  },
});

module.exports = FeedScreen
