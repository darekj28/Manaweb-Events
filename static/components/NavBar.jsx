class NavBar extends React.Component {
	render() {
		return(<nav className="navbar navbar-default" role="navigation">
				<div className="container">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle" data-toggle="collapse" 
										data-target="#bs-example-navbar-collapse-1">
				            <span className="sr-only">Toggle navigation</span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				          </button>
				          <a id="home" className="navbar-brand navbar-brand-logo" href="/">
				                <span className="glyphicon glyphicon-home"></span>
				              </a>
				        </div>
				        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				          <ul className="nav navbar-nav navbar-right">
				          	<Notifications/>
				          	<AccountDropdown/>
				          </ul>
				        </div>
				      </div>
				    </nav>);
	}
}
ReactDOM.render(
	<NavBar/>,
	document.getElementById('navbar'));
