<?php

$host = "127.0.0.1:3306";
$user = "root";
$pass = "root";
$database = "graphdb";
$connect = mysqli_connect($host,$user,$pass,$database);

if(mysqli_connect_errno()){
	die("Error connecting to database: ".mysqli_connect_errno());
}




?>