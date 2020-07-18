<?php
session_start();
require 'database.php';
?>

<?php    
$title=(string)$_POST['title'];
$author=htmlspecialchars($_SESSION['name']);
$content=(string) $_POST['content'];
$link= (string)$_POST['link'];

//csrf
if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}

$stmt = $mysqli->prepare("insert into story (title, user, content, link) values (?, ?, ?, ?)");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}
// else{
//     printf("%s", $author);
//     printf("%s , %s, %s, %s", $title, $author, $content, $link);
//     exit;
// }

$stmt->bind_param('ssss', $title, $author, $content, $link);

$stmt->execute();

$stmt->close();
header("Location: mainpage.php");
exit;


?>
