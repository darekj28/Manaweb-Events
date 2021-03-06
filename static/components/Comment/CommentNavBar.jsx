var React = require('react');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import NotificationsDropdown from "../GenericNavBar/NotificationsDropdown.jsx";
import AccountDropdown from "../GenericNavBar/AccountDropdown.jsx";

export default class CommentNavBar extends React.Component {
	handleSearch() {
		this.props.onSearch(this.searchText.value);
	}
	componentDidMount() {
		var searchVisible = 0;
		$('.navbar-search-form').show();
	    $('#searchInput').keypress(function(event) {
	    	if(event.keyCode == 13){ 
			   event.preventDefault();
			}
	    });
	    $('.SearchNavBarGlyphicon').focus(function() {
	    	$(this).blur();
	    });
	}
	render() {
		return (
			<nav className="navbar navbar-default" role="navigation">
				<div className="container navbar-container">
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
				          	<AccountDropdown currentUser = {this.props.currentUser} name={this.props.name}/>
				          </ul>
				         <form className="navbar-form navbar-right navbar-search-form" role="search">                  
			                 <div className="form-group">
			                 	  <div className="inner-addon left-addon">
    								<span className="glyphicon glyphicon-search input-icon"></span>
				                    <input type="text" value={this.props.searchText} ref={(input) => this.searchText = input} 
				                      			id="searchInput" className="form-control" placeholder="Search comments..."
				                      			onChange={this.handleSearch.bind(this)}/>
								  </div>		  
			                 </div> 
			              </form>
				        </div>
				      </div>
				    </nav>
		)
	}
}