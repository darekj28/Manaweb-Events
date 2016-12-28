import React from 'react';
import {Component} from 'react'
import { AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput,
        TouchableWithoutFeedback, Alert, Image, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class FilterButton extends Component {
	constructor(props) {
		super(props);
		this.state = {isSelected : this.props.selected};
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		this.setState({ isSelected : !this.state.isSelected });
		this.props.onClick(this.props.name, this.props.isSearch);
	}

	componentDidMount() {
		// $('[data-toggle="tooltip"]').tooltip(); 
	}

	render() {
		var icon;
		var selected = this.state.isSelected ? "icon-success" : "icon-danger";
		switch(this.props.name) {
			case 'Trade' : 
				icon="glyphicon glyphicon-transfer";
				break;
			case 'Play' :
				icon="glyphicon glyphicon-play";
				break;
			case 'Chill' :
				icon="glyphicon glyphicon-time";
				break;
			default : 
				al

				ert('Invalid action.');
		}
		if (!this.props.isSearch)
			return(

				<a className="input-group-addon" data-container="body" data-toggle="tooltip" title={this.props.name}>
					<span className={icon + " filterButton " + selected} onClick={this.handleClick}>
					</span>
				</a>
				)
		else return(<a className="input-group-addon" data-container="body" data-toggle="tooltip" title={this.props.name}
					 data-placement="bottom">
					<span className={icon + " filterButton " + selected} onClick={this.handleClick}>
					</span>
				</a>
			);
	}
}

FilterButton.defaultProps = {
	isSearch : false
};