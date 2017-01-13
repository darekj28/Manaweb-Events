var React = require('react');
import FilterButton from "./FilterButton.jsx";

export default class MakePost extends React.Component {
	componentDidMount() {
		$('.post-button').click(function() {
			$(this).blur();
		});
		$('#MessagePost').hide();
		$('#TogglePost').click(function() {
			$('#MessagePost').slideToggle(function() {
				$('#PostInput').focus();
			});
		})
	}
	handlePostSubmit() {
		if (this.postText.value.trim().length > 0)
			this.props.onPostSubmit(this.postText.value);
	}
	handlePostChange() {
		this.props.onPostChange(this.postText.value);
	}
	render() {
		return(
			<div> 
				<div id="TogglePost"><h4>Post a message...</h4></div>
				<div id="MessagePost">
					<textarea id="PostInput" className="PostText form-control" 
							value={this.props.postText} rows="4"
							placeholder={this.props.placeholder} ref={(input) => this.postText = input} 
							onSubmit={this.handlePostSubmit} onChange={this.handlePostChange.bind(this)}></textarea>
					{this.props.actions.map(function(action, i) {
						return <FilterButton key={i} onClick={this.props.onClick} selected={false} name={action}/>;
					}, this)}
					<div className="input-group-addon"
							onClick={this.handlePostSubmit.bind(this)}>
						<button className="btn post-button">POST!</button>
					</div>	
				</div>
			</div>);
	}
}