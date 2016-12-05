$(document).ready(function(){
    var formats = ['commander', 'cube', 'draft', 'legacy', 'modern', 'pauper', 'sealed' , 'standard', 'two_headed_giant',  'vintage'];
    var changeFlag = false;
    var trackChange = function(){
        changeFlag = true;
    };
    $(document).keypress(function(e) {
        if (e.which == 13) {
            if (changeFlag) {
                $('#filterForm').submit();
            }
            return false;
        }
    });
    $("#showButton").click(function(){
    	event.preventDefault();
    	showButton = document.getElementById('showButton');
    	formatFilter = document.getElementById('formatFilter');
        if (formatFilter.style.display == 'block')
        {
            showButton.innerHTML = 'Show Formats';
            formatFilter.style.display = "none";
        }

        else 
        {
            formatFilter.style.display = 'block';
            showButton.innerHTML = 'Hide Formats';
        }
    });
    var nameSkill = function(skill_level) {
        var subs = skill_level.split("_");
        var res = "";
        for (var i = 0; i < subs.length; i++) {
            res += (subs[i].charAt(0).toUpperCase() + subs[i].slice(1) + ' ');
        }
        return res;
    };
    var initializeSliders = function(){
        for (var i = 0; i < formats.length; i++) {
            var formatName = formats[i];
            formatNameId = '#' + String(formatName);
            $('#placeSkills').append('\
                <tr class="noSelect" id="' + formatName + 'Pref">\
                    <th><label class="control-label noSelect" for="' + formatName + '"> ' + nameSkill(formatName) + '</label></th>\
                    <th><input class="slider input" id="' + formatName + '" name="' + formatName + '" data-slider-id="' + formatName + '" type="text" data-slider-tooltip="show" data-slider-ticks="[1, 2, 3, 4, 5]"\
                    data-slider-min="1"\
                    data-slider-max="5"\
                    data-slider-step="1"\
                    data-slider-range=true\
                    </th>\
                </tr>');
        }
    };
    initializeSliders();
    $('#formatTable tr').on('dblclick', function(event) {
        trackChange();
    });
    var disableDoubleClickSelect = function(){
        $('.noSelect').mousedown(function(e) {
            e.preventDefault();
        });
        $('.noSelect').on('dblclick', function(event) {
            $('.noSelect').on('click', function(event) {
                event.preventDefault();
            });
        })
    };
    disableDoubleClickSelect();
    var populateSliders = function(){
        $.ajax({
            type: 'GET',
            url: '/getPreferredFormats',
            success: function(data) {

                for (var i = 0; i < formats.length; i++) {

                    var formatName = formats[i];
                    formatNameId = '#' + String(formatName);
                    formatNameMin = formatName + '_min';
                    formatNameMax = formatName + '_max';
                    var arr = "[" + [parseInt(data[formatNameMin]), parseInt(data[formatNameMax])] + "]";
                    // console.log(arr);
                    $(formatNameId).attr('data-slider-value', arr);
                    if (data['preferredFormats'].length != 0) {
                        for (var j = 0; j < data["preferredFormats"].length; j++) {
                            if (formatName == data["preferredFormats"][j]) {
                                $('#' + formatName + 'Pref').addClass("bg-success");
                            }
                        }
                    }
                    $(formatNameId).slider({});
                    $(formatNameId).on('change', function(event) {
                        var a = event.value.newValue;
                        var b = event.value.oldValue;
                        var changed = !($.inArray(a[0], b) !== -1 && 
                                        $.inArray(a[1], b) !== -1 && 
                                        $.inArray(b[0], a) !== -1 && 
                                        $.inArray(b[1], a) !== -1 && 
                                        a.length === b.length);

                        if(changed) {
                            trackChange();
                        }
                    });
                }
                
            }
        });
    };
    populateSliders();
    $('#formatTable').on('dblclick', 'tbody tr', function(event) {
        $(this).toggleClass('bg-success');
        var arr = [];
        for (var i = 0; i < formats.length; i++) {
            if ($('#' + formats[i] + 'Pref').hasClass('bg-success')) 
                arr.push(formats[i]);
        }
    })

    $('#filterForm').on('submit', function(event) {
       
        event.preventDefault();
        var arr = [];
        for (var i = 0; i < formats.length; i++) {
            if ($('#' + formats[i] + 'Pref').hasClass('bg-success')) 
                arr.push(formats[i]);
        }
        
        $.ajax({
            type: "POST",
            url: '/postPreferredFormats',
            data: {
                prefFormats : arr
            }
        });

        $(this).unbind('submit').submit();
    })
    var all = document.getElementsByClassName("input");
    for (var i = 0; i < all.length; i++) {
        all[i].addEventListener('change', trackChange, false);
    }


});