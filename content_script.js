

function checkHighlight() {
	var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    if (text != "" && text.length < 50) {
    	gText();
    }
}

document.onmouseup = checkHighlight;

function gText() {
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
						text = "Approximate direct flight time to " + dst + " is "+ flightTime + " hour";
						if (flightTime != 1) {
							text+="s";
						}
						alertUser(text);
					}
				});				
	    	}
		    else if (status == 'OK') {
		    	var dist = elements['distance'];
		    	var dur = elements['duration'];
		    	if(dur['value']<7200) {
		    		alertUser ("Distance to "+data['destination_addresses'][0]+": "+dist['text']+";&nbsp;&nbsp;Duration: "+dur['text']);
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
							text = "Approximate direct flight time to " + dst + " is "+ flightTime + " hour";
							if (flightTime != 1) {
								text+="s";
							}
							if(dur['value']<36000) {
					    		alertUser ("Distance to "+dst+" by road: "+dist['text']+";&nbsp;&nbsp;Duration: "+dur['text']+"<br>"+text);
					    	}
					    	else {
					    		alertUser (text + "<br>" + "Distance to "+dst+" by road: "+dist['text']+";&nbsp;&nbsp;Duration: "+dur['text']);
					    	}
						}
					});
			    }
		    }
		    else {
		    	//That's not a place
		    }
	    }
	});
}

function alertUser (text) {
	var a = document.createElement("div");
	a.innerHTML = text;
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
	a.style.zIndex = "9999";
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