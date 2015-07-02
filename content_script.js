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
		    if (status != "OK") {
		    	alert ("Oops! There's nothing there!");
		    }
		    else {
		    	var dist = elements['distance'];
		    	var dur = elements['duration'];
		    	alert ("Distance to "+data['destination_addresses'][0]+": "+dist['text']+"\nDuration: "+dur['text']);
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

function getDistance (lat1, lon1, lat2, lon2) {
	Number.prototype.toRad = function() {
	   return this * Math.PI / 180;
	}

	var R = 6371; // km 
	var x1 = lat2-lat1;
	var dLat = x1.toRad();  
	var x2 = lon2-lon1;
	var dLon = x2.toRad();  
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
	                Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
	                Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; 

	alert(d);
}