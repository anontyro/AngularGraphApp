var graphApp = angular.module('graphApp', ['googlechart', 'ui.bootstrap', 'ngRoute']);

//CONFIG------------------------------- 
//files to set up routing for the pages (views)

graphApp.config(function($routeProvider) {
	//location and controller for the landing page
	$routeProvider
	.when('/', {
		templateUrl: '/js/graphApp/pages/main.html',
		controller: 'indexController'
	})
	//location and controller for the graph page
	.when('/graph',{
		templateUrl: '/js/graphApp/pages/graph.html',
		controller: 'graphController'
	})

});

//SERVICES----------------------------

//basic persistent service to move data between controllers, is used to move JSON data from PHP query to graph 
graphApp.service('graphDataService',  function(){
	
	this.getData = "data";
	this.getTitle = "title";
	this.getXAxis = "X-Axis";
	this.getYAxis = "Y-Axis";

});

//DIRECTIVES-------------------------

//CONTROLLERS------------------------

//main page CONTROLLER
graphApp.controller('indexController', ['$scope', '$http','$location', '$timeout' , 'graphDataService', function($scope, $http, $location , $timeout, graphDataService){
	
	//vars
	$scope.mainFooterShow = false; //hides the query builder footer when not needed

	$scope.whichTable = "";

	$scope.graphData = graphDataService.getData; //assign the service to a local variable to be used and watched
	//watch function which will check when the local vairable graphData is updated and push it to the service
	$scope.$watch('graphData', function(){
		graphDataService.getData = $scope.graphData;
	});
	//variable for the querybuilder that will be used to query the database with via the PHP interface
	$scope.queryBuilder = "?";

	//show values for verious elements on the page
	$scope.firstSelectorShow = true;
	$scope.brandShow = false;
	$scope.itemShow = false;
	$scope.locationShow = false;
	$scope.timeframeShow = false;



	
	//predefined list of queries to run, these call statements in the getgraph.php, these values are sent in the table variable via GET
	$scope.predefinedTableSelection = [
	{'tableTitle': '', 'tableCode': ''},
	{'tableTitle': 'All Forecast', 'tableCode':'forecast'},
	// {'tableTitle': 'All Sales Against Forecast', 'tableCode': 'salesVsForecast'},
	{'tableTitle': 'Yearly Sales Forecast', 'tableCode': 'yearsalesforecast'},
	{'tableTitle': 'Sales Chart By Item', 'tableCode': 'salebyitem'},
	];
	//JSON object to allow the building of the select box for the above values
	$scope.predefinedTableSelectionList =
	{
		"type" : "select",
		"name" : "predefinedTable",
		"value" : $scope.predefinedTableSelection[0],
		"values" : $scope.predefinedTableSelection
	};

	//function that sets the table value that has been selected in the select box
	$scope.selectTable = function($table){
		if($table === "forecast"){
			$scope.queryBuilder = $scope.queryBuilder + "table="+ $table +
			"&location=0";
			$scope.queryDatabase($scope.queryBuilder);
		}else if($table === "yearsalesforecast"){
			$scope.timeframeShow = true;
		}else if($table === "salebyitem"){
			$scope.itemShow = true;

		}
		$scope.queryBuilder = $scope.queryBuilder + "table="+ $table;
		$scope.whichTable = $table;

	}

	//Brand info -----------------------------------------------------------------
	$scope.brandList = [];

	$http({
		method: 'GET',
		url: '/js/graphapp/php/getBrands.php'
	}).then(function(response){
		$scope.brandList = response.data;
		$scope.brandList.unshift({"brandname":"All","brandidnum":"0"});
	});

	$scope.selectBrand = function($brand){
		$scope.queryBuilder = $scope.queryBuilder +"&brand=" + $brand;
	}

	//Items table info---------------------------------------------------------------
	//used in salesbyitem
	$scope.itemList = [];

	$http({
		method: 'GET',
		url: '/js/graphapp/php/getItems.php'
	}).then(function(response){
		$scope.itemList = response.data;
		$scope.itemList.unshift({"itemidnum":"0", "brandidnum":"0","itemname":"All"});
	});

	$scope.selectItem = function($item, $itemName){
		$scope.queryBuilder = $scope.queryBuilder + "&item=" + $item + "&itemname="+$itemName;
	}

	//Location info -------------------------------------------------------------
	//
	$scope.locationList = [];

	$http({
		method: 'GET',
		url: '/js/graphapp/php/getLocations.php'
	}).then(function(response){
		$scope.locationList = response.data;
		$scope.locationList.unshift({"locationname":"All","locationidnum":"0"});
	});

	$scope.selectLocation = function($location){
		$scope.queryBuilder = $scope.queryBuilder + "&location="+$location;
	}

	//Timeframe controls --------------------------------------------------
	$scope.timeframeSelection = [
		{"month":"All", "monthid": "0"},
		{"month":"January", "monthid": "1"},
		{"month":"February", "monthid": "2"},
		{"month":"March", "monthid": "3"},
		{"month":"April", "monthid": "4"},
		{"month":"May", "monthid": "5"},
		{"month":"June", "monthid": "6"},
		{"month":"July", "monthid": "7"},
		{"month":"August", "monthid": "8"},
		{"month":"September", "monthid": "9"},
		{"month":"October", "monthid": "10"},
		{"month":"November", "monthid": "11"},
		{"month":"December", "monthid": "12"}
		
		];

	$scope.selectTimeframe = function($month){
			$scope.queryBuilder = $scope.queryBuilder + "&months="+$month;
	}

	//show variable for the column header list, initally hidden
	$scope.showColumnHeadList = false;

	//inital array that will be built for the column headers when the php script is exectued (getcolumnHeads.php)
	$scope.columnHeaderList = [];

	//function to add the column to the query chain, using the format: &columnX=colName used for custom charts when adding selected columns
	$scope.columnBuilder = function($column, $numColumn){
		$scope.queryBuilder = $scope.queryBuilder + "&column"+ $numColumn +"=" + $column;
	}

	//function that will call the getcolumnHeads.php file to pull the tables column headers and add to the variable columnHeaderList
	$scope.getColumnHeaders = function($table){
		$http.get('/js/graphapp/php/getcolumnHeads.php?table='+$table)
		.then(function(response){
			$scope.columnHeaderList = response.data;
		})
	}

	//function to call the getgraph.php which will query the database according to the query selected/ created
	//once the data is returned it will be added to the service graphData and load the graph.html page to display the graph	
	$scope.queryDatabase = function($query){ 
	$http.get('/js/graphapp/php/getgraph.php'+$query)
	.then(function(response){

		$scope.graphData = response.data;
		if($scope.whichTable === 'forecast'){
			graphDataService.getTitle = 'Sales Forcast';
			graphDataService.getXAxis = 'Location';
			graphDataService.getYAxis = 'Total Estimated Sales';
		}else if($scope.whichTable === 'yearsalesforecast'){
			graphDataService.getTitle = 'Yearly Sales Forecast';
			graphDataService.getXAxis ='Location';
			graphDataService.getYAxis = 'Total Sales';
		}else if($scope.whichTable === 'salebyitem'){
			graphDataService.getTitle = 'Sale Chart By Item';
			graphDataService.getXAxis ='Location';
			graphDataService.getYAxis = 'Total Sales';
		}

		$location.path('/graph');
		
	});
	}

}]);


//graph page CONTROLLER
graphApp.controller('graphController', ['$scope', '$location', 'graphDataService', function($scope, $location, graphDataService){
	//calling the service and assigning it locally to be used for the graph
	$scope.graphData = graphDataService.getData;
	//function to allow the user to return back to the main selection page
	$scope.backToMain = function(){
		$location.path('/');
	};

//building of the chart in a basic javascript JSON object, saved locally whilst being built
var chart1 = {};
    chart1.type = "BarChart"; //chart type to display
    chart1.data = $scope.graphData; //assigning the data from the service
    //options hold a lot of basic setting which can be changed later
    chart1.options = {
    	title : graphDataService.getTitle,
        displayExactValues: true,
        width: 1600,
        height: 900,
        is3D: true,
        legend: "show",
        vAxis: {"title": graphDataService.getXAxis},
        hAxis: {"title": graphDataService.getYAxis}
        //depreciated element
        // chartArea: {left:130,top:50,bottom:130,height:"100%"}
    };
    //basic formatter call, currently just dealing with one column
    chart1.formatters = {
      number : [{
        columnNum: 1,
        pattern: "MMK #,##0.00"
      }]
    };

    $scope.chart = chart1; //creating the chart object in the $scope

    //assigning the X axis size to a variable to be monitored via watch, this will allow the user to alter
    //the size of the graphs X-axis
    $scope.xSize = $scope.chart.options.width;

    $scope.$watch('xSize', function(){
    	$scope.chart.options.width = $scope.xSize;
    });

    //assigning the Y axis size to a variable to be monitored via watch, this will allow the user to alter
    //the size of the graphs Y-axis
    $scope.ySize = $scope.chart.options.height;

        $scope.$watch('ySize', function(){
    	$scope.chart.options.height = $scope.ySize;
    });

     //JSON Object that displays all the chart data in the JSON format with a simple function
     //to hide and show the box
     //potential use to allow saving alterations to be easily called

     $scope.showJsonExport = false;

     $scope.changeJsonShowExport = function(){
     	if ($scope.showJsonExport) {
     		$scope.showJsonExport = false;
     	}else{$scope.showJsonExport = true;}
     }
     
     //logic behind how the user is able to change the chart display type
     //the chart.type is $watch and once a new select option is selected it will update the
     //graph to a new view
     $scope.graphTypeSelection = $scope.chart.type;

     $scope.$watch('graphTypeSelection', function() {
     	$scope.chart.type = $scope.graphTypeSelection;
     });
     
    $scope.graphTypeSelectionList = 
    {"type" : "select",
     "name" : "Charts",
     "value" : $scope.chart.type,
     "values" : ['AreaChart','PieChart', 'ColumnChart', 'LineChart', 'Table', 'BarChart']
  };

  //Printable area function that will build a new page to print the graph with all the user tweaks
	  $scope.printDiv = function() {
		  var printContents = document.getElementById('printableArea').innerHTML;
		  var popupWin = window.open('', '_blank', 'width=1300,height=900');
		  popupWin.document.open();
		  popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
		  popupWin.document.close();
	}

	//logic on how to change the display of the chart legend, initally it is visable but can be hidden when needed, especially for simple graphs 
	$scope.showLegend = "true";

	$scope.$watch('showLegend', function(){
		if($scope.showLegend === "true"){
			$scope.chart.options.legend = "show";
		}else{
			$scope.chart.options.legend = "none";
		}
	});



}]);