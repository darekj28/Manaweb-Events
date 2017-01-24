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
	componentDidMount() {
		$('[data-toggle="tooltip"]').tooltip(); 
		// $('p a').tooltip({placement: 'bottom',trigger: 'manual'}).tooltip('show');
	}

	componentWillUnmount(){
		// $('[data-toggle="tooltip"]').tooltip('destroy'); 
	}

	render() {
		var icon;
		var selected = this.state.isSelected ? "icon-success" : "icon-danger";

		if (this.props.isSearch){
			$('[data-toggle="tooltip"]').tooltip('show'); 
		}
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
			return(<a className="input-group-addon">
					<span className={icon + " filterButton " + selected} data-container="body" data-toggle="tooltip"
					 title={this.props.name} onClick={this.handleClick.bind(this)}>
					</span>
				</a>)
		else return(<a className="input-group-addon">
					<span className={icon + " filterButton " + selected} data-container="body" 
					data-toggle="tooltip"
					 title={this.props.name}
					 data-placement="bottom" onClick={this.handleClick.bind(this)}>
					</span>
				</a>
			);
	}
}

FilterButton.defaultProps = {
	isSearch : false
};