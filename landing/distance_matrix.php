<?php
	$lat = $_GET['lat'];
	$lon = $_GET['lon'];
	$dst = $_GET['dst'];
	echo (file_get_contents("https://maps.googleapis.com/maps/api/distancematrix/json?origins=".$lat.",".$lon."&destinations=".$dst."&language=en-EN&key=AIzaSyAaZ_ZPlWIX0AiF7iIrN27EMfUupJiIPJo"));
?>