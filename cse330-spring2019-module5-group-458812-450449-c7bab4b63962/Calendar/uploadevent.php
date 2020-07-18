<?php
ini_set("session.cookie_httponly",1);
session_start();
require 'database.php';
header("Content-Type: application/json"); //sending json response
if (!isset($_SESSION['id']))
{
	echo json_encode(array(
		"success" => false,
		"message" => "Please log in"
	));
	exit;
}
//Because you are posting the data via fetch(), php has to retrieve it elsewhere.
$json_str = file_get_contents('php://input');
//This will store the data into an associative array
$json_obj = json_decode($json_str, true);

$id=$_SESSION['id'];
$m=$json_obj['month'];
$y=$json_obj['year'];
$stmt = $mysqli->prepare("select eventid ,time, description, day, tag from event where userid=? and year=? and month=?");
    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "failed"
        ));
    }
    $stmt->bind_param('iss',$id,$y,$m);
    $stmt->execute();
    $stmt->bind_result($eid,$t,$desc,$day,$tag);
    $events = array();
    $i=0;
    while($stmt->fetch()){
            $events[$i]['eid']=htmlentities($eid);
            $events[$i]['day']=htmlentities($day);
            $events[$i]['time']=htmlentities($t);
            $events[$i]['desc']=htmlentities($desc);
            $events[$i]['tag']=htmlentities($tag);
            $i++;
        }
        $stmt->close();
        echo json_encode(array(
            "events" => $events,
            "success"=>true
            ));
            exit;
        ?>