class OriginalPost extends React.Component{
	constructor(props) {
		super(props);
	}



	render() {
		return(
			<div id="OriginalPost" className="pull-left">
				<h1> {this.props.original_post['postContent']} </h1> 
			</div>
			);
	}
}