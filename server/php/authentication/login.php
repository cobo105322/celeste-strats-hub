<?php

include_once('../config/config.php');
include_once('../utils/dbutils.php');

session_start();

if(!isset($_POST["name"]) || !isset($_POST["password"])){
    header("Status: 404 Wrong Parameters");
    header("HTTP/1.1 404 Wrong Parameters");
    die();
}

$conn = new mysqli($dbconfig["servername"], $dbconfig["user"], $dbconfig["password"]);
if ($conn->connect_error) {
die("Connection failed: " . $conn->connect_error);
}

$conn->select_db($dbconfig["dbname"]);


//Hash the password with sha2
$password = hash("sha256", $_POST["password"]);

$stmt = $conn->prepare("SELECT id, name, email FROM user WHERE name = ? AND password = ?");
if($stmt){
    $stmt -> bind_param("ss", $_POST["name"], $password);
    $stmt->execute();
}
$resultado = getArrayFromResult($stmt->get_result());
if(sizeof($resultado)>0){ //Login succesful
    $user = array(
        "id"=>$resultado[0]["id"],
        "name"=>$resultado[0]["name"],
        "email"=>$resultado[0]["email"]
    );
    $_SESSION["user"] = $user;
    die(json_encode($user));
}else{
    http_response_code(403);
    die();
}

?>