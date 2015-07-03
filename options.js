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
	document.getElementById("map").src = "https://maps.googleapis.com/maps/api/staticmap?center="+address+"&zoom=13&size=600x300&maptype=roadmap&markers=color:orange|"+address;
	document.getElementById("map").onload = function () {
		document.getElementById("map").style.opacity = "1.0";
	};
}

function save() {
	document.getElementById("save").innerHTML = 'Saving <i class="fa fa-spinner fa-spin"></i>';
	var address = document.getElementById("whereAmIInput").value;
	document.getElementById("save").innerHTML = "Save";
	var a = document.getElementById("saveAlert");
	$(a).fadeIn();
	setInterval(function(){ $(a).fadeOut() }, 5000);
}

// Find current location that has been set, and send it over to the map.
function preInitialize() {
	// retrieve lat lon loc
	document.getElementById("whereAmIInput").value = loc;
	document.getElementById("submit").addEventListener("click",refreshMap);
	document.getElementById("save").addEventListener("click",save);
	document.getElementById("form").addEventListener("submit",function (event) {
		event.preventDefault();
		refreshMap();
	});
	refreshMap();
}

window.addEventListener("load", preInitialize);
