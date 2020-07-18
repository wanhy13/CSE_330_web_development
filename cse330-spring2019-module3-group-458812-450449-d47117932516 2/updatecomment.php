<?php
session_start();
$id = $_POST['id'];

// echo $id;
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
    <form action="updatecomment.php" method="POST">
    
        <lable>Content: <input type="text" name="content"></lable>
        <input type="hidden" name="id" value=<?php echo $id ?>
        <br> 
        <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
        <input type="submit" value="update">
</form>
<br>
<form action="mainpage.php" method="POST">
    <input type="submit" value="Cancel">
</form>
	
		
 <?php 
 if(isset($_POST['content'])){

 
 $content =(string) $_POST['content']    ;

 //crfs
 if(!hash_equals($_SESSION['token'], $_POST['token'])){
	die("Request forgery detected");
}
 
$stmt = $mysqli->prepare("update comment set comment=? where id=? ");
		if(!$stmt){
			printf("Query Prep Failed: %s\n", $mysqli->error);
			exit;
		}
		$stmt->bind_param('si',$content, $id);
		$stmt->execute();
        $stmt->close();
        echo $id;
        header("Location: mainpage.php");
    }
?>
</body>
</html>	