<?php

include_once('../config/config.php');
include_once('../utils/dbutils.php');

if(!isset($_POST["name"]) || !isset($_POST["password"]) || !isset($_POST["email"]) || !filter_var($_POST["email"], FILTER_VALIDATE_EMAIL)){
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

$stmt = $conn->prepare("INSERT INTO user (name, password, email) VALUES (?, ?, ?)");
$stmt -> bind_param("sss", $_POST["name"], $password, $_POST["email"]);
$stmt->execute();

echo $conn->insert_id;

?>
