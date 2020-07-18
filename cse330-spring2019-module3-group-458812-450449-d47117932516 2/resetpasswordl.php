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
    <form action="resetpassword.php" method="POST">
    <lable>Username: <input type="text" name="username"></lable>
        <br> 
        <lable>Old Password: <input type="text" name="oldpass"></lable>
        <br> 
        <lable>New Password: <input type="text" name="newpass"></lable>
        <br> 
        <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
        <lable>Comfirm New Password: <input type="text" name="cnewpass"></lable>
        <br>
        <input type="submit" value="change">
</form>
<br>
<form action="mainpage.php" method="POST">
    <input type="submit" value="Cancel">
</form>
</body>
</html>