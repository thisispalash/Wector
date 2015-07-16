<?php
	header("Content-Type:application/json");
	$dst = $_GET['dst'];
	echo json_encode(file_get_contents("https://maps.googleapis.com/maps/api/geocode/json?address=".$dst."&key=AIzaSyAaZ_ZPlWIX0AiF7iIrN27EMfUupJiIPJo"));
?>