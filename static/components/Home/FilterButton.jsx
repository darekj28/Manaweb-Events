var React = require('react');
export default class FilterButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {isSelected : this.props.selected};
	}
	handleClick() {
		this.setState({ isSelected : !this.state.isSelected });
		this.props.onClick(this.props.name, this.props.isSearch);
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
			return(<div className="input-group-addon make-post-filter" onClick={this.handleClick.bind(this)}>
					<span className={icon + " filterButton " + selected}>
					</span>
					<div className={"make-post-filter-text " + selected}>{this.props.name}</div>
				</div>)
		else return(<div className="input-group-addon text-center" onClick={this.handleClick.bind(this)}>
					<span className={icon + " " + selected} >
					</span>
					<div className="filter-caption">{this.props.name}</div>
				</div>
			);
	}
}

FilterButton.defaultProps = {
	isSearch : false
};