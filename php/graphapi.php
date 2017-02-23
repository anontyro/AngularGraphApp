<?php

if(!isset($_GET['table'])){
	die("Error no table value given");
}
if(isset($_GET['headers'])){
	getHeaders();
}else if($_GET['table'] === 'forecast'){
	$graphQuery = 'SELECT a.locationname, b.forecasttotal FROM tradexc_locations a, tradexc_forecasts b WHERE a.locationidnum = b.locationidnum;';
	runGraph($graphQuery); 

}else{
	$graphQuery = "select ".$_GET['column1'].", ".$_GET['column2']." from ".$_GET['table'].";";
	runGraph($graphQuery);
}


function runGraph($graphQuery){
	include("DBConnect.php");
	$graphResult = mysqli_query($connect, $graphQuery);

	if(!$graphResult){
		print("{message: 'no row'}");
	}else{
		$rows = array();
		$table = array();
		$colConvert = mysqli_fetch_assoc($graphResult);
		$columnNames = array_keys($colConvert);
		$table['cols'] = array(

			array('label' => $columnNames[0] , 'type' => 'string' ),
			array('label' => $columnNames[1] , 'type' => 'number' )
			);

		foreach ($graphResult as $key => $value) {
			$temp = array();

			$temp[] = array('v' => (string) $value[$columnNames[0]]);

			$temp[] = array('v' => (int) $value[$columnNames[1]]);
			$rows[] = array('c' => $temp);
		}

		$table['rows'] = $rows;

		
		print(json_encode($table));
		}
	mysqli_close($connect);
}

function getHeaders(){
	$columnQuery = "SELECT * FROM ".$_GET['table'].";";

	include("DBConnect.php");

	$columnResults = mysqli_query($connect, $columnQuery);

	if(!$columnResults){
		die("Error no columns found");
	}

	$columnConvert = mysqli_fetch_assoc($columnResults);
	$columnNames = array_keys($columnConvert);

	print(json_encode($columnNames));
}


?>