<?php
	header("Content-Type:application/json");
	$lat = $_GET['lat'];
	$lon = $_GET['lon'];
	$word = $_GET['word'];
	$rad = $_GET['rad'];
	$keys = ['AIzaSyAaZ_ZPlWIX0AiF7iIrN27EMfUupJiIPJo','AIzaSyBcSybt87J4yc9kxf3--QTMFPWIatRVOzM','AIzaSyCaICvBDrbLQLVm5-4Ot-qj4nE2AxZ3RQ4'];
	$key = $keys[rand(0,2)];
	echo json_encode(file_get_contents("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=".$lat.",".$lon."&radius=".$rad."&rankby=prominence&keyword=".$word."&key=".$key));
?>