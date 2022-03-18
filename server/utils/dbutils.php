<?php

function getArrayFromResult($result){
    $resultArray = array();
    if ($result->num_rows > 0) {        
        while($row = $result->fetch_assoc()) {
            array_push($resultArray, $row);
        }
    }
    return $resultArray;
}

?>