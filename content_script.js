// DOM

/*
Icon list (from Font-Awesome) :
Flight: "<i class='fa fa-paper-plane-o'></i>  "
Car: "<i class='fa fa-car'></i>  "
Bike: "<i class='fa fa-bicycle'></i>  "
Walk: "<i class='zmdi zmdi-directions-walk'></i>  "
*/

// Icon Links
var fa_link = document.createElement("link");
fa_link.rel = "stylesheet";
fa_link.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css";
document.getElementsByTagName("head")[0].appendChild( fa_link );
var md_link = document.createElement("link");
md_link.rel = "stylesheet";
md_link.href = "https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.0.2/css/material-design-iconic-font.min.css";
document.getElementsByTagName("head")[0].appendChild( md_link );

document.onmouseup = checkHighlight;

function checkHighlight() {
	var text = "";
	// TODO: Understand this!
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }

    if (text != "" && text.length < 50 && text != lastQuery) {
    	gText(text);
    }
}

var latsrc;
var lonsrc;
var home;
var lastQuery = "";

function gText(txt) {
    var text = txt;
    lastQuery = text;
    var dest = text;
    $.ajax({
	    type:     "GET",
	    url:      "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+home+"&destinations="+dest+"&language=en-EN",
	    success: function(data){
	        var rows = data['rows'][0];
		    var elements = rows['elements'][0];
	 	    var status = elements['status'];
	    	var dst = data['destination_addresses'][0];
	    	var src = data['origin_addresses'][0];
		    if (status == "ZERO_RESULTS") {
		    	var latdst = -1;
				var londst = -1;
				var text = "";
				$.ajax ({
					type:"GET",
					url: "https://maps.googleapis.com/maps/api/geocode/json?address="+dst,
					success: function (dstdata) {
						latdst = dstdata['results'][0]['geometry']['location']['lat'];
						londst = dstdata['results'][0]['geometry']['location']['lng'];
						console.log(latdst + " " + londst + "\n" + latsrc + " " + lonsrc);
						var flightTime = getFlight(latdst, londst, latsrc, lonsrc);
						var flight = "<i class='fa fa-paper-plane-o'></i>  " + flightTime + " hour";
						if (flightTime != 1) {
							flight+="s";
						}
						alertUser(dst, "", flight, "", "", 0, 1, 0, 0);
					}
				});				
	    	}
		    else if (status == 'OK') {
		    	var dist = elements['distance'];
		    	var dur = elements['duration'];

		    	// Set Text
		    	var car=" <i class='fa fa-car'></i>  " + dur['text'];
		    	var flight=" <i class='fa fa-paper-plane-o'></i>  ";
		    	var walk=" <i class='zmdi zmdi-directions-walk'></i>  ";
		    	var bike=" <i class='fa fa-bicycle'></i>  ";

		    	// Walking && Biking (Max: 3hours)
		    	if(dist['value']<=25000) {
		    		// Walking
		    		var walkTime = dist['value']/6000;
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
		    		var bikeTime = dist['value']/15000;
		    		var bH = bikeTime|0;
		    		console.log(bH);
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

		    		// Priorities
		    		if(wH <= 0 && wM <= 30) {
		    			alertUser(dst, car, flight, bike, walk, 3, 0, 2, 1);
		    		} else if(bH <= 0 && bM <= 30) {
		    			alertUser(dst, car, flight, bike, walk, 2, 0, 1, 3);
		    		} else {
		    			alertUser(dst, car, flight, bike, walk, 1, 0, 2, 3);
		    		}
		    		
		    	} else if(dur['value']<7200) {
		    		alertUser (dst, car, flight, bike, walk, 1, 0, 0, 0);
		    	} else {
		    		var latdst = -1;
					var londst = -1;
					$.ajax ({
						type:"GET",
						url: "https://maps.googleapis.com/maps/api/geocode/json?address="+dst,
						success: function (dstdata) {
							latdst = dstdata['results'][0]['geometry']['location']['lat'];
							londst = dstdata['results'][0]['geometry']['location']['lng'];
							console.log(latdst + " " + londst + "\n" + latsrc + " " + lonsrc);
							var flightTime = getFlight(latdst, londst, latsrc, lonsrc)
							flight += flightTime + " hour";
							if (flightTime != 1) {
								flight+="s";
							}

							if(dur['value']<36000) {
					    		alertUser (dst, car, flight, bike, walk, 1, 2, 0, 0);
					    	}
					    	else {
					    		alertUser (dst, car, flight, bike, walk, 2, 1, 0, 0);
					    	}
						}
					});
			    }
		    }
		    else {
		    	; //That's not a place
		    }
	    }
	});
}

function findWidth (a, b, c, d) {
	var sum = a+b+c+d;
	return (sum == 10) ? "four" : (sum == 6) ? "three" : (sum == 3) ? "two" : "one";
}

function resetBodyClass () {
	document.getElementsByTagName("body")[0].className =document.getElementsByTagName("body")[0].className.replace(/\bone\b/,'');
	document.getElementsByTagName("body")[0].className =document.getElementsByTagName("body")[0].className.replace(/\btwo\b/,'');
	document.getElementsByTagName("body")[0].className =document.getElementsByTagName("body")[0].className.replace(/\bthree\b/,'');
	document.getElementsByTagName("body")[0].className =document.getElementsByTagName("body")[0].className.replace(/\bfour\b/,'');
}

function alertUser (dst, car, flight, bike, walk, priority_c, priority_f, priority_b, priority_w) {
	var widthOfEachMode = " "+findWidth(priority_w, priority_b, priority_f, priority_c);
	dst = "<div id = 'address'>"+dst+"</div>";
	var text = dst + "<div id = 'info'>";
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
	console.log(text);
	// Display Text
	var a = document.createElement("div");
	a.innerHTML = text;
	a.id = "Wector"
	a.style.position = "fixed";
	a.style.bottom = "0";
	a.style.left = "0";
	a.style.width = "100%";
	//a.style.padding = "0.5%";
	a.style.background = "black";
	a.style.color = "white";
	a.style.font="menu";
	a.style.fontSize = "16px";
	a.style.border="0";
	a.style.borderRadius="10px 10px 0 0 ";
	a.style.zIndex = "2147483648";
	a.style.textAlign = "center";
	a.style.display = "none";

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
			var style = window.getComputedStyle(document.getElementById("address"), null);
			document.getElementById("info").style.lineHeight = style.getPropertyValue("height"); 
		});
		
		setInterval(function(){ $(a).slideUp("fast", function(){if (document.contains(a)) document.body.removeChild(a);}); }, 111115000);
	}
	else {
		$(previous).slideUp("fast", function() {
			document.body.removeChild(previous);
			resetBodyClass();
			document.getElementsByTagName("body")[0].className += widthOfEachMode;
			document.body.appendChild(a);
			$(a).slideDown("fast", function () {
				var style = window.getComputedStyle(document.getElementById("address"), null);
				document.getElementById("info").style.lineHeight = style.getPropertyValue("height"); 
			});
			setInterval(function(){ $(a).slideUp("fast", function(){if (document.contains(a)) document.body.removeChild(a);}); }, 5000);							
		});
	}
}

function initialize () {
	chrome.storage.sync.get({latitude:42.4433, longitude:-76.5000, address:"Ithaca, NY"}, function(items) {
		latsrc = items.latitude;
		lonsrc = items.longitude;
		home = items.address;
	});
}
initialize();

function getFlight (lat1, lon1, lat2, lon2) {
	var distance = haversine(lat1, lon1, lat2, lon2);
	var slowDistance = Math.min(distance, 300);
	var remDistance = distance-slowDistance;
	var slowTime = slowDistance/400;
	var cruiseTime = remDistance/800;
	var totalTime = slowTime+cruiseTime;
	return Math.ceil((totalTime*100)/100);
}

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