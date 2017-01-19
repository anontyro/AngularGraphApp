var homeApp = angular.module('homeApp', ['googlechart', 'ui.bootstrap', 'ui.router']);

homeApp.config(function($stateProvider) {
	var helloState ={
		name: 'hello',
		url: '/hello',
		template: '<h3>hello world</h3>'
	}

	var aboutState={
		name: 'about',
		url: '/about',
		template: '<h3>about page</h3>'
	}

	$stateProvider.state(helloState);
	$stateProvider.state(aboutState);

})



homeApp.controller('mainController', ['$scope', '$http', function($scope, $http){



	//creates a sql query to use to find thecorrect data
	$scope.queryBuilder = "?";

	//table select controls

	$scope.isTableSelectDisabled = false;

	$scope.tableSelection = ['','yearlysales','chartdemo'];

	$scope.tableSelectionList =
	{
		"type" : "select",
		"name" : "tableSelect",
		"value" : $scope.tableSelection[0],
		"values" : $scope.tableSelection
	};

	//get column values

	$scope.columnHeaderList = [];

	$scope.getColumnHeaders = function($table){
		$http.get('http://localhost/graphapp/php/getcolumnHeads.php?table='+$table)
		.then(function(response){
			$scope.columnHeaderList = response.data;
		})
	}

	$scope.queryDatabase = function($query){ 
	$http.get('http://localhost/graphapp/php/getgraph.php'+$query)
	.then(function(response){

		$scope.returnedData = response.data;
	});
	}



	//Chart build controllers
	$scope.chartButtonVisable = false;
	$scope.isChartReady = false;
	$scope.returnedData = {"cols":[{"label":2016,"type":"string"},{"label":"old","type":"number"}],"rows":[{"c":[{"v":"jan"},{"v":0}]},{"c":[{"v":"feb"},{"v":0}]},{"c":[{"v":"march"},{"v":0}]},{"c":[{"v":"april"},{"v":0}]},{"c":[{"v":"may"},{"v":0}]}]};;



$scope.buildChart = function(){
var chart1 = {};
    chart1.type = "BarChart";
    chart1.data = $scope.returnedData;
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

}

}]);

