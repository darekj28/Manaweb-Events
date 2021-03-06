import React from 'react';
import {Component} from 'react'
import {RefreshControl, ScrollView, AppRegistry,StyleSheet,Text,View,ListView,TouchableOpacity,TouchableHighlight, TextInput} from 'react-native';

import HomeStatusBar from '../HomeStatusBar';
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome';
import FeedBox from './FeedBox'
import ReportPostModal from './ReportPostModal'

export default class Feed extends Component {
	constructor(props) {
		super(props)
		this.state = {
			posts : [],
			display_report_modal : false,
			report_post: null,
			refreshing : false
		}
		this.filter = this.filter.bind(this);
	}

	filter() {
		var rows = [];
		var that = this;
		this.props.posts.map(function(post, i) {
			function contains(collection, item) {
				if(collection.indexOf(item) !== -1) return true;
				else return false;
			}
			function doesPostMatchFilter() {
				var arr = that.props.filters;
				if (arr.length > 0) {
					if (post['isTrade'] && contains(arr, "Trade")) return true;
					if (post['isPlay'] && contains(arr, "Play")) return true;
					if (post['isChill'] && contains(arr, "Chill")) return true;
					return false;
				}
				else return false;
			}
			function doesPostMatchSearch() {
				if ((post["postContent"].toLowerCase().indexOf(that.props.searchText.toLowerCase()) === -1 &&
						post["userID"].toLowerCase().indexOf(that.props.searchText.toLowerCase()) === -1) && 
						post["name"].toLowerCase().indexOf(that.props.searchText.toLowerCase()) === -1) 
					return false;
				else return true;
			}
			function doesPostMatchSelectedUser() {
				if (that.state.userIdToFilterPosts != '') {
					if (post["userID"].toLowerCase().indexOf(that.props.userIdToFilterPosts.toLowerCase()) === -1)
						return false;
					else return true;
				}
				else return true;
			}
			if ((!doesPostMatchFilter() || !doesPostMatchSearch()) || !doesPostMatchSelectedUser())
				return;

			else
				rows.push(<FeedBox key={i} post = {post} handleFilterUser={this.props.handleFilterUser}
						image_ID = {i % 3} navigator = {this.props.navigator} current_username = {this.props.current_username}
						current_user = {this.props.current_user} toggleReportModal = {this.toggleReportModal.bind(this)}/>);
		}, this);
		return rows;
	}

	listViewRenderRow(input_element){
		return input_element
	}
	componentWillReceiveProps(nextProps, nextState) {
		if (nextProps.scroll) this.scrollToTop.bind(this)();
	}
	componentDidMount(){
		this.setState({posts: this.props.posts})
	}
	scrollToTop() {
		this.listView.scrollTo({y: 0});
		this.props.stopScroll();
	}
	toggleReportModal(post){
		if (!this.state.display_report_modal){
			this.setState({report_post : post})
			this.setState({display_report_modal : true})	
		}
		else {
			this.setState({display_report_modal : false})
		}
	}
	stopRefresh() {
		this.setState({ refreshing : false });
	}
	onRefresh() {
		this.setState({ refreshing : true });
		this.props.getPosts(this.stopRefresh.bind(this));
	}
	render() {
		var feed = this.filter()
		const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		var dataSource = ds.cloneWithRows(feed)
		return (
			<View style = {styles.list_container}>
				{(this.state.report_post != null && this.state.display_report_modal) &&
					<ReportPostModal post = {this.state.report_post} display = {this.state.display_report_modal} 
					toggleReportModal = {this.toggleReportModal.bind(this)} current_user = {this.props.current_user}/>
				}
				<ListView 
					refreshControl={
						<RefreshControl refreshing={this.state.refreshing}
							onRefresh={this.onRefresh.bind(this)}
							tintColor="white"/>
					}
					style={styles.list_container}
					dataSource={dataSource}
					renderRow={this.listViewRenderRow.bind(this)}
					enableEmptySections = {true}
					ref={ref => this.listView = ref}
					/>
			</View>

		) 
	}
}

const styles = StyleSheet.create({
	list_container : {
		flex : 1,
		backgroundColor : '#e5e5e5'
	},
});

