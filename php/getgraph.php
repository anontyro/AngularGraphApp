<?php
//check to see if the table has been set correctly if fails kill the page
if(!isset($_GET['table'])){
	die("Error no table value given");
}
//---------------------------------------FORECAST--------------------------------------------------
//Run basic query for forecast graph that checks for location 0 == ALL
if($_GET['table'] === 'forecast'){
	if($_GET['location'] === '0'){
			$graphQuery = 'SELECT a.locationname, b.forecasttotal FROM tradexc_locations a, tradexc_forecasts b WHERE a.locationidnum = b.locationidnum;';
	runGraph($graphQuery);
	}
	else{
		$graphQuery = 
			'SELECT a.locationname, b.forecasttotal, b.locationidnum FROM tradexc_locations a, tradexc_forecasts b WHERE a.locationidnum = b.locationidnum AND a.locationidnum ='
			.$_GET['location'];
		runGraph($graphQuery);
	}
//---------------------------------------SALES AGAINST FORECAST-------------------------------------
//Plot the sales against the forecast which uses three columns
}else if($_GET['table'] === 'salesVsForecast'){
	$graphQuery = 'SELECT Month, Sales, Forecast FROM tradexc_graphtest;';

	completeGraph($graphQuery, 3);
//---------------------------------------YEAR SALES FORECAST----------------------------------------
//Year Sales Forecast which takes in year (default current) and number of columns to itterate over
}else if($_GET['table'] === 'yearsalesforecast'){
	if(!isset($_GET['year'])){
		$year = date('Y');
	}else{
		$year = $_GET['year'];
	}

	$graphQuery = 'SELECT locationname, 
	Sum(If(Concat(Month(transdate),Year(transdate))=1'.$year.', creditamount, 0))  AS JanTotal,
	Sum(If(Concat(Month(transdate),Year(transdate))=2'.$year.', creditamount, 0))  AS FebTotal,
	Sum(If(Concat(Month(transdate),Year(transdate))=3'.$year.', creditamount, 0))  AS MarTotal,
	Sum(If(Concat(Month(transdate),Year(transdate))=4'.$year.', creditamount, 0))  AS AprTotal,
	Sum(If(Concat(Month(transdate),Year(transdate))=5'.$year.', creditamount, 0))  AS MayTotal,
	Sum(If(Concat(Month(transdate),Year(transdate))=6'.$year.', creditamount, 0))  AS JunTotal,
	Sum(If(Concat(Month(transdate),Year(transdate))=7'.$year.', creditamount, 0))  AS JulTotal,
	Sum(If(Concat(Month(transdate),Year(transdate))=8'.$year.', creditamount, 0))  AS AugTotal,
	Sum(If(Concat(Month(transdate),Year(transdate))=9'.$year.', creditamount, 0))  AS SepTotal,
	Sum(If(Concat(Month(transdate),Year(transdate))=10'.$year.', creditamount, 0))  AS OctTotal,
	Sum(If(Concat(Month(transdate),Year(transdate))=11'.$year.', creditamount, 0))  AS NovTotal,
	Sum(If(Concat(Month(transdate),Year(transdate))=12'.$year.', creditamount, 0))  AS DecTotal,
	transcurrency
	FROM (
	    	(tradexc_locations INNER JOIN 
	         (tradexc_trans INNER JOIN tradexc_items ON tradexc_trans.itemidnum = tradexc_items.itemidnum)
	         ON tradexc_locations.locationidnum = tradexc_trans.locationidnum
	    	)
	INNER JOIN tradexc_itemgroups ON tradexc_itemgroups.itemgroupidnum = tradexc_items.itemgroup) INNER JOIN tradexc_brands ON tradexc_brands.brandidnum = tradexc_items.brandidnum 
	WHERE transcurrency IS NOT NULL
	GROUP BY locationname, transcurrency  
	ORDER BY locationcode, transcurrency
	';


		if($_GET['months']==='0'){
			completeGraph($graphQuery,13);
		// print($graphQuery);
		}else{
			$totalMonths = $_GET['months'] + 1;
			completeGraph($graphQuery,$totalMonths);
		// print($graphQuery);
		
		}


//------------------------------------------SALES CHART BY ITEM---------------------------------
//
 
}else if($_GET['table'] === 'salebyitem'){
	if($_GET['item'] ==='0'){
		$graphQuery = "SELECT itemcode, sumtotal FROM(
			SELECT itemcode, Sum(creditamount) As sumtotal, Sum(transquantity) As sumquantity, transmeasure, transcurrency 
			FROM (tradexc_trans INNER JOIN tradexc_items ON tradexc_trans.itemidnum =tradexc_items.itemidnum) 
			WHERE `transcurrency` IS NOT NULL 
			GROUP BY itemnum, itemcode, transcurrency, transmeasure 
			)x
			WHERE x.sumtotal IS NOT NULL
			ORDER BY `sumtotal` DESC";

			// print($graphQuery);
		runGraph($graphQuery);
	}else{
		$graphQuery = " 
		Select locationcode,sumtotal AS '".$_GET['itemname']."'
			FROM(
				SELECT itemnum, itemcode, locationcode, locationname, Sum(creditamount) As sumtotal, Sum(transquantity) As sumquantity, transmeasure, transcurrency 
				FROM ((tradexc_trans INNER JOIN tradexc_items ON tradexc_trans.itemidnum = tradexc_items.itemidnum) 
							INNER JOIN tradexc_locations ON tradexc_trans.locationidnum = tradexc_locations.locationidnum) 
				WHERE tradexc_trans.itemidnum=".$_GET['item']." AND transcurrency IS NOT NULL
				GROUP BY itemnum, itemcode, locationcode, transcurrency, transmeasure 
				ORDER BY sumtotal DESC
			    )x
    	WHERE x.sumtotal IS NOT NULL ";
    	runGraph($graphQuery);
    	// print($_GET['itemname']); 
	}




//------------------------------------------BACKUP BASIC GRAPH DRAW---------------------------------
//A backup call just in case, this will print a basic graph just using two columns
}else{
	$graphQuery = "select ".$_GET['column1'].", ".$_GET['column2']." from ".$_GET['table'].";";
	runGraph($graphQuery);
}

//-------------------------------GRAPHING JSON FUNCTIONS ----------------------------

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

function completeGraph($graphQuery, $numberOfColumns){
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
			);

		for ($i=1; $i < $numberOfColumns; $i++) { 

			 array_push($table['cols'],array('label' => $columnNames[$i] , 'type' => 'number' ));
		}

		foreach ($graphResult as $key => $value) {
			$temp = array();
			$temp[] = array('v' => (string) $value[$columnNames[0]]);

			for ($i=1; $i <$numberOfColumns ; $i++) { 
			array_push($temp ,array('v' => (int) $value[$columnNames[$i]]));	
			}

			$rows[] = array('c' => $temp);
		}

		$table['rows'] = $rows;

		
		print(json_encode($table));
		}
	mysqli_close($connect);
}



// function runFullGraph($graphQuery, $numberOfColumns){
// 	include("DBConnect.php");
// 	$graphResult = mysqli_query($connect, $graphQuery);

// 	if(!$graphResult){
// 		print("{message: 'no row'}");
// 	}else{
// 		$rows = array();
// 		$table = array();
// 		$colConvert = mysqli_fetch_assoc($graphResult);
// 		$columnNames = array_keys($colConvert);
// 		$table['cols'] = array(

// 			array('label' => $columnNames[0] , 'type' => 'string' ),
// 			array('label' => $columnNames[1] , 'type' => 'number' ),
// 			array('label' => $columnNames[2] , 'type' => 'number' )
// 			);

// 		foreach ($graphResult as $key => $value) {
// 			$temp = array();

// 			$temp[] = array('v' => (string) $value[$columnNames[0]]);

// 			$temp[] = array('v' => (int) $value[$columnNames[1]]);
// 			$temp[] = array('v' => (int) $value[$columnNames[2]]);
// 			$rows[] = array('c' => $temp);
// 		}

// 		$table['rows'] = $rows;

		
// 		print(json_encode($table));
// 		}
// 	mysqli_close($connect);
// }

?>

