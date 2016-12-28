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
                {this.props.currentUser['first_name'] && <li><a href="#">{this.props.name}</a></li>}
                <li className="divider"></li>
                {this.props.currentUser.isAdmin && 
                <li> <a href = "/adminTools"> Admin Tools </a> </li>
                }
                <li><Link to="/settings">Settings</Link></li>
				        <li><a href="/logout" onClick={this.removeCurrentUser.bind(this)}>Logout</a></li>
              </ul>
          </li>
		);
	}
}