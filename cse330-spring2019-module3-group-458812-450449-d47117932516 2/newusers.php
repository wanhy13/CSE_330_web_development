<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
    input[type=text], select {
        width: 30%;
        padding: 12px 20px;
        margin: 8px 0;
        display: inline-block;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
      }
    </style>
    <title>new user</title>
</head>
<body>
    <center>
        <h3>Register Now!</h3>
        <form action="angel.php" method="POST">
            <label>Username: <input type="text" name="name" /></label>
            <br>
            <form action="angel.php" method="POST">
            <lable>Password: <input type="text" name="password"></lable>
            <br>
            
            <lable>Comfirm Password:<input type="text" name="comfirmpassword"></lable>
            <br>
            <br>
            <br>
            <input type="submit" name="submitbutton" value="register" style="width: 15%">
        </form>
        
        <br>
        <br>
        <br>
        <a href="login.html"> Already have an account?</a>
        <br>
        <br>
        <br>
        <a href="mainpage.php"> Login as Guest</a>
        
    </center>
    
</body>
</html>