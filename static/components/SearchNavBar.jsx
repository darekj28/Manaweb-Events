var React = require('react');
var Link = require('react-router').Link;
// var $ = require('jquery');
import NotificationsDropdown from "./NotificationsDropdown.jsx";
import AccountDropdown from "./AccountDropdown.jsx";
import FilterButton from "./FilterButton.jsx";

function contains(collection, item) {
	if(collection.indexOf(item) !== -1) return true;
	else return false;
}

export default class SearchNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notifications : [],
			numUnseen : ''
		};
		this.getNotifications = this.getNotifications.bind(this);
        this.seeNotifications = this.seeNotifications.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.handleResetFilterUser = this.handleResetFilterUser.bind(this);
		this.handleResetFilterButtons = this.handleResetFilterButtons.bind(this);
	}
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
	getNotifications() {
		$.post('/getNotifications', 
            function(data) {
                var notifications = [];
                var count = 0;
                data.notification_list.map(function(obj) {
                    if (!obj['seen']) count++; 
                    notifications.unshift({
                        comment_id : obj['comment_id'],
                        notification_id : obj['notification_id'],
                        timeString : obj['timeString'],
                        sender_id : obj['sender_id'],
                        action : obj['action'],
                        receiver_id : obj['receiver_id'],
                        seen : obj['seen']
                    });
                });
                this.setState({notifications : notifications});
                this.setState({numUnseen: String(count)});
            }.bind(this));
		this.seeNotifications();
	}
	seeNotifications() {
        this.state.notifications.map(function (obj){
            $.post('/seeNotification', {notification_id: obj['notification_id']})
        });
    }
	handleResetFilterUser() {
		this.props.handleFilterUser(this.props.userIdToFilterPosts);
	}
	handleResetFilterButtons() {
		this.props.actions.map(function(action) {
			if (contains(filters, action)) this.props.handleFilterClick(action, true);
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
						<button type="button" className="SearchNavBarGlyphicon navbar-toggle" data-toggle="collapse" 
										data-target="#bs-example-navbar-collapse-1">
				            <span className="sr-only">Toggle navigation</span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				            <span className="icon-bar"></span>
				          </button>
				          <Link to="/" onClick={this.handleResetFilterUser} className="SearchNavBarGlyphicon navbar-brand navbar-brand-logo">
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
				          	<NotificationsDropdown notifications={this.state.notifications} numUnseen={this.state.numUnseen} getNotifications={this.getNotifications}/>
				          	<AccountDropdown name={this.props.name}/>
				          </ul>
				         <form className="navbar-form navbar-right navbar-search-form" role="search">                  
			                 <div className="form-group">
			                 	  <div className="input-group input-group-unstyled">
				                      <input type="text" value={this.props.searchText} ref={(input) => this.searchText = input} 
				                      			id="searchInput" className="form-control" placeholder="Search..." 
				                      			onChange={this.handleSearch}/>
				                      <div className = "input-group-addon"></div>
								  	  {this.props.actions.map(function(action, i) {
											var button = !that.props.isComment ? <FilterButton key={i} onClick={that.props.onClick} active={true} isSearch={true} name={action}/> : '';
											return button;
										})}
								  </div>
								  
			                 </div> 
			              </form>
				        </div>
				      </div>
				    </nav>
		)
	}
}