
<?php
ini_set("session.cookie_httponly",1);
session_start();
require 'database.php';
header("Content-Type: application/json"); 
if(!isset($_SESSION['id'])){
	echo json_encode(array(
        "success"=> false,
        "message"=> "please login"
    ));
	exit;
}

$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);
if($_SESSION['token'] !== $json_obj['token']){
    die("Request forgery detected");}
	$eventid = $json_obj['eid'];
	$stmt = $mysqli->prepare("DELETE FROM event WHERE eventid=?");
	if(!$stmt){
		echo json_encode(array(
            "success"=>false,
            "message"=>"error delete"
        ));
		exit;
	}
	$stmt->bind_param('i',$eventid);
	$stmt->execute();
	$stmt->close();
	echo json_encode(array(
        "success"=>true,
        "message"=>"deleted!"
    ));
	exit;

?>