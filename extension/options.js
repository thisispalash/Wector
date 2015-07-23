/*
 * Returns the hours in time 't'
 */
function getH(t) {
	return Math.round(Math.floor(t/60));
}

/*
 * Returns the minutes in time 't'
 */
function getM(t){
	return t%60;
}

/*
 * Formats the time into a human readable format
 */
function formatTime(t) {
	var h = getH(t);
	var m = getM(t);
	var time = "";
	if (h != 0) {
		time += h;
		time += " hour";
		if (h != 1) {
			time += "s";
		}
		time += " ";
	}
	if (m != 0) {
		time = time + "" + m + " minute";
		if (m != 1) {
			time += "s";
		}
	}
	return time;
}

/*
 * Updates the speed beside the sliders in options.html
 */
function updateSpeeds() {
	var walkingSpeed = document.getElementById("walkingSpeedSlider").value;
	var inMPH = (Math.round(walkingSpeed*0.62*10))/10.0;
	document.getElementById("walkingSpeedInfo").innerHTML = walkingSpeed+" kmph ("+inMPH+" mph)";

	var bikingSpeed = document.getElementById("bikingSpeedSlider").value;
	inMPH = (Math.round(bikingSpeed*0.62*10))/10.0;
	document.getElementById("bikingSpeedInfo").innerHTML = bikingSpeed+" kmph ("+inMPH+" mph)";

	saveSpeedTimeSettings();
}

/*
 * Updates the time beside the sliders in options.html
 */
function updateTimes() {
	var walkingTime = document.getElementById("walkingTimeSlider").value;
	var showTime = formatTime(walkingTime);
	document.getElementById("walkingTimeInfo").innerHTML = showTime;

	var bikingTime = document.getElementById("bikingTimeSlider").value;
	showTime = formatTime(bikingTime);
	document.getElementById("bikingTimeInfo").innerHTML = showTime;

	saveSpeedTimeSettings();
}

/*
 * Refreshes the Speed and Time sliders with the given values
 */
function refreshSliders(wS, wH, wM, bS, bH, bM) {
	document.getElementById("bikingTimeSlider").value = bH*60 + bM;
	document.getElementById("walkingTimeSlider").value = wH*60 + wM;
	document.getElementById("walkingSpeedSlider").value = wS/1000;
	document.getElementById("bikingSpeedSlider").value = bS/1000;
	updateSpeeds();
	updateTimes();
}

/*
 * Refreshes the map with the given Coordinates
 */
function refreshMapWithL(lat, lon) {
	document.getElementById("map").style.opacity = "0.5";
	var oldSrc = document.getElementById("map").src;
	document.getElementById("map").onerror = function () {
		document.getElementById("map").src = oldSrc;
		offlineMsg();
	};
	// Get map from Static Maps API and show as image (Courtesy: Google)
	document.getElementById("map").src = "https://maps.googleapis.com/maps/api/staticmap?center="+lat+","+lon+"&zoom=13&size=600x300&maptype=roadmap&markers=color:orange|"+lat+","+lon;
	document.getElementById("map").onload = function () {
		document.getElementById("map").style.opacity = "1.0";
		if (document.getElementById("map").src == oldSrc) return;
		document.getElementById("map").style.webkitFilter = "none";
		document.getElementById("overlay").style.display = "none";
	};
}

/* 
 * Refreshes the map with the entered address (Approximate)
 */
function refreshMap() {
	document.getElementById("map").style.opacity = "0.5";
	var address = document.getElementById("whereAmIInput").value;
	if (loc == address) {
		document.getElementById("map").style.opacity="1.0";
	}
	loc = address;
	var oldSrc = document.getElementById("map").src;
	document.getElementById("map").onerror = function () {
		document.getElementById("map").src = oldSrc;
		offlineMsg();
	};
	// Get map from Static Maps API and show as image (Courtesy: Google)
	document.getElementById("map").src = "https://maps.googleapis.com/maps/api/staticmap?center="+address+"&zoom=13&size=600x300&maptype=roadmap&markers=color:orange|"+address;
	document.getElementById("map").onload = function () {
		document.getElementById("map").style.opacity = "1.0";
		if (document.getElementById("map").src == oldSrc) return;
		document.getElementById("map").style.webkitFilter = "none";
		document.getElementById("overlay").style.display = "none";
	};
}

/*
 * Called when the user is offline. Displays offline message
 */
function offlineMsg() {
	document.getElementById("map").style.webkitFilter = "blur(5px)";
	document.getElementById("overlay").style.display = "block";
	document.getElementById("overlayMessage").innerHTML = "Oops, it looks like you're offline! Try again later! <i class='fa fa-frown-o'></i>";
}

/*
 * Called when the entered place is not found. Displays not found message
 */
function notFoundMsg() {
	document.getElementById("map").style.webkitFilter = "blur(5px)";
	document.getElementById("overlay").style.display = "block";
	document.getElementById("overlayMessage").innerHTML = "We couldn't find that place - try again! <i class='fa fa-frown-o'></i>";
}

/*
 * Saves the user's Walking and Biking maxSpeed and maxTime preferences
 */
function saveSpeedTimeSettings() {
	var mWS = document.getElementById("walkingSpeedSlider").value*1000;
	var mBS = document.getElementById("bikingSpeedSlider").value*1000;
	var walkingTime = document.getElementById("walkingTimeSlider").value;
	var mWTH = getH(walkingTime);
	var mWTM = getM(walkingTime);
	var bikingTime = document.getElementById("bikingTimeSlider").value;
	var mBTH = getH(bikingTime);
	var mBTM = getM(bikingTime);
	chrome.storage.sync.set({mWS:mWS, mBS:mBS, mWTH:mWTH, mWTM:mWTM, mBTH:mBTH, mBTM:mBTM, exists:true}, function () {
		; //saved
	});
}

/* 
 * Saves the Current Location into loc and refreshes the map
 */
function save() {
	document.getElementById("save").innerHTML = 'Saving <i class="fa fa-spinner fa-spin"></i>';
	var address = document.getElementById("whereAmIInput").value;
	if (address != loc) refreshMap();
	// Query Geocode (Courtesy: Google)
	$.ajax ({
		type:"GET",
		url: "https://maps.googleapis.com/maps/api/geocode/json?address="+address,
		success: function (adddata) {
			var res = adddata['results'];
			if (res.length > 0) {
				var latadd = adddata['results'][0]['geometry']['location']['lat'];
				var lonadd = adddata['results'][0]['geometry']['location']['lng'];
				var format = adddata['results'][0]['formatted_address'];
				// Set the found address as the current location
				chrome.storage.sync.set({latitude:latadd, longitude:lonadd, address:format, exists:true}, function () {
					document.getElementById("save").innerHTML = "Save";
					var a = document.getElementById("saveAlert");
					a.innerHTML = "Saved Home as "+format+"!  <i class = 'fa fa-thumbs-up'></i>";
					document.getElementById("whereAmIInput").value = format;
					$(a).fadeIn();
					setInterval(function(){ $(a).fadeOut(); }, 5000);
				});
				document.getElementById("map").style.opacity = "1.0";
				document.getElementById("map").style.webkitFilter = "none";
				document.getElementById("overlay").style.display = "none";
			}
			else {
				document.getElementById("map").onload = function () {
					notFoundMsg();
					document.getElementById("save").innerHTML = "Save";
				};
				var oldSrc = document.getElementById("map").src;
				document.getElementById("map").src = oldSrc;
			}
		},
		error: function () {
			document.getElementById("save").innerHTML = "Save";
		}
	});		
}

/*
 * Find current location that has been set, and send it over to the map.
 */
function preInitialize() {
	// retrieve lat lon loc
	document.getElementById("submit").addEventListener("click",refreshMap);
	document.getElementById("save").addEventListener("click",save);
	document.getElementById("homeForm").addEventListener("submit",function (event) {
		event.preventDefault();
		refreshMap();
	});
	chrome.storage.sync.get({address:"Cornell University", latitude:42.4534492, longitude:-76.4735027, mWS:5000, mBS:14000, mWTH:0, mBTH:0, mWTM:30, mBTM:30, exists:false}, function(items) {
		document.getElementById("whereAmIInput").value = items.address;
		refreshMapWithL(items.latitude, items.longitude);
		refreshSliders(items.mWS, items.mWTH, items.mWTM, items.mBS, items.mBTH, items.mBTM);
		if (items.exists == false) {
			document.getElementById("welcome").style.display = "block";
		}
	});
	document.getElementById("walkingSpeedSlider").addEventListener("change", updateSpeeds);
	document.getElementById("bikingSpeedSlider").addEventListener("change", updateSpeeds);
	document.getElementById("walkingTimeSlider").addEventListener("change", updateTimes);
	document.getElementById("bikingTimeSlider").addEventListener("change", updateTimes);
}

// Start of options.js
console.log("Thanks for using Wector! Visit us at http://wector.ml");
// Current Location
var loc = "";
window.addEventListener("load", preInitialize);