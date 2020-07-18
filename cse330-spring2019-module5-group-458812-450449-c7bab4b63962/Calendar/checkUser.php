<?php
ini_set("session.cookie_httponly",1);
session_start();
require 'database.php';
header("Content-Type: application/json");
//check the current user
if(isset($_SESSION['user_id'])){
	echo json_encode(array("username" => true, "token" => $_SESSION['token']));
	exit;
}
else {
	echo json_encode(array("username" => false));
}
exit;