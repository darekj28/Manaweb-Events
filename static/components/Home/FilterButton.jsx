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
		var make_post_selected = this.state.isSelected ? "make-post-selected" : "make-post-unselected";
		switch(this.props.name) {
			case 'Trade' : 
				icon="fa fa-handshake-o";
				break;
			case 'Play' :
				icon="fa fa-play";
				break;
			case 'Chill' :
				icon="fa fa-snowflake-o";
				break;
			default : 
				alert('Invalid action.');
		}
		if (!this.props.isSearch)
			return(<div className="input-group-addon make-post-filter" onClick={this.handleClick.bind(this)}>
					<span className={icon + " filterButton " + make_post_selected}>
					</span>
					<div className={"make-post-filter-text " + make_post_selected}>{this.props.name}</div>
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