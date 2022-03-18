<?php
$config = array(
    "env"=>"local"
);

if($config["env"]=="local"){
    $dbconfig = array(
        "servername"=>"localhost",
        "user"=>"root",
        "password"=>"",
        "dbname"=>"strathubdb"
    );
}else{
    $dbconfig = array(
        "servername"=>"localhost",
        "user"=>"str_user",
        "password"=>"jamonete123",
        "dbname"=>"strathubdb"
    );
}




?>