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
	        console.log(data);
	        var rows = data['rows'][0];
		    var elements = rows['elements'][0];
		    console.log(elements);
		    var status = elements['status'];
		    console.log(status);
		    if (status == "ZERO_RESULTS") {
		    	var a = data['destination_addresses'][0];
		    	var b = data['origin_addresses'][0];
		    	var lata = -1;
		    	var lona = -1;
		    	var latb = -1;
		    	var lonb = -1;
		    	$.ajax ({
		    		type:"GET",
		    		url: "https://maps.googleapis.com/maps/api/geocode/json?address="+a,
		    		success: function (adata) {
		    			console.log(adata);
		    			lata = adata['results'][0]['geometry']['location']['lat'];
		    			lona = adata['results'][0]['geometry']['location']['lng'];
		    			$.ajax ({
				    		type:"GET",
				    		url: "https://maps.googleapis.com/maps/api/geocode/json?address="+b,
				    		success: function (bdata) {
				    			console.log(bdata);
				    			latb = bdata['results'][0]['geometry']['location']['lat'];
				    			lonb = bdata['results'][0]['geometry']['location']['lng'];
				    			console.log (lata, lona, latb, lonb);
				    			alert ("Approximate flight time to " + a + " is "+getFlight(lata, lona, latb, lonb)+" hours");
				    		}
				    	});
		    		}
		    	});		    	
		    }
		    else if (status == 'OK') {
		    	var dist = elements['distance'];
		    	var dur = elements['duration'];
		    	alert ("Distance to "+data['destination_addresses'][0]+": "+dist['text']+"\nDuration: "+dur['text']);
		    }
		    else {
		    	alert ("Are you sure that's a place?!"); 
		    }
	    }
	});
}

var button = document.createElement("button");
button.innerHTML = "Wector It!"
button.onmousedown = gText;
button.setAttribute("unselectable","on");
button.style.position = "fixed";
button.style.bottom = "0";
button.style.right = "0";
button.style.padding = "5px";
button.style.color = "white";
button.style.background = "black";
button.style.cursor = "pointer";
button.style.font="menu";
button.style.fontSize = "16px";
button.style.border="0";
button.style.borderRadius="10px 0 0 0 ";
button.style.zIndex = "9999";
document.body.appendChild(button);

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