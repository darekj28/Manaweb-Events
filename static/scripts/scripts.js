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