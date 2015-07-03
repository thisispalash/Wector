//ALGORITHM:
//1. Load existing location
//2. If exists, all is good. Else, query IP and get an approximate. Set it.
//3. Watch for the find button. When pressed

var lat = 42.4439614;
var lon = -76.5018807;
var loc = "Ithaca, NY";

function refreshMap() {
	document.getElementById("map").style.opacity = "0.5";
	var address = document.getElementById("whereAmIInput").value;
	var append = lat+","+lon;
	if (address != 'Current Location') {
		append = address;
	}	
	document.getElementById("map").src = "https://maps.googleapis.com/maps/api/staticmap?center="+append+"&zoom=13&size=600x300&maptype=roadmap&markers=color:orange|"+append;
	document.getElementById("map").onload = function () {
		document.getElementById("map").style.opacity = "1.0";
	};
}

// Find current location that has been set, and send it over to the map.
function preInitialize() {
	// retrieve lat lon loc
	document.getElementById("whereAmIInput").value = loc;
	document.getElementById("submit").addEventListener("click",refreshMap);
	document.getElementById("form").addEventListener("submit",function (event) {
		event.preventDefault();
		refreshMap();
	});
	getLocation();
	refreshMap();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
    }
}
function showPosition(position) {
	lat = position.coords.latitude;
	lon = position.coords.longitude;
	console.log(position.coords);
	document.getElementById("whereAmIInput").value = "Current Location";
	refreshMap();
}

window.addEventListener("load", preInitialize);
