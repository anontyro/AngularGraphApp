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
	
	$scope.graphData = graphDataService.getData;

	$scope.$watch('graphData', function(){
		graphDataService.getData = $scope.graphData;
	});

	$scope.queryBuilder = "?";

	//Table selection criteria

	$scope.tableSelection = ['','yearlysales','chartdemo'];

	$scope.tableSelectionList =
	{
		"type" : "select",
		"name" : "tableSelect",
		"value" : $scope.tableSelection[0],
		"values" : $scope.tableSelection
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
		$http.get('http://localhost/angulargraphapp/php/getcolumnHeads.php?table='+$table)
		.then(function(response){
			$scope.columnHeaderList = response.data;
		})
	}


	
	$scope.queryDatabase = function($query){ 
	$http.get('http://localhost/angulargraphapp/php/getgraph.php'+$query)
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



}]);