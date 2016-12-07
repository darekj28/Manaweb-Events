var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var IndexRoute = require('react-router').IndexRoute;
var hashHistory = require('react-router').hashHistory;

import App from 'App.jsx';
import CommentApp from 'CommentApp.jsx';

ReactDOM.render(
	<Router history={hashHistory}>
		<Route path="/" component={App}/>
      	<Route path="/comment?id=:comment_id" component={CommentApp}/>
    </Router>, document.getElementById('app'));

