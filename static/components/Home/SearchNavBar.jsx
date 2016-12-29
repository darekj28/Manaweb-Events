var React = require('react');
var Link = require('react-router').Link;
import NotificationsDropdown from "../GenericNavBar/NotificationsDropdown.jsx";
import AccountDropdown from "../GenericNavBar/AccountDropdown.jsx";
import FilterButton from "./FilterButton.jsx";

function contains(collection, item) {
	if(collection.indexOf(item) !== -1) return true;
	else return false;
}

export default class SearchNavBar extends React.Component {
	componentDidMount() {
		var searchVisible = 0;
		$('.navbar-search-form').show();		

		// $('.navbar-search-form').hide();
		// $('[data-toggle="search"]').click(function(){
	 //        if(searchVisible == 0){
	 //            searchVisible = 1;
	 //            $(this).parent().addClass('active');
	 //            $('.navbar-search-form').fadeIn(function(){
	 //                $('.navbar-search-form input').focus();
	 //            });
	 //        } else {
	 //            searchVisible = 0;
	 //            $(this).parent().removeClass('active');
	 //            $(this).blur();
	 //            $('.navbar-search-form').fadeOut(function(){
	 //                $('.navbar-search-form input').blur();
	 //            });
	 //        } 
	 //    });
	    $('#searchInput').keypress(function(event) {
	    	if(event.keyCode == 13){ 
			   event.preventDefault();
			}
	    });
	    $('.SearchNavBarGlyphicon').focus(function() {
	    	$(this).blur();
	    });
	}
	handleResetFilterUser() {
		this.props.handleFilterUser(this.props.userIdToFilterPosts);
	}
	handleSearch() {
		this.props.onSearch(this.searchText.value);
	}
	render() {
		return (
			<nav className="navbar navbar-default" role="navigation">
				<div className="container">
					<div className="navbar-header">
						<button type="button" className="SearchNavBarGlyphicon navbar-toggle" 
										data-toggle="collapse" 
										data-target="#bs-example-navbar-collapse-1">
				            <span className="sr-only">Toggle navigation</span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				          </button>
				          <Link to="/" onClick={this.handleResetFilterUser.bind(this)} 
				          				className="SearchNavBarGlyphicon 
				          								navbar-brand navbar-brand-logo">
				                <span className="glyphicon glyphicon-home"></span>
				              </Link>
				        </div>
				        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				          <ul className="nav navbar-nav navbar-right">
		                   {/*  <li>
		                        <a href="javascript:void(0)" data-toggle="search">
		 							<span className="glyphicon glyphicon-search"></span>
		                        </a>
		                    </li>
		                */}
				          	<NotificationsDropdown/>
				          	<AccountDropdown currentUser = {this.props.currentUser} 
				          				name={this.props.name}/>
				          </ul>
				         <form className="navbar-form navbar-right navbar-search-form" 
				         		role="search">                  
			                 <div className="form-group">
			                 	  <div className="input-group input-group-unstyled">
				                      <input type="text" value={this.props.searchText} 
				                      			ref={(input) => this.searchText = input} 
				                      			id="searchInput" className="form-control" 
				                      			placeholder="Search..." 
				                      			onChange={this.handleSearch.bind(this)}/>
				                      <div className = "input-group-addon"></div>
								  	  {this.props.actions.map(function(action, i) {
											var button = !this.props.isComment ? 
											<FilterButton key={i} 
													onClick={this.props.handleFilterClick} 
													selected={true} isSearch={true} name={action}/> : '';
											return button;
										}, this)}
								  </div>
								  
			                 </div> 
			              </form>
				        </div>
				      </div>
				    </nav>
		)
	}
}