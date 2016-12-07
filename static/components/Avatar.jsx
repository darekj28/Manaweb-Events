var React = require('react');

export default class Avatar extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<a href="#" className="pull-left AvatarSpace">
				<img className="Avatar img-rounded" src={this.props.source}/>
			</a>
			)
	}
}