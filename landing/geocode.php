<?php
	header("Content-Type:application/json");
	$dst = $_GET['dst'];
	$keys = ['AIzaSyAaZ_ZPlWIX0AiF7iIrN27EMfUupJiIPJo','AIzaSyBcSybt87J4yc9kxf3--QTMFPWIatRVOzM','AIzaSyCaICvBDrbLQLVm5-4Ot-qj4nE2AxZ3RQ4'];
	$key = $keys[rand(0,2)];
	echo json_encode(file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?address=".$dst."&key=".$key));
?>