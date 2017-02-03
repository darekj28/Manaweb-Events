var React = require('react');
import FilterButton from "./FilterButton.jsx";

export default class MakePost extends React.Component {
	constructor(props) {
		super(props);
		this.state = { canPost : true };
	}
	componentDidMount() {
		$('.post-button').click(function() {
			$(this).blur();
		});
		$('.post-button').focus(function() {
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
		if (!this.state.canPost) swal("Yo!", "Please wait 30 seconds between posts.", "warning");
		else {
			if (this.postText.value.trim().length > 0) {
				this.setState({ canPost : false });
				this.props.onPostSubmit(this.postText.value, this.undoTimeout.bind(this));
				this.setState({ timeout : setTimeout(function() { this.setState({ canPost : true }); }, 30000) });
			}
			else 
				swal("Oops...", "You can't post an empty message!", "error");
		}
	}
	undoTimeout() {
		clearTimeout(this.state.timeout);
		this.setState({ canPost : true });
	}
	handlePostChange() {
		this.props.onPostChange(this.postText.value);
	}
	componentWillUnmount() {
		this.undoTimeout.bind(this)();
	}
	render() {
		return(
			<div id="MakePost"> 
				<div id="TogglePost" className="important-text">Post a message...</div>
				<div id="MessagePost">
					<textarea id="PostInput" className="important-text form-control" 
							value={this.props.postText} rows="4"
							placeholder={this.props.placeholder} ref={(input) => this.postText = input} 
							onSubmit={this.handlePostSubmit} onChange={this.handlePostChange.bind(this)}></textarea>
					{this.props.actions.map(function(action, i) {
						return <FilterButton key={i} onClick={this.props.onClick} selected={false} name={action}/>;
					}, this)}
					<div className="input-group-addon" onClick={this.handlePostSubmit.bind(this)}>
						<button className="btn post-button"><b>Post</b></button>
					</div>	
				</div>
			</div>);
	}
}