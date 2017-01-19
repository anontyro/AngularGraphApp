var graphApp = angular.module('graphApp', ['googlechart', 'ui.bootstrap']);

graphApp.controller('mainController', ['$scope', function($scope){

//Title variables that are used to check if the Title is currently editable
  $scope.toggless = true;

  $scope.changeTog = function() {
    if ($scope.toggless == true) {
      $scope.toggless = false;
    } else{
      $scope.toggless = true;
    }

  };


var chart1 = {};
    chart1.type = "ColumnChart";
    chart1.cssStyle = "height:200px; width:300px;";

    chart1.data = {"cols": [
        {id: "month", label: "Month", type: "string"},
        {id: "laptop-id", label: "Laptop", type: "number"},

    ], "rows": [
        {c: [
            {v: "January"},
            {v: 19, f: "42 items"}
        ]},
        {c: [
            {v: "February"},
            {v: 10, f: "1 unit (Out of stock this month)"}

        ]},
        {c: [
            {v: "March"},
            {v: 24}
        ]}
    ]};

    chart1.options = {
        "title": "Sales over a month",
        "isStacked": "true",
        "fill": 20,
        "displayExactValues": true,
        "vAxis": {
            "title": "Sales unit", "gridlines": {"count": 6}
        },
        "hAxis": {
            "title": "Date"
        }
    };

    chart1.formatters = {};

    $scope.chart = chart1;

    $scope.chartTitle = $scope.chart.options.title;

    $scope.changeARow = $scope.chart.data.rows[0].c[1].v;

 //pull out the labels of the columns from the JSON
    $scope.chartCols = [];

    angular.forEach($scope.chart.data.cols, function(value, key){
        $scope.chartCols.push(value.label);
    });

    $scope.chartColumnList ={
        "type" : "select",
        "name" : "Columns",
        "value" : $scope.chartCols[1],
        "values" : $scope.chartCols,
    };


//
    $scope.getRowsFor = function (index) {
        
        $scope.currentRow =[];

        for (var i = 0; i < $scope.chart.data.rows.length; i++) {
            
        $scope.currentRow.push({"name" : $scope.chart.data.rows[i].c[0].v},
                {"value" : $scope.chart.data.rows[i].c[index].v });
        }

        return $scope.currentRow;
            
        };



    



//JSON Object that displays all the chart types for select box
    $scope.chartTypeList = 
    {"type" : "select",
     "name" : "Charts",
     "value" : $scope.chart.type,
     "values" : ['AreaChart','PieChart', 'ColumnChart', 'LineChart', 'Table', 'BarChart']
  };

// tab controls for the dynamic tabs
 $scope.tabs = [
    { title:'Dynamic Title 1', content:'Dynamic content 1' },
    { title:'JSON', content: $scope.chart.data, disabled: false }
  ];

   $scope.model = {
    name: 'Tabs'
  };

//


}]);