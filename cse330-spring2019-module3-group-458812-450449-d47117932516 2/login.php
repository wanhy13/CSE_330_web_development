<?php
// This is a *good* example of how you can implement password-based user authentication in your web application.
session_start();



require 'database.php';

// Use a prepared statement
$stmt = $mysqli->prepare("SELECT COUNT(*), user_name, password FROM user WHERE user_name=?");

// Bind the parameter
$stmt->bind_param('s', $user);
$user = $_POST['username'];
$stmt->execute();

// Bind the results
$stmt->bind_result($cnt, $user_name, $pwd_hash);
$stmt->fetch();

$pwd_guess = $_POST['password'];
// Compare the submitted password to the actual password hash

if($cnt == 1 && password_verify($pwd_guess, $pwd_hash)){
	// Login succeeded!
    $_SESSION['name'] = $user_name;
    $_SESSION['token'] = bin2hex(openssl_random_pseudo_bytes(32));
    // Redirect to your target page
    header("Location: mainpage.php");
} else{
    echo "Wrong username or password";
    echo "<a href='login.html'>try again</a>";
	//Login failed; redirect back to the login screen
}
?>