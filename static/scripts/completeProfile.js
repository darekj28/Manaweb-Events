$(document).ready(function() {

	var skills = ["#commander_level",
				"#cube_level", 
				"#draft_level",
				"#legacy_level",
				"#modern_level",
				"#pauper_level",
				"#sealed_level",
				"#standard_level",
				"#two_headed_giant_level",
				"#vintage_level"];

	
	
	var initialize = function(skills) {
		for (var i = 0; i < skills.length; i++) {
			var skill = skills[i].slice(1);
			$('#placeSkills').append('\
				<tr>\
				<th><label class="control-label" for="' + skill + '"> <h4>' + nameSkill(skills[i]) + '</h4></label></th>\
				<th> <input id="' + skill + '" name="' + skill + '" data-slider-id="' + skill + '" type="text" data-slider-tooltip="show" data-slider-ticks="[1, 2, 3, 4, 5]"\
				data-slider-min="1"\
				data-slider-max="5"\
				data-slider-step="1"\
				data-slider-selection="none"\
				data-slider-value="1"/></th>\
				</tr>');
			$(skills[i]).slider({});
		}
	};
	var nameSkill = function(skill_level) {
		skill_level = skill_level.slice(1);
		var subs = skill_level.split("_");
		var res = "";
		for (var i = 0; i < subs.length - 1; i++) {
			res += (subs[i].charAt(0).toUpperCase() + subs[i].slice(1) + ' ');
		}
		return res;
	};
	initialize(skills);
});