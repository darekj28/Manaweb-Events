var React = require('react');
// var $ = require('jquery');
import FilterButton from "./FilterButton.jsx";

export default class MakePost extends React.Component {
	constructor(props) {
		super(props);
		this.handlePostChange = this.handlePostChange.bind(this);
		this.handlePostSubmit = this.handlePostSubmit.bind(this);
		this.handleEnterPress = this.handleEnterPress.bind(this);
	}
	componentDidMount() {
		var messageVisible = true;
		var that = this;

		$('#SubmitButtonPost').click(function() {
			$(this).blur();
		});
		$('#StartButtonPost').click(function(){
			$(this).blur();
	        if(!messageVisible){
	            messageVisible = !messageVisible;
	            $(this).siblings('#MessagePost').fadeIn(function(){
	                $(this).children('#PostTextPost').focus();
	            });
	        } else {
	            messageVisible = !messageVisible;
	            $(this).siblings('#MessagePost').fadeOut(function(){
	                $(this).children('#PostTextPost').blur();
	            });
	        } 
	    });
	    
	}
	handlePostSubmit() {
		if (this.postText.value.length > 0)
			this.props.onPostSubmit(this.postText.value);
	}
	handlePostChange() {
		this.props.onPostChange(this.postText.value);
	}
	handleEnterPress(target) {
		if (this.postText.value.length > 0)
		    if (target.charCode==13)
		        this.props.onPostSubmit(this.postText.value); 
	}
	render() {
		var that = this;
		return(
			<div> 
				<a id="StartButtonPost" className="StartButton">
					<span className="glyphicon glyphicon-pencil AppGlyphicon"></span>
				</a>
				<div id="MessagePost" className="Message pull-right input-group input-group-unstyled">
					<input id="PostTextPost" type="text" className="PostText form-control" 
							onKeyPress={this.handleEnterPress} value={this.props.postText} 
							placeholder={this.props.placeholder} ref={(input) => this.postText = input} 
							onSubmit={this.handlePostSubmit} onChange={this.handlePostChange}></input>
					{this.props.actions.map(function(action, i) {
						if (action == "Trade") return <FilterButton key={i} onClick={that.props.onClick} active={true} name={action}/>;
						else return <FilterButton key={i} onClick={that.props.onClick} active={false} name={action}/>;
					})}
					<a className="SubmitButton input-group-addon" id="SubmitButtonPost" 
							onClick={this.handlePostSubmit}>
						<span className="glyphicon glyphicon-send AppGlyphicon"></span>
					</a>
				
				</div>
			</div>);
	}
}