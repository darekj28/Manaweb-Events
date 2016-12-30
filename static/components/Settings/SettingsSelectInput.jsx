var React = require('react');

function idToName (id) {
	var arr = id.split('_');
	var str = "";
	var temp;
	for (var i = 0; i < arr.length; i++){
		temp = arr[i].charAt(0).toLowerCase() + arr[i].substr(1).toLowerCase();
		str = str.concat(temp + ' ');
	}
	return str;
}

function testValid (field, value) {
	if (!value) return "invalid";
	switch (field) {
		case "month_of_birth":
			var day = $('#day_of_birth').val();
			if (day) return isValidMonth(day, value);
		case "day_of_birth":
			var month = $('#month_of_birth').val();
			if (month) return isValidDay(month, value);
		case "year_of_birth":
			return isValidYear(value);
		default :
			return "valid";
	}
	return "valid";
}

function warningForField(field, value) {
	if (!value) return "You can\'t leave this empty.";
	switch (field) {
		case "month_of_birth" :
			return "Hmm, the month doesn\'t look right. There aren't that many days in that month.";
		case "day_of_birth" :
			return "Hmm, the day doesn\'t look right. Be sure to use a 1 or 2-digit number that is a day of the month.";
		case "year_of_birth" :
			return "Hmm, the year doesn\'t look right. Be sure to use a 4-digit number.";
		default :
			return "Invalid " + idToName(field);
	}
	return "Invalid " + idToName(field);
}

function isValidMonth(day, month) {
	var max_days;
	for (var i = 0; i < months.length; i++)
		if (parseInt(month) == months[i].value)
			max_days = months[i].days;
	if (day <= max_days) return "valid";
	else return "invalid";
}

function isValidDay(month, day) {
	var max_days;
	for (var i = 0; i < months.length; i++)
		if (parseInt(month) == months[i].value)
			max_days = months[i].days;
	if (day <= max_days) return "valid";
	else return "invalid";
}

function isValidYear(year) {
	var high = 2006; var low = 1900;
	if (parseInt(year) > high || parseInt(year) < low) return "invalid";
	else return "valid";
}

function generateDays() {
	var days = [];
	var start = 1; var end = 31;
	for (var i = start; i <= end; i++) {
		days.push({ label : i, value : i});
	}
	return days;
}

function generateYears() {
	var years = [];
	var current_year = new Date().getFullYear();
	var start = current_year - 60; var end = current_year;
	for (var i = start; i <= end; i++) {
		years.push({ label : i, value : i});
	}
	return years;
}

function generateAvatars(arr) {
	var avatars = [];
	for (var i = 0; i < arr.length; i++) {
		avatars.push({ label : arr[i], value : arr[i].toLowerCase() });
	}
	return avatars;
}

var days = generateDays();
var years = generateYears();
var avatars = ["Ajani", "Chandra", "Elspeth", "Gideon", "Jace", "Lilianna", "Nahiri", "Nicol", "Nissa", "Ugin"];
var months = [	{label : "January",  value: 1,  days : 31}, {label : "February", value: 2,  days : 29}, {label : "March", 	 value: 3,  days : 31}, {label : "April", 	 value: 4,  days : 30}, {label : "May", 	 value: 5,  days : 31}, {label : "June", 	 value: 6,  days : 30}, {label : "July", 	 value: 7,  days : 31}, {label : "August", 	 value: 8,  days : 31}, {label : "September",value: 9,  days : 30}, {label : "October",  value: 10, days : 31}, {label : "November", value: 11, days : 30}, {label : "December", value: 12, days : 31}];
var avatar_list = generateAvatars(avatars);

export default class SettingsSelectInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = { valid : "", warning : "" };
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
	}
	componentDidMount() {
		if (this.props.isUpdate) this.setState({ valid : "valid" });
	}
	render() {
		var options;
		switch (this.props.field) {
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
				<div className="form-group">
					<select className={"setting " + this.state.valid} id={this.props.field} name={this.props.field}
									title={idToName(this.props.field)}
									onChange={this.handleSelect.bind(this)} onBlur={this.handleBlur.bind(this)}> 
						<option value="" disabled selected> -- Select -- </option>
						{options.map(function(option) {
							return <option value={option.value}>{option.label}</option>
						})}
					</select>
				</div>
				{(this.state.valid == "invalid") && 
					<div className="form-group warning" id={this.props.field + "_warning"}>
						{this.state.warning}
					</div>}
			</div>
			);
	}
}