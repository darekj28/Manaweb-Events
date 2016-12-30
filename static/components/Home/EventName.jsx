var React = require('react');
export default class EventName extends React.Component{
	render() {
		return(
			<div id="EventName" className="pull-left">
				{
					this.props.numUnseenPosts < 0 && 
					<h1> {this.props.name}  </h1> 
				}

				{
					this.props.numUnseenPosts == 0 && 
					<h1> {this.props.name}  ... youre all caught up! </h1> 
				}

				{
					(this.props.numUnseenPosts == 1 && !this.props.shouldViewMore) &&
					<h1>{this.props.name} 
						<small > 
							{this.props.numUnseenPosts} unseen post
						</small>
					 </h1> 
				}

				{
					(this.props.numUnseenPosts == 1 && this.props.shouldViewMore) &&
						<h1> {this.props.name} 
							<small onClick = {this.props.viewMore} > 
								{this.props.numUnseenPosts} unseen post.. Click to view
							</small>
						 </h1> 
				}

				{
					(this.props.numUnseenPosts > 1 && !this.props.shouldViewMore) &&
					<h1>{this.props.name} 
						<small > 
							{this.props.numUnseenPosts} unseen posts
						</small>
					 </h1> 
				}

				{
					(this.props.numUnseenPosts > 1 && this.props.shouldViewMore) &&
						<h1> {this.props.name} 
							<small onClick = {this.props.viewMore} > 
								{this.props.numUnseenPosts} unseen posts.. Click to view
							</small>
						 </h1> 
				}

			</div>
		);
	}
}