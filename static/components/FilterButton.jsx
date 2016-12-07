var React = require('react');
export default class FilterButton extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		var that = this;
		this.props.onClick(that.props.name, that.props.isSearch);
	}
	render() {
		var icon;
		var active = this.props.active ? "icon-success" : "icon-danger";
		switch(this.props.name) {
			case 'Trade' : 
				icon="glyphicon glyphicon-transfer";
				break;
			case 'Play' :
				icon="glyphicon glyphicon-play";
				break;
			case 'Chill' :
				icon="glyphicon glyphicon-time";
				break;
			default : 
				alert('Invalid action.')
		}
		return(<a className="input-group-addon">
			<span className={icon + " " + active + " filterButton"}
					onClick={this.handleClick}>
					</span>
			</a>);
	}
}

FilterButton.defaultProps = {
	isSearch : false
};