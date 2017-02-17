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
                  <a className="unclickable-name">Welcome, {this.props.name}.</a></li>}
                <li className="divider"></li>
                {this.props.currentUser.isAdmin && 
                <li><Link to="/admin"><span className="fa fa-university modal-icon-admin"/>Admin Portal</Link></li>}
                <li><Link to="/settings"><span className="fa fa-cog modal-icon-settings"/>Account Settings</Link></li>
				        <li><Link to="/" onClick={this.removeCurrentUser.bind(this)}><span className="fa fa-sign-out modal-icon-logout"/>Sign Out</Link></li>
              </ul>
          </li>
		);
	}
}