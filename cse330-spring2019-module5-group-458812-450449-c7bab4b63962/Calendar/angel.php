
<?php
ini_set("session.cookie_httponly",1);
require 'database.php';
header("Content-Type: application/json");

$json_str = file_get_contents('php://input');
$json_obj = json_decode($json_str, true);

$username = $json_obj['username'];

$password = $json_obj['password'];



$stmt = $mysqli->prepare("select username from users ");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}

$stmt->execute();

$stmt->bind_result($name);

while($stmt->fetch()){
	if($name==$username){
        echo json_encode(array(
            "success" => false,
            "message" => "repeat username"
        ));
        exit;
    }
}

$stmt->close();

$passhash=password_hash($password, PASSWORD_BCRYPT);

$stmt = $mysqli->prepare("insert into users (username, password ) values (?, ?)");
if(!$stmt){
    echo json_encode(array(
        "success" => false,
        "message" => "faild to insert"
    ));
	exit;
}

$stmt->bind_param('ss', $username, $passhash);

$stmt->execute();

$stmt->close();
echo json_encode(array(
    "success" => true
));
exit;
?>