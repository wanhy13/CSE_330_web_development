<?php
    
    // login_ajax.php
    ini_set("session.cookie_httponly",1);
    session_start();
    require 'database.php';
    
    header("Content-Type: application/json"); // Since we are sending a JSON response here (not an HTML document), set the MIME Type to application/json
    
    //Because you are posting the data via fetch(), php has to retrieve it elsewhere.
    $json_str = file_get_contents('php://input');
    //This will store the data into an associative array
    $json_obj = json_decode($json_str, true);
    
    $user1 = $_SESSION['id'];
    $user2 = $json_obj['id'];

    $stmt = $mysqli->prepare("select description, time, tag, year,month,day from event where userid=? ");
    if(!$stmt){
        echo json_encode(array(
            "success" => false,
            "message" => "failed"
        ));
    }
    $stmt->bind_param('i',$user2);
    $stmt->execute();
    $stmt->bind_result($desc,$t,$tag,$y,$m,$d);
    $events = array();
    $i=0;
    while($stmt->fetch()){
           
            $events[$i]['desc']=htmlentities($desc);
            $events[$i]['t']=htmlentities($t);
            $events[$i]['tag']=htmlentities($tag);
            $events[$i]['y']=htmlentities($y);
            $events[$i]['m']=htmlentities($m);
            $events[$i]['d']=htmlentities($d);
            $i++;
        }
        $stmt->close();
        echo json_encode(array(
            "events" => $events,
            "success"=>true
            ));
            exit;


?>