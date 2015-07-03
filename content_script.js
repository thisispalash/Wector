// DOM

//$("head").append('<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css" type="text/css" rel="stylesheet"/>');
/*
link = document.createElement( "link" );
link.href = "./font-awesome/css/font-awesome.min.css"
link.type = "text/css";
link.rel = "stylesheet";
document.getElementsByTagName( "head" )[0].appendChild( link );
*/
document.onmouseup = checkHighlight;

function checkHighlight() {
	var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    if (text != "" && text.length < 50) {
    	gText(text);
    }
}


function gText(txt) {
	
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString(); 
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }

    var dest = text;
    var home = "Ithaca, NY";
    //var resp = httpGet("https://maps.googleapis.com/maps/api/distancematrix/json?origins="+home+"&destinations="+dest+"&language=en-EN");
    
    $.ajax({
	    type:     "GET",
	    url:      "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+home+"&destinations="+dest+"&language=en-EN",
	    success: function(data){
	        var rows = data['rows'][0];
		    var elements = rows['elements'][0];
	 	    var status = elements['status'];
	    	var dst = data['destination_addresses'][0];
	    	var src = data['origin_addresses'][0];
	    	var latsrc = 42.4439614; // SET THROUGH SETTINGS
			var lonsrc = -76.5018807; // SAME
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
		    	if(dur['value']<7200) {
		    		var car = "<i class='fa fa-car'></i>  " + dur['text'];
		    		alertUser (dst, car, "", "", "", 1, 0, 0, 0);
		    	}
		    	else {
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
							var flight = " <i class='fa fa-paper-plane-o'></i>  " + flightTime + " hour";
							if (flightTime != 1) {
								flight+="s";
							}
							if(dur['value']<36000) {
								var car = "<i class='fa fa-car'></i>  " + dur['text'];
					    		alertUser (dst, car, flight, "", "", 1, 2, 0, 0);
					    	}
					    	else {
								var car = "<i class='fa fa-car'></i>  " + dur['text'];
					    		alertUser (dst, car, flight, "", "", 2, 1, 0, 0);
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

function alertUser (dst, car, flight, bike, walk, priority_c, priority_f, priority_b, priority_w) {
	var text = dst + "<br>| ";
	// Add the display to (var)text according to priority
	if(priority_c == 1) {
		text += car + " | ";
	} else if(priority_f == 1) {
		text += flight + " | ";
	} else if(priority_b == 1) {
		text += bike + " | ";
	} else if(priority_w == 1) {
		text += walk + " | ";
	}
	if(priority_c == 2) {
		text += car + " | ";
	} else if(priority_f == 2) {
		text += flight + " | ";
	} else if(priority_b == 2) {
		text += bike + " | ";
	} else if(priority_w == 2) {
		text += walk + " | ";
	}
	if(priority_c == 3) {
		text += car + " | ";
	} else if(priority_f == 3) {
		text += flight + " | ";
	} else if(priority_b == 3) {
		text += bike + " | ";
	} else if(priority_w == 3) {
		text += walk + " | ";
	}
	if(priority_c == 4) {
		text += car + " | ";
	} else if(priority_f == 4) {
		text += flight + " | ";
	} else if(priority_b == 4) {
		text += bike + " | ";
	} else if(priority_w == 4) {
		text += walk + " | ";
	} 
	console.log(text);
	// Display Text
	var a = document.createElement("div");
	a.innerHTML = text;
	a.id = "Wector"
	a.style.position = "fixed";
	a.style.bottom = "0";
	a.style.left = "0";
	a.style.width = "99%";
	a.style.padding = "0.5%";
	a.style.background = "black";
	a.style.color = "white";
	a.style.font="menu";
	a.style.fontSize = "16px";
	a.style.border="0";
	a.style.borderRadius="10px 10px 0 0 ";
	a.style.zIndex = "2147483647";
	a.style.textAlign = "center";
	a.style.display = "none";
	document.body.appendChild(a);
	$(a).slideDown("slow");
	setInterval(function(){ $(a).slideUp("slow") }, 5000);
}

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