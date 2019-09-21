app.controller('employeeListController', ['$resource', '$http', '$q', '$scope',
  'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$rootScope',
  '$timeout', 'employeeDataService',
  function($resource, $http, $q, $scope, DTOptionsBuilder, DTColumnBuilder,
    $interval, $rootScope, $timeout, employeeDataService) {
    $rootScope.showEmployeeForm = false;
    $scope.dTable = this;
    $scope.dTable.dtInstance = {};
    $scope.productTableServerData = [];

    $scope.rowCallback = function(nRow, aData, iDisplayIndex,
      iDisplayIndexFull) {
      var _elem = angular.element(nRow);
      _elem.unbind('click').bind('click', function($event) {});
      return nRow;
    };

    $scope.convertTableData = function() {
      var deferred = $q.defer();
      deferred.resolve($scope.productTableServerData);
      return deferred.promise;
    };

    $scope.setTableHeaderForType = function() {
      $scope.productTableData.aoColumns = [
        DTColumnBuilder.newColumn('name').notSortable().withTitle(
          'Name').renderWith(function(data, type, full) {
          var _outputHtml;
          if (full.name != undefined && full.name != null && full.name !=
            "") {
            _outputHtml = " <span><i> " + full.name + "</span></i> ";
          } else {
            _outputHtml = " <span><i> NA  </span></i> ";
          }
          return _outputHtml;
        }), DTColumnBuilder.newColumn('phoneNumber').notSortable().withTitle(
          'Phone Number').renderWith(function(data, type, full) {
          var _outputHtml;
          if (full.phoneNumber != undefined && full.phoneNumber != "" &&
            full.phoneNumber != null) {
            _outputHtml = " <span><i> " + full.phoneNumber +
              "</span></i> ";
          } else {
            _outputHtml = " <span><i> NA  </span></i> ";
          }
          return _outputHtml;
        }), DTColumnBuilder.newColumn('email').notSortable().withTitle(
          'Email').renderWith(function(data, type, full) {
          var _outputHtml;
          if (full.email != undefined && full.email != "" && full.email !=
            null) {
            _outputHtml = " <span><i> " + full.email + "</span></i> ";
          } else {
            _outputHtml = " <span><i> NA  </span></i> ";
          }
          return _outputHtml;
        }), DTColumnBuilder.newColumn('locationName').notSortable().withTitle(
          'Location Name').renderWith(function(data, type, full) {
          var _outputHtml;
          if (full.locationName != undefined && full.locationName !=
            "" && full.locationName != null) {
            _outputHtml = " <span><i> " + full.locationName +
              "</span></i> ";
          } else {
            _outputHtml = " <span><i> NA  </span></i> ";
          }
          return _outputHtml;
        }), DTColumnBuilder.newColumn('role').notSortable().withTitle(
          'Role').renderWith(function(data, type, full) {
          var _outputHtml;
          _outputHtml = " <span><i> " + full.role + "</span></i> ";
          if (full.role != undefined && full.role != "" && full.role !=
            null) {
            _outputHtml = " <span><i> " + full.role + "</span></i> ";
          } else {
            _outputHtml = " <span><i> NA  </span></i> ";
          }
          return _outputHtml;
        })
      ];
      $scope.dTable.dtColumns = $scope.productTableData.aoColumns;
    }

    $scope.getAjaxData = function() {
      employeeDataService.getAllEmployees($rootScope.token).then(function(
        responseData) {
        var tableData = [];
        for (var i = 0; i < responseData.employees.length; i++) {
          tableData.push(responseData.employees[i]);
        }
        $scope.productTableServerData = tableData;
        $scope.setTableHeaderForType();
        if ($scope.dTable.dtInstance.changeData) {
          $scope.dTable.dtInstance.changeData($scope.convertTableData);
        }
      });
    };
    var _st = $timeout(function() {
      $scope.getAjaxData();
    }, 300);

    $scope.productTableData = {
      "aaData": [],
      "aoColumns": []
    };
    $scope.setTableHeaderForType();
    $scope.dTable.dtOptions = DTOptionsBuilder.fromFnPromise($scope.convertTableData())
      .withPaginationType('simple')
      .withDisplayLength(10)
      .withOption('rowCallback', $scope.rowCallback);
  }
]);
