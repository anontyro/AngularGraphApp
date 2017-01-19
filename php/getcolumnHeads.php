<?php

if(!isset($_GET['table'])){
	die("Error no table value given");
}
$columnQuery = "SELECT * FROM ".$_GET['table'].";";

include("DBConnect.php");

$columnResults = mysqli_query($connect, $columnQuery);

if(!$columnResults){
	die("Error no columns found");
}

$columnConvert = mysqli_fetch_assoc($columnResults);
$columnNames = array_keys($columnConvert);

print(json_encode($columnNames));
?>