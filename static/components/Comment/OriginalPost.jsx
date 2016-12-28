var React = require('react');
export default class OriginalPost extends React.Component{
	render() {
		return(
			<div id="OriginalPost" className="pull-left">
				<h1> {this.props.original_post['postContent']} </h1> 
			</div>
			);
	}
}