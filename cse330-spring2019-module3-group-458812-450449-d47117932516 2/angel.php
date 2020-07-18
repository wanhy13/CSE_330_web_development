<!-- <!DOCTYPE html>
<head><title>Registration Page</title></head>
<body> -->
<?php

// error_reporting(E_STRICT);
// session_start();

// $dbname = 'angie';
// $dbusername = 'flipper';
// $dbpassword = '77pbj';

//$handle = mysqli_connect('localhost', $dbusername, $dbpassword, $dbname);
require 'database.php';


$username = $_POST['name'];
// echo $username;
$password = $_POST['password'];
// echo $password;
$passwordAgain= $_POST['comfirmpassword'];
// echo $passwordAgain;
if($password <> $passwordAgain) {
   print 'Error: password confirmation failed; <a href="newusers.php">Back</a>';
   print '</body></html>';
   die();
   
}

$stmt = $mysqli->prepare("select user_name from user ");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->execute();

$stmt->bind_result($name);

while($stmt->fetch()){
	if($name==$username){
        echo " This username has been used ";
        echo "<a href='newusers.php'>try another</a> ";
    }
}

$stmt->close();

$passhash=password_hash($password, PASSWORD_BCRYPT);

$stmt = $mysqli->prepare("insert into user (user_name, password ) values (?, ?)");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->bind_param('ss', $username, $passhash);

$stmt->execute();

$stmt->close();

header("Location: login.html");



//         $result1 = mysqli_query($connection, 'SELECT user_name FROM user 
//             WHERE user_name = "'.$username.'";');

//         if(mysqli_num_rows($result1) > 0 )
//         { 
//             print 'Sorry, that username is already taken; go <a href="index.html">back</a>';
//             exit();
//         }




// $passHash = md5($password);


// //$sql = 'INSERT INTO person (username,passhash) VALUES($username, $passHash)';
// $sql = 'INSERT INTO user (user_name, password) 
//     VALUES ("'.mysqli_real_escape_string($connection, $username).'",
//     "'.mysqli_real_escape_string($connection, $passHash).'");';
// //print $sql;
// //example string: INSERT INTO person (username, passhash) VALUES ("John", "123pass");
// echo $username;
// echo $passHash;
// if(! mysqli_query($connection, $sql)) {; //executing to database
//      if(mysqli_errno($connection)) {
//         printf("Query failed: %s\n", mysqli_errno($connection));
//         print mysqli_error($connection);
//         exit();
//     }
// }

// print 'Successfully created new user '.$username;
// header("Location:login.html");
/*
if(isset($_POST['username'], $_POST["password"])) 
    {     

        //$name = $_POST["username"]; 
       // $password = $_POST['password']; 

        $result1 = mysqli_query($handle, 'SELECT username, passhash FROM users 
            WHERE username = '.$username.' AND  password = '.$passHash);

        if(mysqli_num_rows($result1) > 0 )
        { 
            $_SESSION['logged_in'] = true; 
            $_SESSION['name'] = $username; 
        }
        else
        {
            echo 'The username or password are incorrect!';
        }
}
*/
//$sql = 'INSERT INTO person(username,password,passordAgain) VALUES('$username','$password','passwordAgain')';

?>
<!-- </body>
</html> -->