class AccountDropdown extends React.Component {
	render() {
		return (
			<li className="dropdown">
              <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                <span className="glyphicon glyphicon-user"></span>
              </a>
              <ul className="dropdown-menu">
                <li><a href="/settings">Settings</a></li>
                <li><a href="#">Your Posts</a></li>
                <li className="divider"></li>
				<li><a href="/logout">Logout</a></li>
              </ul>
            </li>
		);
	}
}