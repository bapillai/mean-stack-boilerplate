'use strict';

app.controller('addEmployeeController', ['$scope', '$mdSidenav', 'panelService',
  '$route', '$timeout', '$log', '$rootScope', 'employeeDataService',
  'locationDataService', 'sectionDataService',
  function($scope, $mdSidenav, panelService, $route, $timeout, $log,
    $rootScope, employeeDataService, locationDataService,
    sectionDataService) {
    $scope.successMessage = "";
    $scope.locationListForEmployee = [];
    $scope.sectionListForEmployee = [];
    $scope.selectedLocationIdEmp = "";
    $scope.selectedLocationNameEmp = "";
    $scope.formClear = function() {
      $scope.inputName = "";
      $scope.inputPhone = "";
      $scope.inputEmail = "";
      $scope.inputLocation = "";
      $scope.inputSection = "";
      $scope.selectedRole = "";
      $scope.inputRestaurant = "";
    };
    $scope.getLocationSelected = function(location) {
      if ($scope.inputLocation != null && $scope.inputLocation !=
        undefined && $scope.inputLocation != "") {
        var locationIdSelected = $scope.inputLocation;
        var locationSelected = $.grep($scope.locationListForEmployee,
          function(location) {
            return location.locationId == locationIdSelected;
          });
        $scope.selectedLocationIdEmp = locationSelected[0].locationId;
        $scope.selectedLocationNameEmp = locationSelected[0].locationName;
      }
    };
    $scope.getLocationList = function() {
      locationDataService.getAllLocation($rootScope.token).then(function(
        responseData) {
        for (var i = 0; i < responseData.location.length; i++) {
          $scope.locationListForEmployee.push({
            locationName: responseData.location[i].locationName,
            locationId: responseData.location[i].locationId
          });
        }
      });
    };
    $scope.getSectionList = function() {
      sectionDataService.getAllSection($rootScope.token).then(function(
        responseData) {
        for (var i = 0; i < responseData.section.length; i++) {
          $scope.sectionListForEmployee.push({
            sectionName: responseData.section[i].sectionName,
            sectionId: responseData.section[i].sectionId
          });
        }
      });
    };
    $scope.getLocationList();
    $scope.getSectionList();
    $scope.saveData = function() {
      var employeeInfo = [{
        "name": $scope.inputName,
        "phoneNumber": $scope.inputPhone,
        "email": $scope.inputEmail,
        "locationId": $scope.selectedLocationIdEmp,
        "locationName": $scope.selectedLocationNameEmp,
        "sectionName": $scope.inputSection,
        "role": $scope.selectedRole
      }];
      employeeDataService.addNewEmployee(employeeInfo).then(function(
        responseData) {
        $scope.formClear();
        $scope.successMessage = responseData.msg;
        $timeout(function() {
          $scope.successMessage = "";
          $rootScope.showEmployeeForm = false;
          $route.reload();
        }, 3000);
      });
    };
  }
]);
