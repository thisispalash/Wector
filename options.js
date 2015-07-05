/*
 * ALGORITHM:
  * Load existing location
  * If exists, all is good. Else, query IP and get an approximate. Set it.
  * Watch for the find button. When pressed
 */

var loc = "";

function refreshMapWithL(lat, lon) {
	document.getElementById("map").style.opacity = "0.5";
	document.getElementById("map").src = "https://maps.googleapis.com/maps/api/staticmap?center="+lat+","+lon+"&zoom=13&size=600x300&maptype=roadmap&markers=color:orange|"+lat+","+lon;
	document.getElementById("map").onload = function () {
		document.getElementById("map").style.opacity = "1.0";
	};
}

function refreshMap() {
	document.getElementById("map").style.opacity = "0.5";
	var address = document.getElementById("whereAmIInput").value;
	if (loc == address) {
		document.getElementById("map").style.opacity="1.0";
	}
	loc = address;
	document.getElementById("map").src = "https://maps.googleapis.com/maps/api/staticmap?center="+address+"&zoom=13&size=600x300&maptype=roadmap&markers=color:orange|"+address;
	document.getElementById("map").onload = function () {
		document.getElementById("map").style.opacity = "1.0";
	};
}

function save() {
	document.getElementById("save").innerHTML = 'Saving <i class="fa fa-spinner fa-spin"></i>';
	var address = document.getElementById("whereAmIInput").value;
	if (address != loc) refreshMap();
	$.ajax ({
		type:"GET",
		url: "https://maps.googleapis.com/maps/api/geocode/json?address="+address,
		success: function (adddata) {
			var latadd = adddata['results'][0]['geometry']['location']['lat'];
			var lonadd = adddata['results'][0]['geometry']['location']['lng'];
			var format = adddata['results'][0]['formatted_address'];
			chrome.storage.sync.set({latitude:latadd, longitude:lonadd, address:format}, function () {
				document.getElementById("save").innerHTML = "Save";
				var a = document.getElementById("saveAlert");
				a.innerHTML = "Saved Home as "+format+"!";
				document.getElementById("whereAmIInput").value = format;
				$(a).fadeIn();
				setInterval(function(){ $(a).fadeOut(); }, 5000);
			});
		}
	});		
}

// Find current location that has been set, and send it over to the map.
function preInitialize() {
	// retrieve lat lon loc
	document.getElementById("submit").addEventListener("click",refreshMap);
	document.getElementById("save").addEventListener("click",save);
	document.getElementById("form").addEventListener("submit",function (event) {
		event.preventDefault();
		refreshMap();
	});
	chrome.storage.sync.get({address:"Ithaca, NY", latitude:42.4433, longitude:-76.5000}, function(items) {
		document.getElementById("whereAmIInput").value = items.address;
		refreshMapWithL(items.latitude, items.longitude);
	});
}

window.addEventListener("load", preInitialize);
