var React = require('react');
var Link = require('react-router').Link;
var AppActions = require('../../actions/AppActions.jsx');

export default class AccountDropdown extends React.Component {
  removeCurrentUser() {
      AppActions.removeCurrentUser();
  }
	render() {
		return (
			     <li className="dropdown">
              <a href="#" className="SearchNavBarGlyphicon dropdown-toggle" data-toggle="dropdown">
                <span className="glyphicon glyphicon-user"></span>
              </a>
              <ul className="dropdown-menu">
                {this.props.currentUser['userID'] && 
                  <li className="unclickable-dropdown">
                  <a className="unclickable-name">{this.props.name}</a></li>}
                <li className="divider"></li>
                {this.props.currentUser.isAdmin && 
                  <li> <a href = "/admin"> Admin Tools </a> </li>}
                <li><Link to="/settings">Account Settings</Link></li>
				        <li><Link to="/" onClick={this.removeCurrentUser.bind(this)}>Sign Out</Link></li>
              </ul>
          </li>
		);
	}
}