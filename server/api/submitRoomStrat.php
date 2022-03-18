<?php

include_once('../config/config.php');
include_once('../utils/dbutils.php');

//Check if user is logged in
//TODO

if(!isset($_POST["categories"]) || !isset($_POST["difficulties"]) || !isset($_POST["summary"]) || !isset($_POST["description"]) || !isset($_POST["gif"])
    || !isset($_POST["room_id"])  || !isset($_POST["entry_id"])  || !isset($_POST["exit_id"]))
{
    header("Status: 404 Not Found");
    header("HTTP/1.1 404 Not Found");
    die();
}

$categories = json_decode($_POST["categories"]);
$difficulties = json_decode($_POST["difficulties"]);
if(!is_array($categories) || !is_array($difficulties)){
    header("Status: 404 Not Found");
    header("HTTP/1.1 404 Not Found");
    die();
}

$conn = new mysqli($dbconfig["servername"], $dbconfig["user"], $dbconfig["password"]);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$conn->select_db($dbconfig["dbname"]);

$stmt = $conn->prepare("INSERT INTO strat (summary, description, gif, room_id, entry_id, exit_id) VALUES (?, ?, ?, ?, ?, ?)");
$stmt -> bind_param("ssssss", $_POST["summary"], $_POST["description"], $_POST["gif"], $_POST["room_id"], $_POST["entry_id"], $_POST["exit_id"]);
$stmt->execute();

$id = $conn->insert_id;

if(!$id || $id==0){
    header("Status: 500 Server Error");
    header("HTTP/1.1 500 Server Error");
    die();
}


foreach($categories as $idCategory){
    $stmt = $conn->prepare("INSERT INTO strat_category (idStrat, idCategory) VALUES (?, ?)");
    $stmt -> bind_param("ii", $id, $idCategory);
    $stmt -> execute();
}

foreach($difficulties as $idDifficulty){
    $stmt = $conn->prepare("INSERT INTO strat_difficulty (idStrat, idDifficulty) VALUES (?, ?)");
    $stmt -> bind_param("ii", $id, $idDifficulty);
    $stmt -> execute();
}

$conn->close();

echo $id;

?>