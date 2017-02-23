<?php

$locationQuery = "SELECT locationname, locationidnum, locationcode FROM tradexc_locations WHERE locationstatus='Active';" ;

include("DBConnect.php");

$locationResults = mysqli_query($connect, $locationQuery);

if(!$locationResults){
	die("{msg : Could not find any results, make sure the database is connected and try again}");
}
while($row = mysqli_fetch_assoc($locationResults)){
	$output[]=  $row;
}

print(json_encode($output));

mysqli_close($connect);

?>