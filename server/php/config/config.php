<?php
$config = array(
    "env"=>"local"
);

if($config["env"]=="local"){
    //ALLOW CORS
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Credentials: true');
    header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
    header("Allow: GET, POST, OPTIONS, PUT, DELETE");
    $method = $_SERVER['REQUEST_METHOD'];
    if($method == "OPTIONS") {
        die();
    }


    $dbconfig = array(
        "servername"=>"",
        "user"=>"",
        "password"=>"",
        "dbname"=>""
    );
}else{
    $dbconfig = array(
        "servername"=>"",
        "user"=>"",
        "password"=>"",
        "dbname"=>""
    );
}




?>