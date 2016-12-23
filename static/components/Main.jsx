var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;

import App from 'App.jsx';
import CommentApp from 'CommentApp.jsx';
import NotificationsApp from 'NotificationsApp.jsx';
import SettingsApp from 'SettingsApp.jsx';

class Main extends React.Component {
	render() {
		return (
			<div>
		        {this.props.children}
		    </div>);
	}
}
ReactDOM.render(
	<Router history={browserHistory}>
	<Route path="/" component={Main}>
		<IndexRoute component={App}/>
	  	<Route path="comment/:comment_id" component={CommentApp}/>
	  	<Route path="notifications" component={NotificationsApp}/>
	  	<Route path="settings" component={SettingsApp}/>
    </Route></Router>, document.getElementById('app'));

