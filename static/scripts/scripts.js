var months = [	{label : "January",  value: 1,  days : 31}, {label : "February", value: 2,  days : 29}, {label : "March", 	 value: 3,  days : 31}, {label : "April", 	 value: 4,  days : 30}, {label : "May", 	 value: 5,  days : 31}, {label : "June", 	 value: 6,  days : 30}, {label : "July", 	 value: 7,  days : 31}, {label : "August", 	 value: 8,  days : 31}, {label : "September",value: 9,  days : 30}, {label : "October",  value: 10, days : 31}, {label : "November", value: 11, days : 30}, {label : "December", value: 12, days : 31}];

function remove(array, value) {
	var index = array.indexOf(value);
	if (index != -1) array.splice(index, 1);
	return array;
}
function add(array, value) {
	var index = array.indexOf(value);
	if (index === -1) array.push(value);
	return array;
}
function toggle(collection, item) {
	var idx = collection.indexOf(item);
	if(idx !== -1) collection.splice(idx, 1);
	else collection.push(item);
	return collection;
}
function contains(collection, item) {
	if(collection.indexOf(item) !== -1) return true;
	else return false;
}
function idToName (id) {
	var arr = id.split('_');
	var str = "";
	var temp;
	for (var i = 0; i < arr.length; i++){
		if (i == 0) temp = arr[i].charAt(0).toUpperCase() + arr[i].substr(1).toLowerCase();
		else temp = arr[i].charAt(0).toLowerCase() + arr[i].substr(1).toLowerCase()
		str = str.concat(temp + ' ');
	}
	return str;
}
function idToTimeLabel (id) {
	var arr = id.split('_');
	return arr[0].charAt(0).toUpperCase() + arr[0].substr(1).toLowerCase();
}
function testValid (field, value) {
	switch (field) {
		case "first_name":
			var condition = /^[a-z ,.'-]+$/i;
			if (!value.match(condition)) return "invalid";
			break;
		case "last_name":
			var condition = /^[a-z ,.'-]+$/i;
			if (!value.match(condition)) return "invalid";
			break;
		case "password":
			var condition = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,}$/;
			if (value == "") return "";
			if (!value.match(condition)) return "invalid";
			break;
		case "phone_number":
			if (value == "") return "";
			if (value.length < 14) return "invalid";
			break;
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
		case "old_password" :
			return "Your old password is incorrect.";
		case "password_confirm" :
			return "Your passwords don\'t match.";
		case "month_of_birth" :
			return "There aren't that many days in this month.";
		case "day_of_birth" :
			return "There aren't this many days in that month.";
		case "year_of_birth" :
			return "This year looks suspicious.";
		default :
			return idToName(field) + " is invalid.";
	}
	return idToName(field) + " is invalid.";
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
function phoneHelper() {
	$('#phone_number').attr('maxlength', 14);
	$('#phone_number').keydown(function (e) {
		var key = e.charCode || e.keyCode || 0;
		// Auto-format- do not expose the mask as the user begins to type
		if (key !== 8 && key !== 9) {
			if ($(this).val().length === 4) {
				$(this).val($(this).val() + ')');
			}
			if ($(this).val().length === 5) {
				$(this).val($(this).val() + ' ');
			}			
			if ($(this).val().length === 9) {
				$(this).val($(this).val() + '-');
			}
			if ($(this).val().length === 0) {
				$(this).val("(" + $(this).val());
			}
		}
		// Allow numeric (and tab, backspace, delete) keys only
		return (key == 8 || 
				key == 9 ||
				key == 46 ||
				(key >= 48 && key <= 57) ||
				(key >= 96 && key <= 105));	
		})
	.bind('focus click', function () {
		if ($(this).val().length === 0) {
			$(this).val('(');
		}
		else {
			var val = $(this).val();
			$(this).val('').val(val); // Ensure cursor remains at the end
		}
	})
	.blur(function () {
		if ($(this).val() === '(') {
			$(this).val('');
		}
	});
}
function passwordHelper() {
	$('#password').popover();
}
$.fn.goValidate = function() {
    var $form = this,
        $inputs = $form.find('input:text, input:password'),
        $selects = $form.find('select'),
        $textAreas = $form.find('textarea');
    
    var validators = {
        username: {
            regex: /^[a-z ,.'-]{4,}$/
        },
        first_name: {
            regex: /^[A-Za-z]{1,}$/
        },
        last_name: {
            regex: /^[A-Za-z]{1,}$/
        },
        password: {
            regex: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/
        },
        email_address: {
            regex: /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/
        },
        phone: {
            regex: /^[2-9]\d{2}-\d{3}-\d{4}$/,
        }
    };
    var validate = function(klass, value) {
        var isValid = true,
            error = '';
            
        if (!value && /required/.test(klass)) {
            error = 'This field is required';
            isValid = false;
        } else {
            klass = klass.split(/\s/);
            $.each(klass, function(i, k){
                if (validators[k]) {
                    if (value && !validators[k].regex.test(value)) {
                        isValid = false;
                        error = validators[k].error;
                    }
                }
            });
        }

        return {
            isValid: isValid,
            error: error
        }
    };
    var showError = function($e) {
        var klass = $e.attr('class'),
            value = $e.val(),
            test = validate(klass, value);
      
        $e.removeClass('invalid');
        $('#form-error').addClass('hide');
        
        if (!test.isValid) {
            $e.addClass('invalid');
            
            if(typeof $e.data("shown") == "undefined" || $e.data("shown") == false){
               $e.popover('show');
            }
            
        }
      else {
        $e.popover('hide');
      }
    };
   
    $inputs.keyup(function() {
        showError($(this));
    });
    $selects.change(function() {
        showError($(this));
    });
    $textAreas.keyup(function() {
        showError($(this));
    });
  
    $inputs.on('shown.bs.popover', function () {
  		$(this).data("shown",true);
	});
  
    $inputs.on('hidden.bs.popover', function () {
  		$(this).data("shown",false);
	});
  
    $form.submit(function(e) {
      
        $inputs.each(function() { /* test each input */
        	if ($(this).is('.required') || $(this).hasClass('invalid')) {
            	showError($(this));
        	}
    	});
    	$selects.each(function() { /* test each input */
        	if ($(this).is('.required') || $(this).hasClass('invalid')) {
            	showError($(this));
        	}
    	});
    	$textAreas.each(function() { /* test each input */
        	if ($(this).is('.required') || $(this).hasClass('invalid')) {
            	showError($(this));
        	}
    	});
        if ($form.find('input.invalid').length) { /* form is not valid */
        	e.preventDefault();
            $('#CreateProfileFail').fadeIn(400).delay(3000).fadeOut(400);
            return false;
        }
    });
    return this;
};