var React = require('react');
export default class FilterButton extends React.Component {
	constructor(props) {
		super(props);
		this.state = {isSelected : this.props.selected};
		this.handleClick = this.handleClick.bind(this);
	}
	handleClick() {
		var that = this;
		this.setState({ isSelected : !this.state.isSelected });
		this.props.onClick(that.props.name, that.props.isSearch);
	}

	componentDidMount() {
		$(document).ready(function(){
		    $('[data-toggle="tooltip"]').tooltip(); 
		});
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
		return(<a className="input-group-addon" data-toggle="tooltip" title= {this.props.name}>
			<span className={icon + " filterButton " + selected}
					onClick={this.handleClick}>
					</span>
			</a>);
	}
}

FilterButton.defaultProps = {
	isSearch : false
};