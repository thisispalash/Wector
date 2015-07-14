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

function refreshVals(maxWS, maxBS, maxWTH, maxBTH, maxWTM, maxBTM) {
	// Sliders
	document.getElementById("maxWS").value = maxWS;
	document.getElementById("maxWTH").value = maxWTH;
	document.getElementById("maxWTM").value = maxWTM;
	document.getElementById("maxBS").value = maxBS;
	document.getElementById("maxBTH").value = maxBTH;
	document.getElementById("maxBTM").value = maxBTM;
	// Texts
	document.getElementById("TFmaxWS").value = maxWS;
	document.getElementById("TFmaxWTH").value = maxWTH;
	document.getElementById("TFmaxWTM").value = maxWTM;
	document.getElementById("TFmaxBS").value = maxBS;
	document.getElementById("TFmaxBTH").value = maxBTH;
	document.getElementById("TFmaxBTM").value = maxBTM;
}

function saveVals() {
	document.getElementById("saveMax").innerHTML = 'Saving <i class="fa fa-spinner fa-spin"></i>';
	var maxWS = parseInt(document.getElementById("maxWS").value);
	var maxBS = parseInt(document.getElementById("maxBS").value);
	var maxWTH = parseInt(document.getElementById("maxWTH").value);
	var maxBTH = parseInt(document.getElementById("maxBTH").value);
	var maxWTM = parseInt(document.getElementById("maxWTM").value);
	var maxBTM = parseInt(document.getElementById("maxBTM").value);
	document.getElementById("TFmaxWS").value = maxWS;
	document.getElementById("TFmaxWTH").value = maxWTH;
	document.getElementById("TFmaxWTM").value = maxWTM;
	document.getElementById("TFmaxBS").value = maxBS;
	document.getElementById("TFmaxBTH").value = maxBTH;
	document.getElementById("TFmaxBTM").value = maxBTM;
	// TODO: Display values in the slider
	//document.getElementById("Disp").innerHTML = " " + maxWS + " " + maxWTH + ":" + maxWTM + "    " + maxBS + " " + maxBTH + ":" + maxBTM;
	chrome.storage.sync.set({mWS:maxWS*1000, mBS:maxBS*1000, mWTH:maxWTH, mBTH:maxBTH, mWTM:maxWTM, mBTM:maxBTM}, function () {
		document.getElementById("saveMax").innerHTML = "Save";
		var a = document.getElementById("savedMax");
		a.innerHTML = "Saved values as:<br>" + "<br>Walking Speed: " + maxWS + "<br>Max Walk Time: " + maxWTH + ":" + maxWTM + "<br>Biking Speed: " + maxBS + "<br>Max Bike Time: " + maxBTH + ":" + maxBTH;
		$(a).fadeIn();
		setInterval(function(){ $(a).fadeOut(); }, 5000);
	});
}

function updateVals() {

}

// Find current location that has been set, and send it over to the map.
function preInitialize() {
	// retrieve lat lon loc
	document.getElementById("submit").addEventListener("click",refreshMap);
	document.getElementById("save").addEventListener("click",save);
	document.getElementById("saveMax").addEventListener("click",saveVals);
	document.getElementById("form").addEventListener("submit",function (event) {
		event.preventDefault();
		refreshMap();
	});
	document.getElementById("maxForm").addEventListener("submit",function (event) {
		event.preventDefault();
		refreshVals(5000, 14000, 0, 0, 30, 30);
	});
	chrome.storage.sync.get({address:"Ithaca, NY", latitude:42.4433, longitude:-76.5000, mWS:5000, mBS:14000, mWTH:0, mBTH:0, mWTM:30, mBTM:30}, function(items) {
		document.getElementById("whereAmIInput").value = items.address;
		refreshMapWithL(items.latitude, items.longitude);
	});
}

window.addEventListener("load", preInitialize);
