var graphApp = angular.module('graphApp', ['googlechart', 'ui.bootstrap', 'ngRoute']);

//application config files to set up routing

graphApp.config(function($routeProvider) {
	
	$routeProvider
	.when('/', {
		templateUrl: 'pages/main.html',
		controller: 'indexController'
	})

	.when('/graph',{
		templateUrl: 'pages/graph.html',
		controller: 'graphController'
	})

});

//SERVICES

graphApp.service('graphDataService',  function(){
	
	this.getData = "data";

});

//CONTROLLERS

//main page controller
graphApp.controller('indexController', ['$scope', '$http','$location' , 'graphDataService', function($scope, $http, $location ,graphDataService){
	
	$scope.mainFooterShow = false;

	$scope.graphData = graphDataService.getData;

	$scope.$watch('graphData', function(){
		graphDataService.getData = $scope.graphData;
	});

	$scope.queryBuilder = "?";

	//show values
	$scope.firstSelectorShow = true;
	$scope.predefinedGraphShow = false;
	$scope.customGraphShow = false;
	$scope.customGraphTableShow = false;
	$scope.customerGraphColumnOneShow = false;
	$scope.customerGraphColumnTwoShow = false;

	//Custom Table selection criteria

	$scope.tableSelection = ['','yearlysales','monthlysales'];

	$scope.tableSelectionList =
	{
		"type" : "select",
		"name" : "tableSelect",
		"value" : $scope.tableSelection[0],
		"values" : $scope.tableSelection
	};

	//predefined list of queries to run
	$scope.predefinedTableSelection = ['','forecast'];

	$scope.predefinedTableSelectionList =
	{
		"type" : "select",
		"name" : "predefinedTable",
		"value" : $scope.predefinedTableSelection[0],
		"values" : $scope.predefinedTableSelection
	};

	$scope.selectTable = function($table){
		$scope.queryBuilder = $scope.queryBuilder + "table="+ $table;

	}

	//get column values

	$scope.showColumnHeadList = false;

	$scope.columnHeaderList = [];

	$scope.columnBuilder = function($column, $numColumn){
		$scope.queryBuilder = $scope.queryBuilder + "&column"+ $numColumn +"=" + $column;
	}


	$scope.getColumnHeaders = function($table){
		$http.get('http://localhost/graphapp/php/getcolumnHeads.php?table='+$table)
		.then(function(response){
			$scope.columnHeaderList = response.data;
		})
	}


	
	$scope.queryDatabase = function($query){ 
	$http.get('http://localhost/graphapp/php/getgraph.php'+$query)
	.then(function(response){

		$scope.graphData = response.data;
		$location.path('/graph');
		
	});
	}


}]);


//graph page controller
graphApp.controller('graphController', ['$scope', '$location', 'graphDataService', function($scope, $location, graphDataService){
	
	$scope.graphData = graphDataService.getData;

	$scope.backToMain = function(){
		$location.path('/');
	};


var chart1 = {};
    chart1.type = "BarChart";
    chart1.data = $scope.graphData;
    chart1.options = {
    	title : "Title",
        displayExactValues: true,
        width: 700,
        height: 500,
        is3D: true,
        chartArea: {left:50,top:50,bottom:50,height:"100%"}
    };

    chart1.formatters = {
      number : [{
        columnNum: 1,
        pattern: "$ #,##0.00"
      }]
    };

    $scope.chart = chart1;

    $scope.xSize = $scope.chart.options.width;

    $scope.$watch('xSize', function(){
    	$scope.chart.options.width = $scope.xSize;
    });

    $scope.ySize = $scope.chart.options.height;

        $scope.$watch('ySize', function(){
    	$scope.chart.options.height = $scope.ySize;
    });

     //JSON Object that displays all the chart types for select box

     $scope.showJsonExport = false;

     $scope.changeJsonShowExport = function(){
     	if ($scope.showJsonExport) {
     		$scope.showJsonExport = false;
     	}else{$scope.showJsonExport = true;}
     }
     
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

  //Printable area
  $scope.printDiv = function() {
  var printContents = document.getElementById('printableArea').innerHTML;
  var popupWin = window.open('', '_blank', 'width=1000,height=800');
  popupWin.document.open();
  popupWin.document.write('<html><head><link rel="stylesheet" type="text/css" href="style.css" /></head><body onload="window.print()">' + printContents + '</body></html>');
  popupWin.document.close();
}



}]);