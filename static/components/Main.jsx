var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;
var browserHistory = require('react-router').browserHistory;
import AppStore from '../stores/AppStore.jsx';
import AppActions from '../actions/AppActions.jsx';
import App from './Home/App.jsx';
import CommentApp from './Comment/CommentApp.jsx';
import NotificationsApp from './Notifications/NotificationsApp.jsx';
import SettingsApp from './Settings/SettingsApp.jsx';
import Recovery from './Login/Recovery.jsx';

class Main extends React.Component {
	render() {
		return (
			<div>
		        {this.props.children}
		    </div>);
	}
}
const checkLogin = (nextState, replace) => {
	if (!AppStore.getCurrentUser())
        replace(`/`);
}
const addIp = (nextState, replace) => {
	// $.get('https://api.ipify.org/?format=json', function(r){ 
 //    	AppActions.addIp(r.ip);
 //    }.bind(this));
}
ReactDOM.render(
	<Router history={browserHistory}>
	<Route path="/" component={Main} onEnter={addIp}>
		<IndexRoute component={App}/>
	  	<Route path="comment/:comment_id" component={CommentApp} onEnter={checkLogin}/>
	  	<Route path="notifications" component={NotificationsApp} onEnter={checkLogin}/>
	  	<Route path="settings" component={SettingsApp} onEnter={checkLogin}/>
	  	<Route path="recovery" component={Recovery}/>
    </Route></Router>, document.getElementById('app'));

