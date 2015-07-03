//ALGORITHM:
//1. Load existing location
//2. If exists, all is good. Else, query IP and get an approximate. Set it.
//3. Watch for the find button. When pressed

var lat = 42.4439614;
var lon = -76.5018807;
var loc = "Ithaca, NY";

function refreshMap() {
	var address = document.getElementById("whereAmIInput").value;
	// set lat lon and loc
	console.log(address);
	document.getElementById("map").src = "https://maps.googleapis.com/maps/api/staticmap?center="+address+"&zoom=13&size=600x300&maptype=roadmap&markers=color:orange|"+address;
}

// Find current location that has been set, and send it over to the map.
function preInitialize() {
	// retrieve lat lon loc
	document.getElementById("whereAmIInput").value = loc;
	document.getElementById("submit").addEventListener("click",refreshMap);
	refreshMap();
}

window.addEventListener("load", preInitialize);
