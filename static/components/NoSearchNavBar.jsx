var React = require('react');
var Link = require('react-router').Link;
var browserHistory = require('react-router').browserHistory;
import NotificationsDropdown from "./NotificationsDropdown.jsx";
import AccountDropdown from "./AccountDropdown.jsx";

export default class NoSearchNavBar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			notifications : [],
			numUnseen : ''
		};
		this.getNotifications = this.getNotifications.bind(this);
        this.seeNotifications = this.seeNotifications.bind(this);
	}
	componentDidMount() {
		$('.SearchNavBarGlyphicon').focus(function() {
	    	$(this).blur();
	    });
	}
	getNotifications() {
		$.post('/getNotifications', {userID : this.props.currentUser['userID']}, 
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
            $.post('/seeNotifications', {notification_id: obj['notification_id']})
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
				          	<NotificationsDropdown notifications={this.state.notifications} numUnseen={this.state.numUnseen} getNotifications={this.getNotifications}/>
				          	<AccountDropdown name={this.props.name}/>
				          </ul>
				        </div>
				      </div>
				    </nav>
			);
	}
}