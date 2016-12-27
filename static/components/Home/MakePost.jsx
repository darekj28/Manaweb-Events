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
		$(document).ready(function(){
		    $('[data-toggle="tooltip"]').tooltip(); 
		});
		$('#SubmitButtonPost').click(function() {
			$(this).blur();
		});
		$('#MessagePost').hide();
		$('#TogglePost').click(function() {
			$('#MessagePost').fadeToggle(function() {
				$('#PostInput').focus();
			});
		})
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
		return(
			<div> 
				<div id="TogglePost">Post a message...</div>
				<div id="MessagePost" className="Message pull-right input-group input-group-unstyled">
					<input id="PostInput" type="text" className="PostText form-control" 
							onKeyPress={this.handleEnterPress} value={this.props.postText} 
							placeholder={this.props.placeholder} ref={(input) => this.postText = input} 
							onSubmit={this.handlePostSubmit} onChange={this.handlePostChange}></input>
					{this.props.actions.map(function(action, i) {
						return <FilterButton key={i} onClick={this.props.onClick} selected={false} name={action}/>;
					}, this)}
					<a className="SubmitButton input-group-addon" id="SubmitButtonPost" 
							onClick={this.handlePostSubmit} data-toggle = "tooltip" title = "Post">
						<span className="glyphicon glyphicon-send AppGlyphicon"></span>
					</a>	
				</div>
			</div>);
	}
}