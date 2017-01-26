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
import Recovery from './Recovery/RecoveryApp.jsx';
import Confirm from './Login/Confirm.jsx';


class Main extends React.Component {
	render() {
		return (
			<div>
		        {this.props.children}
		    </div>);
	}
}
const checkLogin = (nextState, replace) => {
	var thisUser = AppStore.getCurrentUser()
	if (!thisUser)
        replace(`/`);
    else if (thisUser.confirmed == false) {
    	replace(`/confirm`);
    }
}

const checkConfirmedMain = (nextState, replace) => {
	var thisUser = AppStore.getCurrentUser();
	if (!thisUser) return;
	if (!thisUser.confirmed) {
		AppActions.removeCurrentUser();
	}
}

const checkConfirmed = (nextState, replace) => {
	var thisUser = AppStore.getCurrentUser();
	if (thisUser.confirmed) {
		replace(`/`);
	}
}

ReactDOM.render(
	<Router history={browserHistory}>
	<Route path="/" component={Main} >
		<IndexRoute component={App} onEnter = {checkConfirmedMain}/>
	  	<Route path="comment/:comment_id" component={CommentApp} onEnter={checkLogin}/>
	  	<Route path="notifications" component={NotificationsApp} onEnter={checkLogin}/>
	  	<Route path="settings" component={SettingsApp} onEnter={checkLogin}/>
	  	<Route path="recovery" component={Recovery}/>
	  	<Route path ="confirm" component = {Confirm} onEnter = {checkConfirmed}/>
    </Route></Router>, document.getElementById('app'));

