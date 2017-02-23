<?php

$brandQuery = "SELECT itemidnum, brandidnum, itemcode, itemname FROM tradexc_items 
WHERE itemstatus = 'Active'; ";

include("DBConnect.php");

$brandResults = mysqli_query($connect, $brandQuery);

if(!$brandResults){
	die("Error no brands found, check database is connected");
}

while($row = mysqli_fetch_assoc($brandResults)){
	$output[] = $row;
}

print(json_encode($output));

mysqli_close($connect);

?>