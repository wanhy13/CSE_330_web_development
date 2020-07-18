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
    <title>view</title>
</head>
<body>
    
    <?php
    $storyid=$_POST['story_id'];
    //echo $_POST['story_id'];
    $username=$_POST['author'];

    $stmt = $mysqli->prepare("select title, id, content, link ,time from story where id=?");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    $stmt->bind_param('i' ,$storyid);
    $stmt->execute();
    $stmt->bind_result($title, $id, $content, $link, $time);
    //echo $_SESSION['name'];
    
    // delete and update button
    while($stmt->fetch()){
        if(isset($_SESSION['name'])|| !empty($_SESSION['name'])){

        if($username==$_SESSION['name']){
            ?>
            <form action="deletestory.php" method="POST">
            <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
            <input type="hidden" name="storyid" value=<?php echo $storyid ?>>    
            <input type="submit" value="delete">
        </form>
        <form action ="updatestory.php" method="POST">
        <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
            <input type="hidden" name="storyid" value=<?php echo $storyid ?>> 
            <input type="submit" value="update">
        </form>
            <?php
        }
    }
        ?>
        <h1><?php echo $title ?> </h1>
        <br>
        <h>author: <?php echo $username ?>  time: <?php  echo $time ?></h>
        <a href=<?php $link ?> >references link <a>
        <p>
            <?php echo $content ?>
    </p>
    <br>
    <br>
    <br> 
      comments:
        <?php
    }
    // echo $_SESSION['name'];
    // if (isset($_SESSION['name'])) echo "isset";
    // if (!empty($_SESSION['name'])) echo "empty";
    
    $stmt->close();
    if(isset($_SESSION['name'])&&!empty($_SESSION['name'])){
        // echo "i am in"
        ?>
        
        <form action ="addcomment.php" method="POST">
        <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
            <input type="hidden" name="storyid" value=<?php echo $storyid ?>> 
            <input type="submit" value="add comment">
        </form>
        
        <?php
    }

    $stmt = $mysqli->prepare("select id, comment, user, story_id from comment where story_id=? order by time ");
    if(!$stmt){
        printf("Query Prep Failed: %s\n", $mysqli->error);
        exit;
    }
    
    $stmt->bind_param('i', $storyid);
    $stmt->execute();
    $stmt->bind_result($id, $comment, $user, $story_id);
    while($stmt->fetch()){
        
        
        printf(
            
          "
            <p>%s</p>
            <p> posted by: %s <p> 
            <br>
            <br>
            <br>
           
            ",
            htmlspecialchars($comment),
            
            htmlspecialchars($user)
                       
        );
        //member can only delete the comment they create
        if(isset($_SESSION['name'])||!empty($_SESSION['name'])){

        if($user==$_SESSION['name']){
            ?>
            <form action ="deletecomment.php" method="POST">
                <input type="hidden" name = "id" value=<?php echo $id ?>>
                <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
            <input type="submit" value="delete comment">
        </form>
        <form action ="updatecomment.php" method="POST">
        <input type="hidden" name = "id" value=<?php echo $id ?>>
        <input type="hidden" name="token" value="<?php echo $_SESSION['token'];?>" />
        <input type="submit" value="update comment">
    </form>
<?php        
}}
        }
        
        $stmt->close();
    ?>
</body>
</html>