
// var model = {
//     currentDay: strDate(new Date(Date.now())),
//     weatherTable: {},
//     currentUser: null
// };

//[hour]: temperature, weather, wind

var weatherApp = angular.module("weatherApp", []);
weatherApp.controller("centerController", function ($scope) {
    $scope.table = model.weatherTable;
    $scope.day = model.currentDay;   

    $scope.update = function(){
        $scope.table = model.weatherTable;
    }
});