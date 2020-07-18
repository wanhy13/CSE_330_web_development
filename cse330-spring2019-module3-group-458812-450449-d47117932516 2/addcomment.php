<?php
session_start();
require 'database.php';
$story_id=$_POST['storyid'];
 //echo $story_id;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>uploadstory</title>
</head>
<body>
    <form action="addcomment.php" method="POST">
    
        <lable>Content: <input type="text" name="content"></lable>
        <input type="hidden" name="storyid" value=<?php echo $story_id ?>> 
        <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
        <br> 
        <input type="submit" value="upload">
</form>
<br>
<form action="view.php" method="POST">
    <input type="submit" value="Cancel">
</form>

<?php   
if(isset($_POST['content'])) {
// $title=(string)$_POST['title'];
$author=htmlspecialchars($_SESSION['name']);
$content=(string) $_POST['content'];
// $link= (string)$_POST['link'];
if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}
$stmt = $mysqli->prepare("insert into comment ( user, comment, story_id) values (?, ?, ?)");
if(!$stmt){
	printf("Query Prep Failed: %s\n", $mysqli->error);
	exit;
}
// else{
//     printf("%s", $author);
//     printf("%s , %s, %s, %s", $title, $author, $content, $link);
//     exit;
// }

$stmt->bind_param('ssi', $author, $content, $story_id);

$stmt->execute();

$stmt->close();
header("Location: mainpage.php");
exit;
}


?>

</body>
</html>