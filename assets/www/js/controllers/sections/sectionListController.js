app.controller('sectionListController', ['$resource', '$http', '$q', '$scope', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$rootScope', '$timeout', 'sectionDataService', function($resource, $http, $q, $scope, DTOptionsBuilder, DTColumnBuilder, $interval, $rootScope, $timeout, sectionDataService) {
    $rootScope.showSectionForm = false;
    $scope.dTable = this;
    $scope.dTable.dtInstance = {};
    $scope.productTableServerData = [];

    $scope.rowCallback = function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
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
            DTColumnBuilder.newColumn('sectionId').notSortable().withTitle('Section ID').renderWith(function(data, type, full) {
                var _outputHtml;
                if (full.sectionId != null && full.sectionId != undefined && full.sectionId != "") {
                    _outputHtml = " <span><i> " + full.sectionId + "</span></i> ";
                } else {
                    _outputHtml = " <span><i> NA </span></i> ";
                }
                return _outputHtml;
            }), DTColumnBuilder.newColumn('locationName').notSortable().withTitle('Location Name').renderWith(function(data, type, full) {
                var _outputHtml;
                if (full.locationName != null && full.locationName != undefined && full.locationName != "") {
                    _outputHtml = " <span><i> " + full.locationName + "</span></i> ";
                } else {
                    _outputHtml = " <span><i> NA </span></i> ";
                }
                return _outputHtml;
            }), DTColumnBuilder.newColumn('sectionName').notSortable().withTitle('Section Name').renderWith(function(data, type, full) {
                var _outputHtml;
                if (full.sectionName != null && full.sectionName != undefined && full.sectionName != "") {
                    _outputHtml = " <span><i> " + full.sectionName + "</span></i> ";
                } else {
                    _outputHtml = " <span><i> NA </span></i> ";
                }
                return _outputHtml;
            }), DTColumnBuilder.newColumn('tables').notSortable().withTitle('Tables').renderWith(function(data, type, full) {
                var _outputHtml;
                if (full.tables != null && full.tables != undefined && full.tables != "") {
                    _outputHtml = " <span><i> " + full.tables + "</span></i> ";
                } else {
                    _outputHtml = " <span><i> NA </span></i> ";
                }
                return _outputHtml;
            })
        ];
        $scope.dTable.dtColumns = $scope.productTableData.aoColumns;
    }

    $scope.getAjaxData = function() {
        sectionDataService.getAllSection($rootScope.token).then(function(responseData) {
            var tableData = [];
            for (var i = 0; i < responseData.section.length; i++) {
                tableData.push(responseData.section[i]);
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
}]);