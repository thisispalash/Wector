/*
 * Icon list (from Font-Awesome-4.0.3 and Material-Design-Iconic-Font) + Custom CSS:
  * Flight: "<i class='fa fa-paper-plane-o Wector-plane'></i>  "
  * Car: "<i class='fa fa-car Wector-car'></i>  "
  * Bike: "<i class='fa fa-bicycle Wector-cycle'></i>  "
  * Walk: "<i class='zmdi zmdi-directions-walk Wector-walk'></i>  "
  * External Link: "<i class='fa fa-external-link Wector-map'>  "
 */

/*
 * Sets hide to false. 
 */
function setHide() {
	hide = false;
}

/*
 * Takes the selected text and calls main() 
 */
function checkHighlight() {
	if(!hide) {
		var text = "";
		// TODO: Understand this!
	    if (window.getSelection) {
	        text = window.getSelection().toString();
	    } else if (document.selection && document.selection.type != "Control") {
	        text = document.selection.createRange().text;
	    }
	    if (text != "" && text.length < 50 && text != lastQuery && !trie.exists(text)) {
	    	initializeHome(1, function() {
	    		if (hasSet) {
		    		main(text);
		    	}
	    	});
	    }
	}
}

/*
 * Alert shown if location not set
 */
function displaySettingsAlert() {
	var a = document.createElement("div");
	var iconURL = chrome.extension.getURL("/logo48w.png");
	a.innerHTML = "<img src = '"+iconURL+"' style='width:40px; vertical-align:middle;' /> needs to know where you are to show you travel estimates. Click here to set it up!";
	a.id = "WectorSetAlert"
	a.style.position = "fixed";
	a.style.bottom = "0";
	a.style.left = "0";
	a.style.width = "100%";
	a.style.color = "white";
	a.style.font="menu";
	a.style.fontSize = "16px";
	a.style.border="0";
	a.style.borderRadius="0px";
	a.style.zIndex = "2147483648";
	a.style.textAlign = "center";
	a.style.display = "none";
	a.style.padding = "0.5%";
	$(a).on('click', function() {
		chrome.runtime.sendMessage({message:"showOptions"});
	});
	document.body.appendChild(a);
	$(a).slideDown("fast");
	setTimeout(function(){ $(a).slideUp("fast", function(){if (document.contains(a)) document.body.removeChild(a);}); }, 6660);
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
	    type:     "GET",
	    url:      "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+home+"&destinations="+dest+"&language=en-EN",
	    success: function(data){
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
					url: "https://maps.googleapis.com/maps/api/geocode/json?address="+dst,
					success: function (dstdata) {
						latdst = dstdata['results'][0]['geometry']['location']['lat'];
						londst = dstdata['results'][0]['geometry']['location']['lng'];
						//console.log(latdst + " " + londst + "\n" + latsrc + " " + lonsrc);
						var flightTime = getFlight(latdst, londst, latsrc, lonsrc);
						var flight = "<i class='fa fa-paper-plane-o Wector-plane'></i>  " + flightTime + " hour";
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
		    	var car=" <i class='fa fa-car Wector-car'></i>  " + dur['text'];
		    	var flight=" <i class='fa fa-paper-plane-o Wector-plane'></i>  ";
		    	var walk=" <i class='zmdi zmdi-directions-walk Wector-walk'></i>  ";
		    	var bike=" <i class='fa fa-bicycle Wector-cycle'></i>  ";

		    	// Walking && Biking (Max: 3hours)
		    	if((0.95*dist['value'])<=Math.max(maxWalkDist, maxBikeDist)) {
		    		// Walking
		    		var walkTime = (0.95*dist['value'])/(maxWalkSpd);
		    		var wH = Math.floor(walkTime);
		    		var walkHour;
		    		if(wH == 0) {
		    			walkHour = " ";
		    		} else if(wH == 1) {
		    			walkHour = " " + wH + " hour";
		    		} else {
		    			walkHour = " " + wH + " hours";
		    		}
		    		var wM = Math.floor((walkTime-wH)*60);
		    		var walkMin = " " + wM + " min";
		    		if(wM != 1) {
		    			walkMin += "s";
		    		}
		    		walk += walkHour + walkMin;

		    		// Biking
		    		var bikeTime = (0.95*dist['value'])/(maxBikeSpd);
		    		var bH = Math.floor(bikeTime);
		    		var bikeHour;
		    		if(bH == 0) {
		    			bikeHour = " ";
		    		} else if(bH == 1) {
		    			bikeHour = " " + bH + " hour";
		    		} else {
		    			bikeHour = " " + bH + " hours";
		    		}
		    		var bM = Math.floor((bikeTime-bH)*60);
		    		var bikeMin = " " + bM + " min";
		    		if(bM != 1) {
		    			bikeMin += "s";
		    		}
		    		bike += bikeHour + bikeMin;

		    		// Check if maxBikeTime is crossed
		    		var showBike = true;
		    		if (bH > maxBikeTimeH || (bH == maxBikeTimeH && bM > maxBikeTimeM)) showBike = false;
		    		// Check if maxWalkTime is crossed
		    		var showWalk = true;
		    		if (wH > maxWalkTimeH || (wH == maxWalkTimeH && wM > maxWalkTimeM)) showWalk = false;
		    		// Display alert accordingly with appropriate priorities
		    		var carPriority = 1;
		    		var bikePriority = 0;
		    		var walkPriority = 0;
		    		if (showBike) {
		    			bikePriority = 1;
		    			carPriority = 2;
		    			if (showWalk) {
		    				walkPriority = 1;
		    				bikePriority = 2;
		    				carPriority = 3;
		    			}
		    		}
		    		else if (showWalk) {
		    			walkPriority = 1;
		    			carPriority = 2;
		    			if (showBike) {
		    				walkPriority = 1;
		    				bikePriority = 2;
		    				carPriority = 3;
		    			}
		    		}
		    		alertUser(src, dst, car, flight, bike, walk, carPriority, 0, bikePriority, walkPriority);
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
						url: "https://maps.googleapis.com/maps/api/geocode/json?address="+dst,
						success: function (dstdata) {
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
	return (sum == 10) ? "Wector4" : (sum == 6) ? "Wector3" : (sum == 3) ? "Wector2" : "Wector1";
}

/*
 * Reset function
 */
function resetBodyClass () {
	document.getElementsByTagName("body")[0].className = document.getElementsByTagName("body")[0].className.replace(/\bWector1\b/,'');
	document.getElementsByTagName("body")[0].className = document.getElementsByTagName("body")[0].className.replace(/\bWector2\b/,'');
	document.getElementsByTagName("body")[0].className = document.getElementsByTagName("body")[0].className.replace(/\bWector3\b/,'');
	document.getElementsByTagName("body")[0].className = document.getElementsByTagName("body")[0].className.replace(/\bWector4\b/,'');
}

/*
 * Displays the information on a beautiful sliding div at the bottom of the screen
 */
function alertUser (src, dst, car, flight, bike, walk, priority_c, priority_f, priority_b, priority_w) {
	var map_link = "https://www.google.com/maps/dir/"+src+"/"+dst;
	dst = "<div id = 'WectorAddress'>"+dst+"</div>";
	var widthOfEachMode = " "+findWidth(priority_w, priority_b, priority_f, priority_c);
	var text = dst;

	var show_link = "<i class='zmdi zmdi-directions Wector-map'></i>  Route";
	show_link = "<div id = 'WectorLinks'>" + show_link + "</div>";

	text += "<div id = 'WectorInfo'>";

	car = "<div class = 'WectorMode'>"+car+"</div>";
	flight = "<div class = 'WectorMode'>"+flight+"</div>";
	bike = "<div class = 'WectorMode'>"+bike+"</div>";
	walk = "<div class = 'WectorMode'>"+walk+"</div>";

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
	};

	var previous = document.getElementById("Wector");
	if (previous == null) {
		resetBodyClass();
		document.getElementsByTagName("body")[0].className += widthOfEachMode;
		document.body.appendChild(a);
		$(a).slideDown("fast", function () {
			var setHeightTo = $("#WectorAddress").height();
			document.getElementById("WectorInfo").style.lineHeight = setHeightTo+"px";
			document.getElementById("WectorLinks").style.lineHeight = setHeightTo+"px";
			// Fix for corner case websites:
			var ourBar = $("#WectorAddress").width() + $("#WectorInfo").width() + $("#WectorLinks").width();
			var wholeScreen = $(this).width();
			if (Math.abs(1.03*ourBar - wholeScreen) > 5) {
				document.getElementById("WectorAddress").style.width = "36%";
				document.getElementById("WectorInfo").style.width = "48%";
				document.getElementById("WectorLinks").style.width = "16%";
			}
		});
		document.getElementById("WectorAddress").onclick = function () {hide = true;};
		document.getElementById("WectorInfo").onclick = function () {hide = true;};
		document.getElementById("WectorLinks").onclick = function () {window.open(map_link, "_blank");};
		setTimeout(function(){ $(a).slideUp("fast", function(){if (document.contains(a)) document.body.removeChild(a);}); }, 6660); // 6.66Os
	}
	else {
		$(previous).slideUp("fast", function() {
			document.body.removeChild(previous);
			resetBodyClass();
			document.getElementsByTagName("body")[0].className += widthOfEachMode;
			document.body.appendChild(a);
			$(a).slideDown("fast", function () {
				var setHeightTo = $("#WectorAddress").height();
				document.getElementById("WectorInfo").style.lineHeight = setHeightTo+"px";
				document.getElementById("WectorLinks").style.lineHeight = setHeightTo+"px";
				//fix for corner case websites:
				var ourBar = $("#WectorAddress").width() + $("#WectorInfo").width() + $("#WectorLinks").width();
				var wholeScreen = $(this).width();
				if (Math.abs(1.03*ourBar - wholeScreen) > 5) {
					document.getElementById("WectorAddress").style.width = "36%";
					document.getElementById("WectorInfo").style.width = "48%";
					document.getElementById("WectorLinks").style.width = "16%";
				}
			});
			document.getElementById("WectorAddress").onclick = function () {hide = true;};
			document.getElementById("WectorInfo").onclick = function () {hide = true;};
			document.getElementById("WectorLinks").onclick = function () {window.open(map_link, "_blank");};
			setTimeout(function(){ $(a).slideUp("fast", function(){if (document.contains(a)) document.body.removeChild(a);}); }, 6660); // 6.66Os						
		});
	}
}

/* 
 * Initialize custom variables from Settings
 */
function initializeHome (highlighted, callback) {
	chrome.storage.sync.get({latitude:42.4534492, longitude:-76.4735027, address:"Cornell University", mWS:5000, mBS:14000, mWTH:0, mBTH:0, mWTM:30, mBTM:30, exists:false},
		function(items) {
			latsrc = items.latitude;
			lonsrc = items.longitude;
			home = items.address;
			maxWalkSpd = items.mWS;
			maxBikeSpd = items.mBS;
			maxWalkTimeH = items.mWTH;
			maxBikeTimeH = items.mBTH;
			maxWalkTimeM = items.mWTM;
			maxBikeTimeM = items.mBTM;
			maxWalkDist = (maxWalkSpd)*(maxWalkTimeH+maxWalkTimeM/60.0);
			maxBikeDist = (maxBikeSpd)*(maxBikeTimeH+maxBikeTimeM/60.0);
			hasSet = items.exists;
			if(!hasSet && highlighted == 1) {
				displaySettingsAlert();
			}
			callback();
	});
}

/*
 * For the Landing Page (Wector.ml)
 * Checks if user has Extension installed (and enabled) or not
 */
function atWectorML() {
	try {
		if (document.getElementById("thisIsForTheExtension") != null) {
			document.getElementById("install").style.display = "none";
			document.getElementById("try").style.display = "none"
			document.getElementById("alreadyhave").style.display="block";
			document.getElementById("p1a").onclick = function() {
				chrome.runtime.sendMessage({message:"showOptions"});
			};
		}
		// log if not at Wector.ml
		else {
			console.log("Thanks for using Wector! Visit us at http://wector.ml");
		}
	}
	catch(err) {
		console.log("Wector Error: "+err);
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

/*
 * Read words from dictionary.txt, insert them in the dictionary trie
 */
function initializeDictionary () {
	trie = new suffixTree ();
	trie.insertList(words);
}

/*
 * Suffix tree module:
 */
 var suffixTreeNode = function (data, keys, next, isEnd, words) {
    this.data = data;
    this.keys = keys;
    this.next = next;
    this.isEnd = isEnd;
    this.words = words;
};

var suffixTree = function () {
    this.root = new suffixTreeNode(' ', [], [], false, []);
}

suffixTree.prototype.insertList = function (x) {
    for (var i = 0; i < x.length; i++) {
        this.insertWord(x[i], i);
    }
}

suffixTree.prototype.insertWord = function (s, index) {
    if (s.length == 0) {
        return;
    }
    else {
        var current = this.root;
        for (var i = 0; i < s.length; i++) {
            var ch = s[i];
            ch = ch.toLowerCase();
            var find = current.keys.indexOf(ch);
            if (find == -1) {
                current.keys.push(ch);
                current.next.push(new suffixTreeNode(ch, [], [], false, []));
                current = current.next[current.next.length-1];
            }
            else {
                current = current.next[find];
            }
            current.isEnd = true;
            if (current.words.indexOf(index) == -1) current.words.push(index);
        }
    }
}

suffixTree.prototype.exists = function (s) {
    s = s.toLowerCase();
    var current = this.root;
    for (var i = 0; i < s.length; i++) {
        var ch = s[i];
        var find = current.keys.indexOf(ch);
        if (find == -1) {
            return false;
        }
        else {
            current = current.next[find];
        }
    }
    if (current.isEnd) {
        return true;
    }
    else {
        return false;
    }
}

// End of suffix tree module

// Start of content_script.js
// Icon Links
var fa_link = document.createElement("link");
fa_link.rel = "stylesheet";
fa_link.href = "https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css";
document.getElementsByTagName("head")[0].appendChild( fa_link );
var md_link = document.createElement("link");
md_link.rel = "stylesheet";
md_link.href = "https://cdnjs.cloudflare.com/ajax/libs/material-design-iconic-font/2.0.2/css/material-design-iconic-font.min.css";
document.getElementsByTagName("head")[0].appendChild( md_link );
/* Global Variables */
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
// Stores last text highlighted.
var lastQuery = "";
// Dictionary trie
var trie;
// Check if Extentsion is installed
atWectorML();
// Initialise Home Settings
initializeHome(0, function() {});
// Instantiate dictionary
initializeDictionary();
// Show/Hide Alert
var hide;
window.onload = setHide;
// Start our magic!
document.onmouseup = checkHighlight;
