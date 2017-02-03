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
	componentWillReceiveProps(nextProps) {
		$('select[name=' + nextProps.field + ']').val(nextProps.value);
		if (!this.state.hasMounted) {
			if (nextProps.value) {
				this.setState({ valid : "valid", hasMounted : true });
				this.props.handleBlur(nextProps.field, "valid");
			}
			else 
				this.setState({ hasMounted : true });
		}
	}
	render() {
		var options;
		var field = this.props.field;
		var setting_border = "";
		switch (field) {
			case "month_of_birth" : 
				options = months;
				setting_border = "month-setting";
				break;
			case "day_of_birth" : 
				options = days;
				setting_border = "day-setting";
				break;
			case "year_of_birth" : 
				options = years;
				setting_border = "year-setting";
				break;
			case "avatar" :
				options = avatar_list;
				break;
		}
		return (
				<div>
					<select className={setting_border + " select_setting form-control " + this.state.valid} id={field} name={field}
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