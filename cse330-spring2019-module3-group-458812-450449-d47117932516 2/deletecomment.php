<?php
session_start();
require  'database.php';

$id= $_POST['id'];
if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}
$stmt=$mysqli->prepare("DELETE FROM comment WHERE id=?");
if(!$stmt){
    printf("Query Prep Failed: %s\n", $mysqli->error);
    exit;
}
$stmt->bind_param('i', $id);
$stmt->execute();
$stmt->close();
 echo $id;
 header("Location:mainpage.php");

?>