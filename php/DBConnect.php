<?php

$host = "alexwilkinson.co:3306";
$user = "alex";
$pass = 'hello123';
$database = "alexwilkinson";
$connect = mysqli_connect($host,$user,$pass,$database);

if(mysqli_connect_errno()){
	die("Error connecting to database: ".mysqli_connect_errno());
}




?>