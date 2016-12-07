var React = require('react');
var Link = require('react-router').Link;
import Notifications from "Notifications.jsx";
import AccountDropdown from "AccountDropdown.jsx";

export default class SearchNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.handleSearch = this.handleSearch.bind(this);
	}
	componentDidMount() {
		var searchVisible = 0;
		$('.navbar-search-form').hide();
		$('[data-toggle="search"]').click(function(){
	        if(searchVisible == 0){
	            searchVisible = 1;
	            $(this).parent().addClass('active');
	            $('.navbar-search-form').fadeIn(function(){
	                $('.navbar-search-form input').focus();
	            });
	        } else {
	            searchVisible = 0;
	            $(this).parent().removeClass('active');
	            $(this).blur();
	            $('.navbar-search-form').fadeOut(function(){
	                $('.navbar-search-form input').blur();
	            });
	        } 
	    });
	    $('#searchInput').keypress(function(event) {
	    	if(event.keyCode == 13){ 
			   event.preventDefault();
			}
	    });
	    $('#home').focus(function() {
	    	$(this).blur();
	    });
	}
	handleSearch() {
		this.props.onSearch(this.searchText.value);
	}
	render() {
		var that = this;
		return (
			<nav className="navbar navbar-default" role="navigation">
				<div className="container">
					<div className="navbar-header">
						<button type="button" className="navbar-toggle" data-toggle="collapse" 
										data-target="#bs-example-navbar-collapse-1">
				            <span className="sr-only">Toggle navigation</span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				          </button>
				          <Link to="/" className="navbar-brand navbar-brand-logo">
				                <span className="glyphicon glyphicon-chevron-left"></span>
				              </Link>
				        </div>
				        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
				          <ul className="nav navbar-nav navbar-right">
		                    <li className="">
		                        <a href="javascript:void(0)" data-toggle="search">
		 							<span className="glyphicon glyphicon-search"></span>
		                        </a>
		                    </li>
				          	<Notifications/>
				          	<AccountDropdown/>
				          </ul>
				         <form className="navbar-form navbar-right navbar-search-form" role="search">                  
			                 <div className="form-group">
			                 	  <div className="input-group input-group-unstyled">
				                      <input type="text" value={this.props.searchText} ref={(input) => this.searchText = input} 
				                      			id="searchInput" className="form-control" placeholder="Search..." 
				                      			onChange={this.handleSearch}/>
				                      <div className = "input-group-addon"></div>
								  </div>
								  
			                 </div> 
			              </form>
				        </div>
				      </div>
				    </nav>
		)
	}
}