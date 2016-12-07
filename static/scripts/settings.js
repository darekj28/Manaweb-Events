$(document).ready(function() {
	var requiredFields = ["#first_name",
						"#last_name",
						"#birthMonth",
						"#birthDay",
						"#birthYear",
						"#password",
						"#password_confirm",
						"#avatar"];


	var months=[{month : "January",  index: 1,  days : 31},
				{month : "February", index: 2,  days : 29},
				{month : "March", 	 index: 3,  days : 31},
				{month : "April", 	 index: 4,  days : 30},
				{month : "May", 	 index: 5,  days : 31},
				{month : "June", 	 index: 6,  days : 30},
				{month : "July", 	 index: 7,  days : 31},
				{month : "August", 	 index: 8,  days : 31},
				{month : "September",index: 9,  days : 30},
				{month : "October",  index: 10, days : 31},
				{month : "November", index: 11, days : 30},
				{month : "December", index: 12, days : 31}];
	// initialize day dropdown
	var dayOptions = document.getElementById("birthDay");
	var dayList = new Array();
	var days = 32;
	for (var i = 1; i < days; i++){
		dayList[i] = i;
	}

	// Loop through the array
	for(var i = 0; i < dayList.length; i++) {
		var opt = dayList[i];
	    var el = document.createElement("option");
	    el.textContent = opt;
	    el.value = opt;
	    dayOptions.appendChild(el);
	}

	// initialize year dropdown			
	var yearOptions = document.getElementById("birthYear");
	var yearList =  new Array();
	var firstYear = 1951;
	var totalYears = 67;
	for (var i = 0; i < totalYears; i++) {
		yearList[i] = firstYear + i;
	}

	// Loop through the array
	for(var i = 0; i < yearList.length; i++) {
		var opt = yearList[i];
	    var el = document.createElement("option");
	    el.textContent = opt;
	    el.value = opt;
	    yearOptions.appendChild(el);
	}

	var autopopulateSettings = function() {
		$.ajax({
			type: 'GET',
			url: '/getPreviousSettings',
			success: function(user) {
				console.log(user.avatar_name);
				$('#first_name').val(user.first_name);
				$('#last_name').val(user.last_name);
				$('#password').val(user.password);
				$('#password_confirm').val(user.password);
				$('select[name=birthDay]').val(user.birthDay);
				$('select[name=birthYear]').val(user.birthYear);
				$('select[name=birthMonth]').val(user.birthMonth);
				$('select[name=avatar]').val(user.avatar_name);
				$('#phone_number').val(user.phone_number);
			}
		});
	};

	var initialize =  function() {
		for (var i = 0; i < requiredFields.length; i++) {
			$(requiredFields[i]).addClass("required");
			$(requiredFields[i]).addClass("valid");
		}
		autopopulateSettings();
	};

	var enableSubmit = function() {
		var disabled = false;
		for (var i = 0; i < requiredFields.length; i++) {
			if (!$(requiredFields[i]).hasClass("valid")) {
				disabled = true;
			}
		}
		if ($('#updateSettingsButton').hasClass("disabled")) { 
			$('#updateSettingsButton').removeClass("disabled");
			$('#updateSettingsButton').prop("disabled", false);
		}
		if (disabled) {
			$('#updateSettingsButton').addClass("disabled");
			$('#updateSettingsButton').prop("disabled", true);
		}
	};
	initialize();
	enableSubmit();

	var errorMaker = function(string) {
		return '<div class=\'col-sm-offset-3\'style=\'color:red\'>' + string + '</div>';
	};
	var empty = errorMaker("You can\'t leave this empty.");
	var invalid = errorMaker("This is not a valid input.");
	var no_match = errorMaker("Your passwords don\'t match.");
	var day_error = errorMaker("Hmm, the day doesn\'t look right. Be sure to use a 1 or 2-digit number that is a day of the month.");
	var year_error = errorMaker("Hmm, the year doesn\'t look right. Be sure to use a 4-digit number.");

	var invalidate = function(id) {
		if (!$(id).hasClass('invalid')) {
			$(id).addClass('invalid');
		}
		if ($(id).hasClass('valid')) {
			$(id).removeClass('valid');
		}
	};

	var validate = function(id) {
		if (!$(id).hasClass('valid')) {
			$(id).addClass('valid');
		}
		if ($(id).hasClass('invalid')) {
			$(id).removeClass('invalid');
		}
	};


	$('#first_name').on('blur', function(event) {
		event.preventDefault();
		var name = $(this).val();
		var condition = /^[a-z ,.'-]+$/i;
		if (name == '') {
			invalidate('#firstName');
			$('#name_warning').html(empty);
			
		}
		else if (!name.match(condition)) {
			invalidate('#firstName');
			$('#name_warning').html(invalid);
		}
		else {
			validate('#firstName');
		}
		if (!$(this).hasClass('invalid') && !$('#lastName').hasClass('invalid')) {
			$('#name_warning').empty();
		}
		enableSubmit();
	});
	$('#last_name').on('blur', function(event) {
		event.preventDefault();
		var name = $(this).val();
		var condition = /^[a-z ,.'-]+$/i;
		if (name == '') {
			invalidate('#lastName');
			$('#name_warning').html(empty);
		}
		else if (!name.match(condition)) {
			invalidate('#lastName');
			$('#name_warning').html(invalid);
		}
		else {
			validate('#lastName');
		}
		if (!$(this).hasClass('invalid') && !$('#firstName').hasClass('invalid')) {
			$('#name_warning').empty();
		}
		enableSubmit();
	});

	$('#password').on('focus', function(event) {
		$('#password').popover();
	});

	$('#password').popover().on('blur', function(event) {
		event.preventDefault();
		var password = $(this).val();
		var password_confirm = $('#password_confirm').val();
		var condition = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,}$/;
		if (password == '') {
			invalidate('#password');
			$('#password_warning').html(empty);
		}
		else if (!password.match(condition)) {
			invalidate('#password');
			$('#password_warning').html(invalid);
		}
		else {
			if (password_confirm.length > 0) {
				if (password_confirm != password) {
					invalidate('#password_confirm');
					validate('#password');
					$('#password_warning').empty();
					$('#password_confirm_warning').html(no_match);
				}
				else {
					validate('#password_confirm');
					validate('#password');
					$('#password_warning').empty();
					$('#password_confirm_warning').empty();
				}
			}
			else {
				validate('#password');
				$('#password_warning').empty();
			}
		}
		enableSubmit();
	});
	
	$('#password_confirm').on('blur', function(event) {
		event.preventDefault();
		var password = $('#password').val();
		var password_confirm = $(this).val();
		if (password_confirm == '') {
			invalidate('#password_confirm');
			$('#password_confirm_warning').html(empty);
		}
		else if (password_confirm != password) {
			invalidate('#password_confirm');
			$('#password_confirm_warning').html(no_match);
		}
		else {
			validate('#password_confirm');
			$('#password_confirm_warning').empty();
		}
		enableSubmit();
	});

	$('#birthMonth').on('change', function(event) {
		event.preventDefault();

		var month = $('#birthMonth').val();
		var day = $('#birthDay').val();

		var max_days = 31;
		if (parseInt(month) >= 1 && parseInt(month) <= 12) {
			for (var i = 0; i < months.length; i++) {
				if (parseInt(month) == months[i].index) {
					max_days = months[i].days;
				}
			}
			validate('#birthMonth');
			$('#month_warning').empty();
		}
		else {
			invalidate('#birthMonth');
			$('#month_warning').html(empty);
		}
		if (day != '') {
			if (parseInt(day) >= 1 && parseInt(day) <= max_days) {
				validate('#birthDay');
				$('#day_warning').empty();
			}
			else {
				invalidate('#birthDay');
				$('#day_warning').html(day_error);
			}
		}
		enableSubmit();
	});
	$('#birthDay').on('change', function(event) {
		event.preventDefault();
		var month = $('#birthMonth').val();
		var day = $('#birthDay').val();

		var max_days = 31;

		if (month != '') {
			for (var i = 0; i < months.length; i++) {
				if (parseInt(month) == months[i].index) {
					max_days = months[i].days;
				}
			}
		}
		
		if (day != '') {
			if (parseInt(day) >= 1 && parseInt(day) <= max_days) {
			

				validate('#birthDay');
				$('#day_warning').empty();
			}
			else {
				invalidate('#birthDay');
				$('#day_warning').html(day_error);
			}
		}
		else {
			invalidate('#birthDay');
			$('#day_warning').html(empty);
		}	
		enableSubmit();	
	});
	$('#birthYear').on('change', function(event) {
		event.preventDefault();
		var year = $('#birthYear').val();
		if (year == '') {
			invalidate('#birthYear');
			$('#year_warning').html(empty);
		}
		else if (parseInt(year) > 2006 || parseInt(year) < 1900) {
			invalidate('#birthYear');
			$('#year_warning').html(year_error);
		}
		else {
			validate('#birthYear');
			$('#year_warning').empty();
		}
		enableSubmit();
	});

	$('#avatar').on('change', function(event) {
		event.preventDefault();
		enableSubmit();
	})

});