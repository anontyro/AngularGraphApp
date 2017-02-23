<?php

$host = "";
$user = '';
$pass = '';
$database = "";
$connect = mysqli_connect($host,$user,$pass,$database);

if(mysqli_connect_errno()){
	die("Error connecting to database: ".mysqli_connect_errno());
}




?>