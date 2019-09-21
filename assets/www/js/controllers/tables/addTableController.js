'use strict';

app.controller('addTableController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'sectionDataService', 'locationDataService', 'tableDataService','$route', function($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, sectionDataService, locationDataService, tableDataService, $route) {
    $scope.successMessageTable = "";
    $scope.locationListForSection = [];
    $scope.sectionListForTable = [];
    $scope.tableList = [];
    $scope.selectedSection = "";
    $scope.selectedLocationIdTab = "";
    $scope.selectedLocationNameTab = "";
    $scope.selectedSectionIdTab = "";
    $scope.selectedSectionNameTab = "";

    $scope.formClear = function() {
        $scope.selectedTable = "";
        $scope.inputLocation = "";
        $scope.inputSection = "";
    };
    $scope.getLocationSelected = function(location) {
        if ($scope.inputLocation != null && $scope.inputLocation != undefined && $scope.inputLocation != "") {
            var locationIdSelected = $scope.inputLocation;
            var locationSelected = $.grep($scope.locationListForSection, function(location) {
                return location.locationId == locationIdSelected;
            });
            $scope.selectedLocationIdTab = locationSelected[0].locationId;
            $scope.selectedLocationNameTab = locationSelected[0].locationName;
        }
    };
    $scope.getSectionSelected = function(section) {
        if ($scope.inputSection != null && $scope.inputSection != undefined && $scope.inputSection != "") {
            var sectionIdSelected = $scope.inputSection;
            var sectionSelected = $.grep($scope.sectionListForTable, function(section) {
                return section.sectionId == sectionIdSelected;
            });
            $scope.selectedSectionIdTab = sectionSelected[0].sectionId;
            $scope.selectedSectionNameTab = sectionSelected[0].sectionName;
        }
    };
    $scope.saveTableForm = function() {
        if ($scope.selectedLocationIdTab != null && $scope.selectedLocationIdTab != undefined && $scope.selectedLocationNameTab != null && $scope.selectedLocationNameTab != undefined && $scope.selectedSectionIdTab != null && $scope.selectedSectionIdTab !=undefined && $scope.selectedSectionIdTab !=null && $scope.selectedSectionIdTab != undefined && $scope.selectedSectionNameTab !=null && $scope.selectedSectionNameTab !=undefined) {
            var tableInfo = [{
                "locationId": $scope.selectedLocationIdTab,
                "locationName": $scope.selectedLocationNameTab,
                "sectionId": $scope.selectedSectionIdTab,
                "sectionName": $scope.selectedSectionNameTab,
                "tables": [{
                    tableName: $scope.selectedTable
                }]
            }];
            tableDataService.addNewTable(tableInfo).then(function(responseData) {
                $scope.formClear();
                $scope.successMessageTable = responseData.msg;
                $timeout(function() {
                    $scope.successMessageTable = "";
                    $rootScope.showTableForm = false;
                    $route.reload();
                }, 3000);
            });
        }
    };
    $scope.getLocationList = function() {
        locationDataService.getAllLocation($rootScope.token).then(function(responseData) {
            for (var i = 0; i < responseData.location.length; i++) {
                $scope.locationListForSection.push({
                    locationName: responseData.location[i].locationName,
                    locationId: responseData.location[i].locationId
                });
            }
        });
    };
    $scope.getSectionList = function() {
        sectionDataService.getAllSection($rootScope.token).then(function(responseData) {
            for (var i = 0; i < responseData.section.length; i++) {
                $scope.sectionListForTable.push({
                    sectionName: responseData.section[i].sectionName,
                    sectionId: responseData.section[i].sectionId
                });
            }
        });
    };
    $scope.getTableList = function() {
        tableDataService.getAllTable($rootScope.token).then(function(responseData) {
            for (var i = 0; i < responseData.table.length; i++) {
                $scope.tableList.push(responseData.table[i].tables[i].tableName);
            }
        });
    };
    $scope.getLocationList();
    $scope.getSectionList();
    $scope.getTableList();
}]);