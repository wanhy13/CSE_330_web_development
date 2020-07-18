<?php
ini_set("session.cookie_httponly",1);
session_start();
require 'database.php';
header("Content-Type: application/json");

//check the users
if (!isset($_SESSION['id'])){
    echo json_encode(array(
        "success"=> false,
        "message"=> "please login"
    ));
	exit;
}
//token?


$json_str =file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

if($_SESSION['token'] !== $json_obj['token']){
    die("Request forgery detected");}

$year = $json_obj['year'];
$m = $json_obj['month2'];
$d = $json_obj['day'];
$time = $json_obj['time'];
$desc = $json_obj['desc'];
$tag = $json_obj['tag'];
if(!isset($json_obj['ui'])){$id=$_SESSION['id'];}else{
$id = $json_obj['ui'];}

$stmt = $mysqli->prepare("insert into event (description, userid, time, tag,year,day,month) values (?, ?, ?, ?,?,?,?) ");
		if(!$stmt){
			echo json_encode(array(
                "success"=> false,
                "message"=> "add event fail"
            ));
            exit;
        }
        // echo $title;
        // echo $link;
        // echo $content;
		$stmt->bind_param('sisssss',$desc,$id,$time,$tag,$year,$d,$m);
		$stmt->execute();
        $stmt->close();
        echo json_encode(array(
            "success"=>true
        ));
        exit;
