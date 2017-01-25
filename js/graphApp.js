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
graphApp.controller('indexController', ['$scope', 'graphDataService', function($scope, graphDataService){
	
	$scope.graphData = graphDataService.getData;

}]);


//graph page controller
graphApp.controller('graphController', ['$scope', 'graphDataService', function($scope, graphDataService){
	
}]);