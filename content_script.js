

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
		    if (status == "ZERO_RESULTS") {
		    	alertUser(flightTime(dst, src));
	    	}
		    else if (status == 'OK') {
		    	var dist = elements['distance'];
		    	var dur = elements['duration'];
		    	if(dur['value']<7200) {
		    		alertUser ("Distance to "+data['destination_addresses'][0]+": "+dist['text']+";&nbsp;&nbsp;Duration: "+dur['text']);
		    	}
		    	else if(dur['value']<36000) {
		    		alertUser ("Distance to "+data['destination_addresses'][0]+": "+dist['text']+";&nbsp;&nbsp;Duration: "+dur['text']+"<br>"+flightTime(dst, src));
		    	}
		    	else {
		    		alertUser (flightTime(dst, src) + "<br>" + "Distance to "+data['destination_addresses'][0]+": "+dist['text']+";&nbsp;&nbsp;Duration: "+dur['text']);
		    	}
		    }
		    else {
		    	;
		    	//alertUser ("Are you sure that's a place?!"); 
		    }
	    }
	});
}


/* Issue: Doesn't return "Approximate direct flight time to " + dst + " is "+ getFlight(latdst, londst, latsrc, lonsrc) + " hours"
returns "".
*/
function flightTime(dst, src) {
	var latdst = -1;
	var londst = -1;
	var latsrc = 42.4439614;
	var lonsrc = -76.5018807;
	var text = "";
	$.ajax ({
		type:"GET",
		url: "https://maps.googleapis.com/maps/api/geocode/json?address="+dst,
		success: function (dstdata) {
			latdst = dstdata['results'][0]['geometry']['location']['lat'];
			londst = dstdata['results'][0]['geometry']['location']['lng'];
			console.log(latdst + " " + londst + "\n" + latsrc + " " + lonsrc);
			text = "Approximate direct flight time to " + dst + " is "+ getFlight(latdst, londst, latsrc, lonsrc) + " hours";
		}
	});
	return text;
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
/*
var button = document.createElement("button");
button.innerHTML = "Wector It!"
button.onmousedown = gText;
button.setAttribute("unselectable","on");
button.style.position = "fixed";
button.style.bottom = "0";
button.style.right = "0";
button.style.padding = "5px";
button.style.color = "yellow";
button.style.background = "black";
button.style.cursor = "pointer";
button.style.font="Calibiri";
button.style.fontSize = "16px";
button.style.border="0";
button.style.borderRadius="10px 0 0 0 ";
button.style.zIndex = "9999";
document.body.appendChild(button);
*/
function getFlight (lat1, lon1, lat2, lon2) {
	return Math.round((100*haversine(lat1, lon1, lat2, lon2)/800)/100);
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