<?php

if(!isset($_GET['table'])){
	die("Error no table value given");
}
if(!isset($_GET['value'])){
	$graphQuery = "select * from ".$_GET['table'].";";
	runGraph($graphQuery);
}else{
	$graphQuery = "select * from ".$_GET['table'].
			" where id = '".$_GET['value']."';";
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

			array('label' => $columnNames[1] , 'type' => 'string' ),
			array('label' => $columnNames[2] , 'type' => 'number' )
			);

		foreach ($graphResult as $key => $value) {
			$temp = array();

			$temp[] = array('v' => (string) $value[$columnNames[1]]);

			$temp[] = array('v' => (int) $value[$columnNames[2]]);
			$rows[] = array('c' => $temp);
		}

		$table['rows'] = $rows;

		
		print(json_encode($table));
		}
	mysqli_close($connect);
}



?>