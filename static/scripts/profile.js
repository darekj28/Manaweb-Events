$(document).ready(function(){
	$('addFriend').on('click', function() {
		event.preventDefault();
		$(this).toggleClass('btn-success');
	});
	$('removeFriend').on('click', function() {
		event.preventDefault();
		$(this.toggleClass('btn-danger'));
	});
	$('.profPic').on('error', function() {
		this.src = "../static/img/default.png"
	});
});