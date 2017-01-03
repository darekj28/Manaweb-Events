var React = require('react');
var Link = require('react-router').Link;
import LoginForm from './LoginForm.jsx';
import RegisterForm from './RegisterForm.jsx';

function remove(array, value) {
	var index = array.indexOf(value);
	if (index != -1) array.splice(index, 1);
	return array;
}
function add(array, value) {
	var index = array.indexOf(value);
	if (index === -1) array.push(value);
	return array;
}
function contains(collection, item) {
	if(collection.indexOf(item) !== -1) return true;
	else return false;
}
var text_fields = [	"username", "password", "password_confirm", "first_name", "last_name", "email_address", "phone_number" ];
var select_fields = [ "month_of_birth", "day_of_birth", "year_of_birth", "avatar" ];
var required_text_fields = [ "first_name", "last_name", "username", "email_address", "password" ];

export default class LoginNavBar extends React.Component {
	constructor() {
		super();
		this.state = {	login_register 		: 'LoginTab', // specify tab
						error 				: "",
						login_user 			: '', // login save state
						login_password 		: '', 
						ip 					: "",
						first_name 			: '', // register save state
						last_name  			: '',
						username 			: '',
						email_address		: '',
						password			: '',
						password_confirm 	: '',
						phone_number 		: '',
						month_of_birth 		: '',
						day_of_birth 		: '',
						year_of_birth 		: '',
						avatar 				: '',
						valid_text_fields	: [],
						valid_select_fields	: [],
						submittable			: false};
	}
	switchMenu(event) {
		this.setState({ login_register : event.currentTarget.id });
	} 
	// login handlers
	handleTyping(event) {
		var obj = {}; 
		obj[event.target.id] = event.target.value;
		this.setState(obj);
	}
	initializeIp(){
    	$.get('https://jsonip.com/', function(r){ 
    		this.setState({ip: r.ip}) 
    		console.log("after initialize ip")
    	}.bind(this))
    }
    // register handlers
    handleChange(obj) { this.setState(obj); }

	handleTextBlur(field, valid) {
		var valid_text_fields = this.state.valid_text_fields;
		var valid_select_fields = this.state.valid_select_fields;
		if (valid == "valid") this.setState({ valid_text_fields : add(valid_text_fields, field) });
		else this.setState({ valid_text_fields : remove(valid_text_fields, field) });
		this.setState({ submittable : required_text_fields.every(field => contains(valid_text_fields, field)) && 
									  select_fields.every(field => contains(valid_select_fields, field)) });
	}
	handleSelectBlur(field, valid) {
		var valid_text_fields = this.state.valid_text_fields; 
		var valid_select_fields = this.state.valid_select_fields;
		if (valid == "valid") this.setState({ valid_select_fields : add(valid_select_fields, field) });
		else this.setState({ valid_select_fields : remove(valid_select_fields, field) });
		this.setState({ submittable : required_text_fields.every(field => contains(valid_text_fields, field)) && 
									  select_fields.every(field => contains(valid_select_fields, field)) });
	}
	render() {
		var login_selected = this.state.login_register == "LoginTab" ? "login_selected" : "";
		var register_selected = this.state.login_register == "RegisterTab" ? "register_selected" : "";
	
		return (
			<div>
				<nav className="navbar navbar-default" role="navigation">
				  <div className="container">
			       		<div className="navbar-header">
		                 	<Link to="/" className="navbar-brand navbar-brand-logo">
		                        <span className="glyphicon glyphicon-home"></span>
		                  	</Link>
			        	</div>
			        	<div id="LoginRegisterLabel" className="pull-right SearchNavBarGlyphicon navbar-toggle navbar-toggle-always" 
		                  		data-toggle="offcanvas" data-target="#LoginRegisterMenu">
                  			<b> Login &#8226; Register </b>
                  		</div>
				  </div>

				</nav>
				<nav id="LoginRegisterMenu" className="navmenu navmenu-default navmenu-fixed-right offcanvas" 
							role="navigation">
					<div className="container" id="NavMenuHeader">
					  	<div className={"tab_label " + login_selected} 
					  		id="LoginTab" onClick={this.switchMenu.bind(this)}>
					  		<h2><b>Login</b></h2>
					  	</div>
					  	<div className={"tab_label " + register_selected} 
					  		id="RegisterTab" onClick={this.switchMenu.bind(this)}>
					  		<h2><b>Register</b></h2>
					  	</div>
					</div>
				  	{this.state.login_register == "LoginTab" &&
				  		<LoginForm login_user=			{this.state.login_user}
				  					login_password=		{this.state.login_password}
				  					ip=					{this.state.ip}
				  					handleTyping=		{this.handleTyping.bind(this)}
				  					initializeIp=		{this.initializeIp.bind(this)}/>}
				  	{this.state.login_register == "RegisterTab" &&
			  			<RegisterForm first_name=		{this.state.first_name}
			  						last_name=   		{this.state.last_name}
			  						username=    		{this.state.username}
			  						email_address=		{this.state.email_address}
			  						password= 			{this.state.password}
			  						password_confirm=	{this.state.password_confirm}
			  						phone_number=		{this.state.phone_number}
			  						month_of_birth=		{this.state.month_of_birth}
			  						day_of_birth=		{this.state.day_of_birth}
			  						year_of_birth=		{this.state.year_of_birth}
			  						avatar=				{this.state.avatar}
			  						valid_text_fields=  {this.state.valid_text_fields}
			  						valid_select_fields={this.state.valid_select_fields}
			  						submittable=		{this.state.submittable}
			  						handleChange=		{this.handleChange.bind(this)}
			  						handleTextBlur=		{this.handleTextBlur.bind(this)}
			  						handleSelectBlur=	{this.handleSelectBlur.bind(this)}/> }
				</nav>
			</div>
		)
	}
}