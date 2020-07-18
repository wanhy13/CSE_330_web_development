<?php
 session_start();
 require 'database.php';
 ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
    h2{
        text-shadow: 1px 1px grey;
        font-size：50px;
    }
    </style>
    <title>mainpage</title>
</head>
<body>
    <?php
    //calling the database
   
  
    //check the user 
   

    

    if(!isset($_SESSION['name'])|| empty($_SESSION['name'])){
        
       

        ?>
        <h2> Welcome to Daily News</h>
        <form action = 'login.html' name="login">
        <input type="submit" value="Login" >
    </form>
    <form  action = 'newusers.php' name="register">
        <input type="submit" value="Regiser Now!">
    </form>

    <?php
    }else{
        ?>
        <center>
        <h2> Welcome to Daily News</h>
        <br>
        <h> Hello <?php echo $_SESSION['name']?></h>
    </center>
        <form action = 'logout.php' name="logout">
        <input type="submit" value="Logout"  float:"right">
    </form>
    <form  action = 'uploadstoryl.php' name="uploadstory">
    <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
        <input type="submit" value="Upload" >
    </form>
    <form action = 'resetpasswordl.php' name="reset">
        <input type="submit" value="reset password" >
    </form>
    <br>
    <br>
    <br>
        <?php
    }
    $stmt = $mysqli->prepare("select id, title, user, content, link from story order by time");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }

    $var=$_SESSION['token'];
    $stmt->execute();
    $stmt->bind_result($id, $title, $user, $content, $link);
    while($stmt->fetch()){
        
        printf(
            
          "<a href='%s' style='font-size: 40px'>%s</a>
            <p>%s
                <br>
                %s
            </p> 
            <form action='view.php' method='POST'>
            <input type='hidden' name='author' value='%s'>
            <input type='hidden' name='story_id' value='%s'>
            <input type='submit' value='detials' style='float:right;width:100px; height:15px;'>
            </form>
            <br>
            <br>
            <br>",
            htmlspecialchars($link),
            htmlspecialchars($title),
            htmlspecialchars($user),
            htmlspecialchars($content),
            htmlspecialchars($user),
            htmlspecialchars($id),
            htmlspecialchars($id)
        );
        }
        $stmt->close();

    
?>

    
</body>
</html>