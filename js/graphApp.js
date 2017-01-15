var graphApp = angular.module('graphApp', ['googlechart', 'ui.bootstrap']);

graphApp.controller('mainController', ['$scope', function($scope){

//Title variables that are used to check if the Title is currently editable
  $scope.toggless = true;

  $scope.changeTog = function function_name() {
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
        {id: "desktop-id", label: "Desktop", type: "number"},
        {id: "server-id", label: "Server", type: "number"},
        {id: "cost-id", label: "Shipping", type: "number"}
    ], "rows": [
        {c: [
            {v: "January"},
            {v: 19, f: "42 items"},
            {v: 12, f: "Ony 12 items"},
            {v: 7, f: "7 servers"},
            {v: 4}

        ]},
        {c: [
            {v: "February"},
            {v: 13},
            {v: 1, f: "1 unit (Out of stock this month)"},
            {v: 12},
            {v: 2}
        ]},
        {c: [
            {v: "March"},
            {v: 24},
            {v: 0},
            {v: 11},
            {v: 6}

        ]}
    ]};

    chart1.options = {
        "title": "Sales per month",
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


}]);