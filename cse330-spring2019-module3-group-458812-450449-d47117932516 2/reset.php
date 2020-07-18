<?php
session_start();
require 'database.php';

$user_name=$_SESSION['name'];
$password=$_SESSION['password'];
$passhash=password_hash($password, PASSWORD_BCRYPT);

$stmt = $mysqli->prepare("update user set password=? where user_name=? ");
		if(!$stmt){
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit;
		}
		$stmt->bind_param('ss',$passhash, $user_name);
		$stmt->execute();
        $stmt->close();
        echo $id;
        header("Location: logout.php");
?>