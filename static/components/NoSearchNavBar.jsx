var React = require('react');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import NotificationsDropdown from "./NotificationsDropdown.jsx";
import AccountDropdown from "./AccountDropdown.jsx";

export default class NoSearchNavBar extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		$('.SearchNavBarGlyphicon').focus(function() {
	    	$(this).blur();
	    });
	}
	render() {
		return (
			<nav className="navbar navbar-default" role="navigation">
				<div className="container">
					<div className="navbar-header">
						<button type="button" className="SearchNavBarGlyphicon navbar-toggle" data-toggle="collapse" 
										data-target="#bs-example-navbar-collapse-1">
				            <span className="sr-only">Toggle navigation</span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				          </button>
				          <Link onClick={browserHistory.goBack} className="SearchNavBarGlyphicon navbar-brand navbar-brand-logo">
				                <span className="glyphicon glyphicon-chevron-left"></span>
				              </Link>
				        </div>
				        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				          <ul className="nav navbar-nav navbar-right">
				          	<NotificationsDropdown/>
				          	<AccountDropdown currentUser={this.props.currentUser} name={this.props.name}/>
				          </ul>
				        </div>
				      </div>
				    </nav>
			);
	}
}