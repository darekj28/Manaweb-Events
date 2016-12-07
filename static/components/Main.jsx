var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var browserHistory = require('react-router').browserHistory;

import App from 'App.jsx';
import CommentApp from 'CommentApp.jsx';

class Main extends React.Component {
	render() {
		return (
			<Router history={browserHistory}>
				<Route path="/" component={App}>
		      		<Route path="/comment?id=:comment_id" component={CommentApp}/>
		      	</Route>
		    </Router>
	    );
	}
}
ReactDOM.render(<Main/>, document.getElementById('app'));

