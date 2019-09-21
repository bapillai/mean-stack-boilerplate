'use strict';

app.controller('addLocationController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'locationDataService','$route', function($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, locationDataService,$route) {
    $scope.successMessage = "";
    $scope.formClear = function() {
        $scope.inputLocation = "";
    };

    $scope.saveDataLocation = function() {
        if ($scope.inputLocation != null && $scope.inputLocation != undefined) {
            var locationInfo = [{
                "locationName": $scope.inputLocation,
                "sections": "",
                "orders": {
                    orderId: "ajhsd79s8ad",
                    employeeId: 1234,
                    tableId: 809,
                    locationId: "amdshj999",
                    inventoryItems: [{
                        inventoryId: "89jk207",
                        inventoryName: "rose-flavour",
                        price: 200.00,
                        quantity: 1
                    }, {
                        inventoryId: "89jk208",
                        inventoryName: "rose-flavour",
                        price: 300.00,
                        quantity: 2
                    }]
                }
            }];
            locationDataService.addNewLocation(locationInfo).then(function(responseData) {
                $scope.formClear();
                $scope.successMessage = responseData.msg;
                $timeout(function() {
                    $scope.successMessage = "";
                    $rootScope.showLocationForm = false;
                    $route.reload();
                }, 3000);
            });
        }
    };
}]);