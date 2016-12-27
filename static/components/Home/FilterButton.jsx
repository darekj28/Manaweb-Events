var React = require('react');
export default class FilterButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {isSelected : this.props.selected};
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		this.setState({ isSelected : !this.state.isSelected });
		this.props.onClick(this.props.name, this.props.isSearch);
	}

	componentDidMount() {
		$('[data-toggle="tooltip"]').tooltip(); 
	}

	render() {
		var icon;
		var selected = this.state.isSelected ? "icon-success" : "icon-danger";
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
				alert('Invalid action.');
		}
		if (!this.props.isSearch)
			return(<a className="input-group-addon" data-container="body" data-toggle="tooltip" title= {this.props.name}>
					<span className={icon + " filterButton " + selected} onClick={this.handleClick}>
					</span>
				</a>)
		else return(<a className="input-group-addon">
					<span className={icon + " filterButton " + selected} onClick={this.handleClick}>
					</span>
				</a>
			);
	}
}

FilterButton.defaultProps = {
	isSearch : false
};