<?php
	header("Content-Type:application/json");
	$lat = $_GET['lat'];
	$lon = $_GET['lon'];
	$word = $_GET['word'];
	$rad = $_GET['rad'];
	echo json_encode(file_get_contents("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=".$lat.",".$lon."&radius=".$rad."&rankby=prominence&keyword=".$word."&key=AIzaSyAaZ_ZPlWIX0AiF7iIrN27EMfUupJiIPJo"));
?>