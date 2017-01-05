var React = require('react');

var days = generateDays();
var years = generateYears();
var avatars = ["Ajani", "Chandra", "Elspeth", "Gideon", "Jace", "Liliana", "Nahiri", "Nicol", "Nissa", "Ugin"];
var months = [	{label : "January",  value: 1,  days : 31}, {label : "February", value: 2,  days : 29}, {label : "March", 	 value: 3,  days : 31}, {label : "April", 	 value: 4,  days : 30}, {label : "May", 	 value: 5,  days : 31}, {label : "June", 	 value: 6,  days : 30}, {label : "July", 	 value: 7,  days : 31}, {label : "August", 	 value: 8,  days : 31}, {label : "September",value: 9,  days : 30}, {label : "October",  value: 10, days : 31}, {label : "November", value: 11, days : 30}, {label : "December", value: 12, days : 31}];
var avatar_list = generateAvatars(avatars);

export default class SettingsSelectInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { valid : "", warning : "", hasMounted : false };
	}
	handleSelect(event) {
		var obj = {};
		obj[this.props.field] = event.target.value;
		this.props.handleSelect(obj);
	}
	handleBlur(event) {
		var isValid = testValid(this.props.field, event.target.value);
		this.setState({ valid : isValid, 
					warning : warningForField(this.props.field, event.target.value) });
		this.props.handleBlur(this.props.field, isValid);
	}
	handleAvatarDisplay() {
		var av = $('#avatar').val();
		if (av) {
			var container = document.getElementById('avatar_container');
			container.style.backgroundImage = 'url(static/avatars/' + av + '.png)';
		}
	}
	componentWillReceiveProps(nextProps) {
		$('select[name=' + nextProps.field + ']').val(nextProps.value);
		if (this.props.field == "avatar") this.handleAvatarDisplay.bind(this)();
		if (!this.state.hasMounted) {
			var isValid = testValid(nextProps.field, nextProps.value); 
			if (isValid == "valid")
				this.setState({ valid : isValid, hasMounted : true });
			else 
				this.setState({ hasMounted : true });
		}
	}
	componentDidMount() {
		if (this.props.value) this.setState({ valid : "valid" });
	}
	render() {
		var options;
		var field = this.props.field;
		switch (field) {
			case "month_of_birth" : 
				options = months;
				break;
			case "day_of_birth" : 
				options = days;
				break;
			case "year_of_birth" : 
				options = years;
				break;
			case "avatar" :
				options = avatar_list;
				break;
		}
		return (
				<div>
					<select className={"select_setting " + this.state.valid} id={field} name={field}
									title={idToName(field)}
									onChange={this.handleSelect.bind(this)} onBlur={this.handleBlur.bind(this)}> 
						<option value="" disabled selected>{idToTimeLabel(field)}</option>
						{options.map(function(option) {
							return <option value={option.value}>{option.label}</option>
						})}
					</select>
					{(this.state.valid == "invalid") && 
					<div className="warning" id={field + "_warning"}>
						{this.state.warning}
					</div>}
				</div>
			);
	}
}