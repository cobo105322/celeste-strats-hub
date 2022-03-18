<?php

include_once('../config/config.php');
include_once('../utils/dbutils.php');

if(!isset($_GET["roomid"])){
    header("Status: 404 Not Found");
    header("HTTP/1.1 404 Not Found");
    die();
}

$room_id = $_GET["roomid"];

$conn = new mysqli($dbconfig["servername"], $dbconfig["user"], $dbconfig["password"]);

// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$conn->select_db($dbconfig["dbname"]);

$stmt = $conn->prepare("SELECT * from strat WHERE room_id = ?");
$stmt -> bind_param("s", $room_id);
$stmt->execute();
$result = $stmt->get_result(); // get the mysqli result
$strats = getArrayFromResult($result);
$responseArray = array();

foreach($strats as $currStrat){
  //We get the categories
  $currStrat["categories"] = array();
  $catresults = getArrayFromResult($conn->query("SELECT category.id,  category.label FROM category JOIN strat_category ON category.id = strat_category.idCategory WHERE idStrat = " . $currStrat["id"]));
  foreach($catresults as $category){
    array_push($currStrat["categories"], $category);
  }      

  //get the difficulties
  $currStrat["difficulties"] = array();
  $difresults = getArrayFromResult($conn->query("SELECT difficulty.id,  difficulty.label FROM difficulty JOIN strat_difficulty ON difficulty.id = strat_difficulty.idDifficulty WHERE idStrat = " . $currStrat["id"]));
  foreach($difresults as $difficulty){
    array_push($currStrat["difficulties"], $difficulty);
  }

  array_push($responseArray, $currStrat);

}

echo json_encode($responseArray);

?>