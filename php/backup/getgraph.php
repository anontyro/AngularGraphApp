<?php

if(!isset($_GET['table'])){
	die("Error no table value given");
}

	$graphQuery = "select month , totalsales from ".$_GET['table'].";";
	runGraph($graphQuery);



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



?>