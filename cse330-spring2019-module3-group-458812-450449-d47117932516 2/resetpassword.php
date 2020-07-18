<?php
session_start();



require 'database.php';

if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}

// Use a prepared statement
$stmt = $mysqli->prepare("SELECT COUNT(*), user_name, password FROM user WHERE user_name=?");

// Bind the parameter
$stmt->bind_param('s', $user);
$user = $_POST['username'];
$stmt->execute();

// Bind the results
$stmt->bind_result($cnt, $user_name, $pwd_hash);
$stmt->fetch();

$pwd_guess = $_POST['oldpass'];
// Compare the submitted password to the actual password hash

if($cnt == 1 && password_verify($pwd_guess, $pwd_hash)){
	// Login succeeded!
	$password = $_POST['newpass'];
// echo $password;
  $passwordAgain= $_POST['cnewpass'];
// echo $passwordAgain;
 if($password <> $passwordAgain) {
   print 'Error: password confirmation failed; <a href="resetpassword.html">Back</a>';
   print '</body></html>';
   die();
   
}
$_SESSION['password']=$password;
header("Location:reset.php");
// $passhash=password_hash($password, PASSWORD_BCRYPT);

// $stmt = $mysqli->prepare("update user set password=? where user_name=? ");
// 		if(!$stmt){
// 			printf("Query Prep Failed: %s\n", $mysqli->error);
// 			exit;
// 		}
// 		$stmt->bind_param('ss',$passhash, $user_name);
// 		$stmt->execute();
//         $stmt->close();
//         echo $id;
//         header("Location: logout.php");

    
} else{
    echo "Wrong username or password";
    echo "<a href='resetpassword.html'>try again</a>";
	//Login failed; redirect back to the login screen
}
?>