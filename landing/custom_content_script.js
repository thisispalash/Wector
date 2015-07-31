// DOM

/*
 * Icon list (from Font-Awesome and Material-Design-..) :
  * Flight: "<i class='fa fa-paper-plane-o'></i>  "
  * Car: "<i class='fa fa-car'></i>  "
  * Bike: "<i class='fa fa-bicycle'></i>  "
  * Walk: "<i class='zmdi zmdi-directions-walk'></i>  "
 */

/*
 * Takes the selected text and calls main() 
 */
function checkHighlight() {
	if (queried >= 4) return;
	if (weknowhome != true) {
		return;
	}
	var text = "";
	// TODO: Understand this!
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    if (text != "" && text.length < 50 && text != lastQuery) {
		queried++;
    	main(text);
    	ga('send', 'event', 'body', 'highlight', text, queried);
    	if (queried >= 4) {
    		setTimeout(function(){displayLimitAlert();}, 2000);
		}
    }
}

/*
 * Main function
 * @params: txt - Selected text
 */
function main(txt) {
	//console.log("  " + latsrc + "," + lonsrc + "    " + home + "\n" + maxWalkSpd + "  " + (maxWalkTimeH*60+maxWalkTimeM)/60.0 + " " + maxWalkDist + " " + maxWalkTimeH+":"+maxWalkTimeM + "\n" + maxBikeSpd + "  " + (maxBikeTimeH*60+maxBikeTimeM)/60.0 + " " + maxBikeDist + " " + maxBikeTimeH+":"+maxBikeTimeM + "\n")
    var text = txt;
    lastQuery = text;
    var dest = text;

    // Query Distance Matrix (Courtesy: Google)
    $.ajax({
    	type:"GET",
	    url:      "/distance?lat="+latsrc+"&lon="+lonsrc+"&dst="+dest,
	    success: function(data){
	    	data = JSON.parse(data);
	    	//console.log(data);
	        var rows = data['rows'][0];
		    var elements = rows['elements'][0];
	 	    var status = elements['status'];
	    	var dst = data['destination_addresses'][0];
	    	var src = data['origin_addresses'][0];
	    	// No possible way to drive to destination; Fly! 
		    if(status == "ZERO_RESULTS") {
		    	var latdst = -1;
				var londst = -1;
				// Query Geocode (Courtesy: Google)
				$.ajax ({
					type:"GET",
					url: "/geocode?dst="+dest,
					success: function (dstdata) {
						dstdata = JSON.parse(dstdata);
						//console.log(dstdata);
						latdst = dstdata['results'][0]['geometry']['location']['lat'];
						londst = dstdata['results'][0]['geometry']['location']['lng'];
						//console.log(latdst + " " + londst + "\n" + latsrc + " " + lonsrc);
						var flightTime = getFlight(latdst, londst, latsrc, lonsrc);
						var flight = "<i class='fa fa-paper-plane-o'></i>  " + flightTime + " hour";
						if (flightTime != 1) {
							flight+="s";
						}
						// Call display function
						alertUser(src, dst, "", flight, "", "", 0, 1, 0, 0);
					}
				});				
	    	}
	    	// There is a possible way to drive
		    else if (status == 'OK') {
		    	var dist = elements['distance'];
		    	var dur = elements['duration'];

		    	// Set Text
		    	var car=" <i class='fa fa-car'></i>  " + dur['text'];
		    	var flight=" <i class='fa fa-paper-plane-o'></i>  ";
		    	var walk=" <i class='zmdi zmdi-directions-walk'></i>  ";
		    	var bike=" <i class='fa fa-bicycle'></i>  ";

		    	// Walking && Biking (Max: 3hours)
		    	if(dist['value']<=Math.max(maxWalkDist, maxBikeDist)) {
		    		// Walking
		    		var walkTime = dist['value']/(maxWalkSpd);
		    		var wH = walkTime|0;
		    		var walkHour;
		    		if(walkTime < 1.0) {
		    			walkHour = " ";
		    		} else if(walkTime <2.0) {
		    			walkHour = " " + wH + " hour";
		    		} else {
		    			walkHour = " " + wH + " hours";
		    		}
		    		var wM = Math.ceil((walkTime-wH)*60);
		    		var walkMin = " " + wM + " min";
		    		if(wM != 1) {
		    			walkMin += "s";
		    		}
		    		walk += walkHour + walkMin;

		    		// Biking
		    		var bikeTime = dist['value']/(maxBikeSpd);
		    		var bH = bikeTime|0;
		    		//console.log(bH);
		    		var bikeHour;
		    		if(bikeTime < 1.0) {
		    			bikeHour = " ";
		    		} else if(bikeTime <2.0) {
		    			bikeHour = " " + bH + " hour";
		    		} else {
		    			bikeHour = " " + bH + " hours";
		    		}
		    		var bM = Math.ceil((bikeTime-bH)*60);
		    		var bikeMin = " " + bM + " min";
		    		if(bM != 1) {
		    			bikeMin += "s";
		    		}
		    		bike += bikeHour + bikeMin;

		    		// Priority Display
		    		// Add check for max times for bike and walk
		    		if(wH <= maxWalkTimeH && wM <= maxWalkTimeM) {
		    			alertUser(src, dst, car, flight, bike, walk, 3, 0, 2, 1);
		    		} else if(bH <= maxBikeTimeH && bM <= maxBikeTimeM) {
		    			alertUser(src, dst, car, flight, bike, walk, 2, 0, 1, 3);
		    		} else {
		    			alertUser(src, dst, car, flight, bike, walk, 1, 0, 2, 3);
		    		}
		    		return;
		    	}
		    	// If no biking or walking
		    	if(dur['value'] < 7200) {
		    		alertUser (src, dst, car, flight, bike, walk, 1, 0, 0, 0);
		    	} else {
		    		var latdst = -1;
					var londst = -1;
					// Query Geocode (Courtesy: Google)
					$.ajax ({
						type:"GET",
						url: "/geocode?dst="+dest,
						success: function (dstdata) {
							dstdata = JSON.parse(dstdata);
							latdst = dstdata['results'][0]['geometry']['location']['lat'];
							londst = dstdata['results'][0]['geometry']['location']['lng'];
							//console.log(latdst + " " + londst + "\n" + latsrc + " " + lonsrc);
							var flightTime = getFlight(latdst, londst, latsrc, lonsrc)
							flight += flightTime + " hour";
							if (flightTime != 1) {
								flight+="s";
							}
							// Priority Display
							if(dur['value']<36000) {
					    		alertUser (src, dst, car, flight, bike, walk, 1, 2, 0, 0);
					    	} else {
					    		alertUser (src, dst, car, flight, bike, walk, 2, 1, 0, 0);
					    	}
						} // Success Function (Geocode)
					});
			    } // Duration > HH:02
		    } // Found driving time
		    else {
		    	; // status == "NOT_FOUND"
		    }
	    } // Success Function ()
	});
} // main()

/*
 * Finds width for mode of transport display
 */
function findWidth (a, b, c, d) {
	var sum = a+b+c+d;
	return (sum == 10) ? "four" : (sum == 6) ? "three" : (sum == 3) ? "two" : "one";
}

/*
 * Reset function
 */
function resetBodyClass () {
	document.getElementsByTagName("body")[0].className = document.getElementsByTagName("body")[0].className.replace(/\bone\b/,'');
	document.getElementsByTagName("body")[0].className = document.getElementsByTagName("body")[0].className.replace(/\btwo\b/,'');
	document.getElementsByTagName("body")[0].className = document.getElementsByTagName("body")[0].className.replace(/\bthree\b/,'');
	document.getElementsByTagName("body")[0].className = document.getElementsByTagName("body")[0].className.replace(/\bfour\b/,'');
}

/*
 * Displays the limit alert
 */
function displayLimitAlert() {
	document.getElementById("try").style.display="none";
	document.getElementById("trialdone").style.display="block";
	document.getElementById("install").style.display = "none";
	document.getElementById("installpl").style.display = "block";
}

/*
 * Displays the information on a beautiful sliding div at the bottom of the screen
 */
function alertUser (src, dst, car, flight, bike, walk, priority_c, priority_f, priority_b, priority_w) {
	var map_link = "https://www.google.com/maps/dir/"+src+"/"+dst;
	dst = "<div id = 'address'>"+dst+"</div>";
	var widthOfEachMode = " "+findWidth(priority_w, priority_b, priority_f, priority_c);
	var text = dst;

	var show_link = "<i class='zmdi zmdi-directions Wector-map'></i>  Route";
	show_link = "<div id = 'links'>" + show_link + "</div>";

	text += "<div id = 'info'>";

	car = "<div class = 'mode'>"+car+"</div>";
	flight = "<div class = 'mode'>"+flight+"</div>";
	bike = "<div class = 'mode'>"+bike+"</div>";
	walk = "<div class = 'mode'>"+walk+"</div>";

	// Add the display to (var)text according to priority
	text += (priority_c == 1) ? car : (priority_f == 1) ? flight : (priority_b == 1) ? bike : (priority_w == 1) ? walk : "";
	text += (priority_c == 2) ? car : (priority_f == 2) ? flight : (priority_b == 2) ? bike : (priority_w == 2) ? walk : "";
	text += (priority_c == 3) ? car : (priority_f == 3) ? flight : (priority_b == 3) ? bike : (priority_w == 3) ? walk : "";
	text += (priority_c == 4) ? car : (priority_f == 4) ? flight : (priority_b == 4) ? bike : (priority_w == 4) ? walk : "";
	text+="</div>";
	text+= show_link;

	// Display Text
	var a = document.createElement("div");
	a.innerHTML = text;
	a.id = "Wector"
	a.style.position = "fixed";
	a.style.bottom = "0";
	a.style.left = "0";
	a.style.width = "100%";
	a.style.background = "rgba(0,0,0,0.9)";
	a.style.color = "white";
	a.style.font="menu";
	a.style.fontSize = "16px";
	a.style.border="0";
	a.style.borderRadius="0px";
	a.style.zIndex = "2147483648";
	a.style.textAlign = "center";
	a.style.display = "none";

	// Remove display on click
	a.onclick = function () {
		lastQuery = "";
		$(a).slideUp("fast", function() {document.body.removeChild(a);});
	}

	var previous = document.getElementById("Wector");
	if (previous == null) {
		resetBodyClass();
		document.getElementsByTagName("body")[0].className += widthOfEachMode;
		document.body.appendChild(a);
		$(a).slideDown("fast", function () {
			var setHeightTo = $("#address").height();
			document.getElementById("info").style.lineHeight = setHeightTo+"px";
			document.getElementById("links").style.lineHeight = setHeightTo+"px";
			//fix for corner case websites:
			var ourBar = $("#address").width() + $("#info").width() + $("#links").width();
			var wholeScreen = $(this).width();
			if (Math.abs(1.03*ourBar - wholeScreen) > 5) {
				document.getElementById("address").style.width = "36%";
				document.getElementById("info").style.width = "60%";
				document.getElementById("links").style.width = "4%";
			}
		});
		document.getElementById("links").onclick = function () {window.open(map_link, "_blank");};
		setTimeout(function(){$(a).slideUp("fast", function(){if (document.contains(a)) document.body.removeChild(a);});}, 6660); // 6.66Os
	}
	else {
		$(previous).slideUp("fast", function() {
			document.body.removeChild(previous);
			resetBodyClass();
			document.getElementsByTagName("body")[0].className += widthOfEachMode;
			document.body.appendChild(a);
			$(a).slideDown("fast", function () {
				var setHeightTo = $("#address").height();
				document.getElementById("info").style.lineHeight = setHeightTo+"px";
				document.getElementById("links").style.lineHeight = setHeightTo+"px";
				//fix for corner case websites:
				var ourBar = $("#address").width() + $("#info").width() + $("#links").width();
				var wholeScreen = $(this).width();
				if (Math.abs(1.03*ourBar - wholeScreen) > 5) {
					document.getElementById("address").style.width = "36%";
					document.getElementById("info").style.width = "60%";
					document.getElementById("links").style.width = "4%";
				}
			});
			document.getElementById("links").onclick = function () {window.open(map_link, "_blank");};
			setTimeout(function(){$(a).slideUp("fast", function(){if (document.contains(a)) document.body.removeChild(a);});}, 6660); // 6.66Os						
		});
	}
}

/*
 * Initialses the home of the viewer by using geolocation
 */
function initializeHome () {
	document.getElementById("inst").innerHTML = "Creating a demo specially for you!  <i class = 'lighter fa fa-spinner fa-pulse'></i>";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById("inst").innerHTML = "It looks like your browser doesn't allow us to get your location :(";
        document.getElementById("inst").style.cursor = "auto";
    }
}

/*
 * Shows error message if geolocation is disabled
 */
function showError(error) {
    console.log(error.code);
    document.getElementById("inst").innerHTML = "Oops, something went wrong. Your browser didn't tell us where you are :(";
    	document.getElementById("inst").style.cursor = "auto";
}

/*
 * Starts the demo
 */
function callAwesome () {
	document.getElementById("inst").innerHTML = "Awesome! Now <span class='lighter'>highlight</span> any of these places to find out how far they are from you:";
	document.getElementById("inst").style.cursor = "auto";
    document.getElementById("places").style.display = "block";
    document.getElementById("inst").onclick = function () {
    	return;
    }
    $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
}

/*
 * Shows other three local locations in the demo
 */
function getMore (latsrc, lonsrc, airport) {
	$.ajax ({
		type:"GET",
		url: "/nearby?lat="+latsrc+"&lon="+lonsrc+"&word=*&rad=15000",
		success: function (data) {
			data = JSON.parse(data);
			var places = [];
			var j = 0;
			for (var i = 0; i < 3; i++) {
				var x = data['results'][j]['name'];
				j++;
				if (x != airport) {
					var change = "p"+(i+1);
					document.getElementById(change).innerHTML = x;
				}
				else {
					i--;
				}
			}
			callAwesome();
		},
		error: function (err) {
			callAwesome();
		}
	});
}

/*
 * Shows Airport on p4 in the demo 
 */
function showAirport(latsrc, lonsrc) {
	$.ajax ({
		type:"GET",
		url: "/nearby?lat="+latsrc+"&lon="+lonsrc+"&word=airport&rad=50000",
		success: function (data) {
			data = JSON.parse(data);
			if (data['results'].length == 0) {
				getMore(latsrc, lonsrc, "");
				return;
			}
			var airport = data['results'][0]['name'];
			document.getElementById("p4").innerHTML = airport;
			getMore(latsrc, lonsrc, airport);
		},
		error: function (err) {
			getMore(latsrc, lonsrc, "");
			callAwesome();
		}
	});
}

/*
 * Displays the places to demo the extension
 */
function showPosition(position) {
    latsrc = position.coords.latitude;
    lonsrc = position.coords.longitude;
    maxWalkSpd = 5000;
	maxBikeSpd = 14000;
	maxWalkTimeH = 0;
	maxBikeTimeH = 0;
	maxWalkTimeM = 30;
	maxBikeTimeM = 30;
	maxWalkDist = (maxWalkSpd)*(maxWalkTimeH+maxWalkTimeM/60.0);
	maxBikeDist = (maxBikeSpd)*(maxBikeTimeH+maxBikeTimeM/60.0);
	weknowhome = true;
	if (latsrc && lonsrc) {
		showAirport(latsrc, lonsrc);
	}
	else {
		showError(null);
	}
}


/*
 * Calculates flight time by using preset formula
 */
function getFlight (lat1, lon1, lat2, lon2) {
	var distance = haversine(lat1, lon1, lat2, lon2);
	var slowDistance = Math.min(distance, 300);
	var remDistance = distance-slowDistance;
	var slowTime = slowDistance/400;
	var cruiseTime = remDistance/800;
	var totalTime = slowTime+cruiseTime;
	return Math.ceil((totalTime*100)/100);
}

/*
 * Haversine function to calculate "great-circle" distance between two points
 * src: http://www.movable-type.co.uk/scripts/latlong.html
 */
function haversine() {
       var radians = Array.prototype.map.call(arguments, function(deg) { return deg/180.0 * Math.PI; });
       var lat1 = radians[0], lon1 = radians[1], lat2 = radians[2], lon2 = radians[3];
       var R = 6372.8; // km
       var dLat = lat2 - lat1;
       var dLon = lon2 - lon1;
       var a = Math.sin(dLat / 2) * Math.sin(dLat /2) + Math.sin(dLon / 2) * Math.sin(dLon /2) * Math.cos(lat1) * Math.cos(lat2);
       var c = 2 * Math.asin(Math.sqrt(a));
       return R * c;
}


// Start of custom_content_script.js
console.log("Thanks for checking out Wector.ml (v 1.2.1)! See our code on GitHub: https://github.com/khaaliDimaag/Wector");
/* Global Variables */
// Getting home location
var weknowhome = false;
// Home
var latsrc;
var lonsrc;
var home;
var hasSet;
// Max Values (in meters/hr, HH, MM, meters)
var maxWalkSpd;
var maxBikeSpd;
var maxWalkTimeH;
var maxBikeTimeH;
var maxWalkTimeM;
var maxBikeTimeM;
var maxWalkDist;
var maxBikeDist;
// Stores the last text highlighted
var lastQuery = "";
// Stores the number of times location has been searched
var queried = 0;
// Start our magic!
document.onmouseup = checkHighlight;
document.ontouchend = checkHighlight;