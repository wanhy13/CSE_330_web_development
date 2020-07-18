<?php
session_start();
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
    <form action="uploadstory.php" method="POST">
    <lable>Title: <input type="text" name="title"></lable>
        <br> 
        <lable>Content: <input type="text" name="content"></lable>
        <br> 
        <lable>Reference link: <input type="text" name="link"></lable>
        <br> 
        <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
        <input type="submit" value="upload">
</form>
<br>
<form action="mainpage.php" method="POST">
    <input type="submit" value="Cancel">
</form>
</body>
</html>