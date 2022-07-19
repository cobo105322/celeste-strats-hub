<?php
session_start();

if($_SESSION["user"] && $_SESSION["user"]["id"] && $_SESSION["user"]["name"] && $_SESSION["user"]["email"]){
    die(json_encode($_SESSION["user"]));
}

http_response_code(403);

?>