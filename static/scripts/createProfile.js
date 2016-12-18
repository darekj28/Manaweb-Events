$(document).ready(function() {
	var requiredFields = ["#first_name",
						"#last_name",
						"#email",
						"#birthMonth",
						"#birthDay",
						"#birthYear",
						"#userID",
						"#gender",
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

	var initialize =  function() {
		for (var i = 0; i < requiredFields.length; i++)
			$(requiredFields[i]).addClass("required");
	};

	initialize();

	var enableSubmit = function() {
		var disabled = false;
		for (var i = 0; i < requiredFields.length; i++) {
			if (!$(requiredFields[i]).hasClass("valid")) {
				disabled = true;
			}
		}
		if ($('#createProfile').hasClass("disabled")) { 
			$('#createProfile').removeClass("disabled");
			$('#createProfile').prop("disabled", false);
		}
		if (disabled) {
			$('#createProfile').addClass("disabled");
			$('#createProfile').prop("disabled", true);
		}
	};
	enableSubmit();

	var errorMaker = function(string) {
		return '<div class=\'col-sm-offset-3\'style=\'color:red\'>' + string + '</div>';
	}
	var empty = errorMaker("You can\'t leave this empty.");
	var invalid = errorMaker("This is not a valid input.");
	var user_taken = errorMaker("This username is already taken.");
	var email_taken = errorMaker("This email already has an account.");
	var no_match = errorMaker("Your passwords don\'t match.");
	var day_error = errorMaker("Hmm, the day doesn\'t look right. Be sure to use a 1 or 2-digit number that is a day of the month.");
	var year_error = errorMaker("Hmm, the year doesn\'t look right. Be sure to use a 4-digit number.");
	var zip_error = errorMaker("Hmm, this doesn't seem to be a valid ZIP code.");

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
		var condition = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
		if (name == '') {
			invalidate('#first_name');
			$('#name_warning').html(empty);
			
		}
		else if (!name.match(condition)) {
			invalidate('#first_name');
			$('#name_warning').html(invalid);
		}
		else {
			validate('#first_name');
		}
		if (!$(this).hasClass('invalid') && !$('#last_name').hasClass('invalid')) {
			$('#name_warning').empty();
		}
		enableSubmit();
	});
	$('#last_name').on('blur', function(event) {
		event.preventDefault();
		var name = $(this).val();
		var condition = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
		if (name == '') {
			invalidate('#last_name');
			$('#name_warning').html(empty);
		}
		else if (!name.match(condition)) {
			invalidate('#last_name');
			$('#name_warning').html(invalid);
		}
		else {
			validate('#last_name');
		}
		if (!$(this).hasClass('invalid') && !$('#first_name').hasClass('invalid')) {
			$('#name_warning').empty();
		}
		enableSubmit();
	});

	$('#email').on('blur', function(event) {
		event.preventDefault();
		var email = $(this).val();
		var condition = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
		if (email == '') {
			invalidate('#email');
			$('#email_warning').html(empty);
		}
		else if (!email.match(condition)) {
			invalidate('#email');
			$('#email_warning').html(invalid);
		}
		else {
			$.ajax({
				data : {
					mail : $('#email').val()
				},
				type : 'POST',
				url : '/verifyEmail',
				success: function(data) {
					if (!data.result) {
						invalidate('#email');
						$('#email_warning').html(email_taken);
					}
					else {
						validate('#email');
						$('#email_warning').empty();
					}
				}
			})
		}
		enableSubmit();
	});

	$('#userID').on('blur', function(event) {
		event.preventDefault();
		var condition = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
		var userID = $(this).val();
		if (userID == '') {
			invalidate('#userID');
			$('#userID_warning').html(empty);
		}
		else if (!userID.match(condition)) {
			invalidate('#userID');
			$('#userID_warning').html(invalid);
		}
		else {
			$.ajax({
				data : {
					username : $('#userID').val()
				},
				type : 'POST',
				url : '/verifyUser',
				success: function(data) {
					if (!data.result) {
						invalidate('#userID');
						$('#userID_warning').html(user_taken);
					}
					else {
						validate('#userID');
						$('#userID_warning').empty();
					}
				}
			})
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
	$('#gender').on('change', function(event) {
		event.preventDefault();
		var gender = $('#gender').val();
		if (gender=='Female' || gender=='Male' || gender=='Other') {
			validate('#gender');
			$('#gender_warning').empty();
		}
		else {
			invalidate('#gender');
			$('#gender_warning').html(empty);
		}
		enableSubmit();
	});

	$('#home_zip').on('blur', function(event) {
		event.preventDefault();
		$.ajax({
			data : {
				home_zip : $('#home_zip').val()
			},
			type : 'POST',
			url : '/validateZip',
			success: function(data) {
				if (data.result) {
					validate('#home_zip');
					$('#zip_warning').empty();
				}
				else {
					invalidate('#home_zip');
					$('#zip_warning').html(zip_error);
				}
			}
		})
	});

	$('#avatar').on('change', function(event) {
		event.preventDefault();
		var newBackground = $('#avatar').val();
		var container = document.getElementById('avatar_container');
		container.style.backgroundImage = 'url(' + newBackground  + ')';
		validate('#avatar');
		enableSubmit();
	});

});