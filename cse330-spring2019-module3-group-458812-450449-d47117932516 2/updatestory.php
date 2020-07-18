<?php
$id = $_POST['storyid'];
session_start();
//echo $id;
require 'database.php';
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
    <form action="updatestory.php" method="POST">
    <lable>Title: <input type="text" name="title"></lable>
        <br> 
        <lable>Content: <input type="text" name="content"></lable>
        <input type="hidden" name="storyid" value=<?php echo $id ?>>
        <br> 
        <lable>Reference link: <input type="text" name="link"></lable>
        <br> 
        <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
        <input type="submit" value="update">
</form>
<br>
<form action="mainpage.php" method="POST">
    <input type="submit" value="Cancel">
</form>
	
		
 <?php 
 if(isset($_POST['title'])){
 $title =(string) $_POST['title'];
 $link =  (string)$_POST['link'];
 $content =(string) $_POST['content']    ;
 
 //crsf
 if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}

//  echo $_POST['content'];
$stmt = $mysqli->prepare("update story set title=?,content=?,link=? where id=? ");
		if(!$stmt){
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit;
        }
        // echo $title;
        // echo $link;
        // echo $content;
         echo $id;
		$stmt->bind_param('sssi',$title,$content,$link,$id);
		$stmt->execute();
        $stmt->close();
        header("Location: mainpage.php");
    }
?>
</body>
</html>	