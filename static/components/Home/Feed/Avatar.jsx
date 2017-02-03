var React = require('react');

export default class Avatar extends React.Component {
	render() {
		return (
			this.props.source != undefined && <a href="#" className="pull-left AvatarSpace">
				<img className="Avatar" src={this.props.source}/>
			</a>
			)
	}
}