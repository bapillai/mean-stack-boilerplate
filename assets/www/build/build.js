'use strict';

var app = angular.module('app', ['ngRoute','ngMaterial','datatables', 'ngResource']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider,
    $locationProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'www/js/templates/login/login.html',
        controller: 'loginController'
      })
      .when('/dashboard', {
        templateUrl: 'www/js/templates/dashboard/dashboard.html',
        controller: 'dashboardController'
      })
      .otherwise({
        redirectTo: '/login'
      });
  }]);
/* Attaching new file */app.controller('headerController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
  $scope.loginName = $rootScope.userName ;
}]);/* Attaching new file */'use strict';
app.controller('loginController', ['$scope', '$location', '$rootScope',
    'loginService',
    function($scope, $location, $rootScope, loginService) {
        $scope.errorFlag = false;
        $rootScope.token = "";
        $scope.userDetails = {
            'username': '',
            'password': ''
        };
        $scope.login = function(form) {
            if ((form.$valid) && ($scope.userDetails.username.length > 0) && ($scope.userDetails
                    .password.length > 0)) {
                loginService.userLogin($scope.userDetails).then(function(responseData) {
                    $rootScope.token = responseData.token;
                    if ($rootScope.token != undefined || $rootScope.token != null) {
                        loginService.getUserDetails($rootScope.token).then(function(responseData) {
                            $rootScope.welcomeMessage = responseData.msg;
                            $rootScope.userName = responseData.username;
                            $rootScope.id = responseData.id;
                            $location.path("/dashboard");
                        });
                    }
                });
            } else {
                $scope.errorFlag = true;
            }

            if (!$scope.disableLogin && ($scope.userDetails.username.length > 0) && (
                    $scope.userDetails.password.length > 0)) {
                 $scope.disableLogin = true;
            } else {}
        }
    }
]);/* Attaching new file */'use strict';

app.controller('dashboardController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log','$rootScope', function($scope, $mdSidenav, panelService, $timeout, $log, $rootScope) {
    var allPanels = [];

    $scope.selected = null;
    $scope.panels = allPanels;
    $scope.selectPanel = selectPanel;
    $scope.toggleSidenav = toggleSidenav;

    loadPanels();
    $scope.getTemplate = function(item) {
        switch (item) {
            case "Home":
                return 'www/js/templates/home/home.html';
            case "Sales":
                return 'www/js/templates/sales/sales.html';
            case "Items":
                return 'www/js/templates/items/items.html';
            case "Employees":
                return 'www/js/templates/employees/employee.html';
            case "Locations":
                return 'www/js/templates/location/location.html';
            case "Sections":
                return 'www/js/templates/sections/sections.html';
            case "Tables":
                return 'www/js/templates/tables/tables.html';
            case "Orders":
                return 'www/js/templates/orders/orders.html';
            case "Devices":
                return 'www/js/templates/devices/devices.html';
            case "Inventory":
                return 'www/js/templates/inventory/inventory.html';
            case "Settings":
                return 'www/js/templates/settings/settings.html';
            default:
                return 'www/js/templates/home/home.html';
        }
    }
    function loadPanels() {
        panelService.loadAll()
            .then(function(panels) {
                allPanels = panels;
                $scope.panels = [].concat(panels);
                $scope.selected = $scope.panels[0];
            })
    }

    function toggleSidenav(name) {
        $mdSidenav(name).toggle();
    }

    function selectPanel(panel) {
        $scope.selected = angular.isNumber(panel) ? $scope.panels[panel] : panel;
        $scope.toggleSidenav('left');
    }
}]);


app.service('panelService', ['$q', function($q) {
    var panels = [{
        name: 'Home'
    }, {
        name: 'Sales'
    },{
        name:'Items'
    },{
        name:'Employees'
    },{
        name:'Locations'
    },{
        name:'Sections'
    },{
        name:'Tables'
    },{
        name:'Orders'
    },{
        name:'Devices'
    },{
        name:'Inventory'
    },{
        name:'Settings'
    }];
    return {
        loadAll: function() {
            return $q.when(panels);
        }
    };
}]);/* Attaching new file */'use strict';

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
/* Attaching new file */'use strict';

app.controller('employeeController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'employeeDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, employeeDataService) {
    $rootScope.showEmployeeForm =false;
    $scope.successMessage = "";
    $scope.showAddEmployeeForm = function(){
        $rootScope.showEmployeeForm =true;
    };
}]);
/* Attaching new file */app.controller('employeeListController', ['$resource', '$http', '$q', '$scope',
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
/* Attaching new file */'use strict';

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
}]);/* Attaching new file */'use strict';

app.controller('locationController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'locationDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, locationDataService) {
    $rootScope.showLocationForm =false;
    $scope.successMessage = "";
    $scope.showAddLocationForm = function(){
        $rootScope.showLocationForm =true;
    };
}]);
/* Attaching new file */app.controller('locationListController', ['$resource', '$http', '$q', '$scope', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$rootScope', '$timeout', 'locationDataService', function($resource, $http, $q, $scope, DTOptionsBuilder, DTColumnBuilder, $interval, $rootScope, $timeout, locationDataService) {
            $rootScope.showLocationForm = false;
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
                    DTColumnBuilder.newColumn('locationId').notSortable().withTitle('Location ID').renderWith(function(data, type, full) {
                        var _outputHtml;
                        if (full.locationId != null && full.locationId != undefined && full.locationId != "") {
                            _outputHtml = " <span><i> " + full.locationId + "</span></i> ";
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
                    }), DTColumnBuilder.newColumn('sectionName').notSortable().withTitle('Sections').renderWith(function(data, type, full) {
                        var _outputHtml;
                        if (full.sectionName != null && full.sectionName != undefined && full.sectionName != "") {
                            _outputHtml = " <span><i> " + full.sectionName + "</span></i> ";
                        } else {
                            _outputHtml = " <span><i> NA </span></i> ";
                        }
                        return _outputHtml;
                    }), DTColumnBuilder.newColumn('orders').notSortable().withTitle('Orders').renderWith(function(data, type, full) {
                        var _outputHtml;
                            if (full.orders != null && full.orders != undefined && full.orders != "") {
                                if (full.orders.orderId != null && full.orders.orderId != undefined && full.orders.orderId != "") {
                                    _outputHtml = " <span><i> " + full.orders.orderId + "</span></i> ";
                                } else {
                                    _outputHtml = " <span><i> NA </span></i> ";
                                }
                            }else{
                                _outputHtml = " <span><i> NA </span></i> ";
                            }

                            return _outputHtml;
                        })];
                    $scope.dTable.dtColumns = $scope.productTableData.aoColumns;
                }

                $scope.getAjaxData = function() {
                    locationDataService.getAllLocation($rootScope.token).then(function(responseData) {
                        var tableData = [];
                        for (var i = 0; i < responseData.location.length; i++) {
                            tableData.push(responseData.location[i]);
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
            }]);/* Attaching new file */'use strict';

app.controller('addSectionController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'sectionDataService', 'locationDataService','$route', function($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, sectionDataService, locationDataService,$route) {
    $scope.successMessageSection = "";
    $scope.locationListForSection = [];
    $scope.sectionList = [];
    $scope.selectedTable = "";
    $scope.selectedLocationId = "";
    $scope.selectedLocationName = "";
    $scope.formClear = function() {
        $scope.inputLocation = "";
        $scope.selectedSection = "";
    };

    $scope.getLocationSelected = function(location) {
        if ($scope.inputLocation != null && $scope.inputLocation != undefined && $scope.inputLocation != "") {
            var locationIdSelected = $scope.inputLocation;
            var locationSelected = $.grep($scope.locationListForSection, function(location) {
                return location.locationId == locationIdSelected;
            });
            $scope.selectedLocationId = locationSelected[0].locationId;
            $scope.selectedLocationName = locationSelected[0].locationName;
        }
    };
    $scope.saveSectionForm = function() {
        if ($scope.selectedLocationId != undefined && $scope.selectedLocationId != null && $scope.selectedLocationName != undefined && $scope.selectedLocationName != null && $scope.selectedSection != null && $scope.selectedSection != undefined) {
            var sectionInfo = [{
                "locationId": $scope.selectedLocationId,
                "locationName": $scope.selectedLocationName,
                "sectionName": $scope.selectedSection,
                "tables": []
            }];
            sectionDataService.addNewSection(sectionInfo).then(function(responseData) {
                $scope.formClear();
                $scope.successMessageSection = responseData.msg;
                $timeout(function() {
                    $scope.successMessageSection = "";
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
                $scope.sectionList.push(responseData.section[i].sectionName);
            }
        });
    };
    $scope.getLocationList();
    $scope.getSectionList();
}]);/* Attaching new file */'use strict';

app.controller('sectionController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'sectionDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, sectionDataService) {
    $rootScope.showSectionForm =false;
    $scope.successMessageSection = "";
    $scope.showAddSectionForm = function(){
        $rootScope.showSectionForm =true;
    };
}]);
/* Attaching new file */app.controller('sectionListController', ['$resource', '$http', '$q', '$scope', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$rootScope', '$timeout', 'sectionDataService', function($resource, $http, $q, $scope, DTOptionsBuilder, DTColumnBuilder, $interval, $rootScope, $timeout, sectionDataService) {
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
}]);/* Attaching new file */'use strict';

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
}]);/* Attaching new file */'use strict';

app.controller('tableController', ['$scope', '$mdSidenav', 'panelService', '$timeout', '$log', '$rootScope', 'tableDataService', function ($scope, $mdSidenav, panelService, $timeout, $log, $rootScope, tableDataService) {
    $rootScope.showTableForm =false;
    $scope.successMessageTable = "";
    $scope.showAddTableForm = function(){
        $rootScope.showTableForm =true;
    };
}]);
/* Attaching new file */app.controller('tableListController', ['$resource', '$http', '$q', '$scope', 'DTOptionsBuilder', 'DTColumnBuilder', '$interval', '$rootScope', '$timeout', 'tableDataService', function($resource, $http, $q, $scope, DTOptionsBuilder, DTColumnBuilder, $interval, $rootScope, $timeout, tableDataService) {
    $rootScope.showTableForm = false;
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
            DTColumnBuilder.newColumn('locationName').notSortable().withTitle('Location Name').renderWith(function(data, type, full) {
                var _outputHtml;
                if (full.locationName != null && full.locationName != undefined && full.locationName != "") {
                    _outputHtml = " <span><i> " + full.locationName + "</span></i> ";
                } else {
                    _outputHtml = " <span><i> NA </span></i> ";
                }
                return _outputHtml;
            }),
            DTColumnBuilder.newColumn('sectionName').notSortable().withTitle('Section Name').renderWith(function(data, type, full) {
                var _outputHtml;
                if (full.sectionName != null && full.sectionName != undefined && full.sectionName != "") {
                    _outputHtml = " <span><i> " + full.sectionName + "</span></i> ";
                } else {
                    _outputHtml = " <span><i> NA </span></i> ";
                }
                return _outputHtml;
            }), DTColumnBuilder.newColumn('tables').notSortable().withTitle('Table Name').renderWith(function(data, type, full) {
                var _outputHtml;
                if (full.tables != null && full.tables != undefined && full.tables != "") {
                    if (full.tables[0].tableId != null && full.tables[0].tableId != undefined && full.tables[0].tableId != "") {
                        _outputHtml = " <span><i> " + full.tables[0].tableId + "</span></i> ";
                    } else {
                        _outputHtml = " <span><i> NA </span></i> ";
                    }
                } else {
                    _outputHtml = " <span><i> NA </span></i> ";
                }

                return _outputHtml;
            }), DTColumnBuilder.newColumn('tables').notSortable().withTitle('Tables').renderWith(function(data, type, full) {
                var _outputHtml;
                if (full.tables != null && full.tables != undefined && full.tables != "") {
                    if (full.tables[0].tableName != null && full.tables[0].tableName != undefined && full.tables[0].tableName != "") {
                        _outputHtml = " <span><i> " + full.tables[0].tableName + "</span></i> ";
                    } else {
                        _outputHtml = " <span><i> NA </span></i> ";
                    }
                } else {
                    _outputHtml = " <span><i> NA </span></i> ";
                }
                return _outputHtml;
            })
        ];
        $scope.dTable.dtColumns = $scope.productTableData.aoColumns;
    }

    $scope.getAjaxData = function() {
        tableDataService.getAllTable($rootScope.token).then(function(responseData) {
            var tableData = [];
            for (var i = 0; i < responseData.table.length; i++) {
                tableData.push(responseData.table[i]);
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
}]);/* Attaching new file */app.directive('autoComplete', function($timeout) {
    return function(scope, iElement, iAttrs) {
            iElement.autocomplete({
                source: scope[iAttrs.uiItems],
                select: function() {
                    $timeout(function() {
                      iElement.trigger('input');
                    }, 0);
                }
            });
    };
});/* Attaching new file */'use strict';

app.directive('resize', function($window) {
    return function(scope, element, attr) {
        var w = angular.element($window);
        scope.$watch(function() {
            return {
                'h': w.height(),
                'w': w.width()
            };
        }, function(newValue, oldValue) {
            scope.windowHeight = newValue.h;
            scope.windowWidth = newValue.w;

            scope.resizeWithOffset = function(offsetH) {
                scope.$eval(attr.notifier);
                return {
                    'height': (newValue.h - offsetH) + 'px'
                };
            };

        }, true);

        w.bind('resize', function() {
            scope.$apply();
        });
    };
});/* Attaching new file */const baseURL = "url-value-to-be-given-here"
app.service("employeeDataService", function($http, $q) {
  return ({
    addNewEmployee: addNewEmployee,
    getAllEmployees: getAllEmployees
  });

  function addNewEmployee(employeeInfo) {
    var request = $http({
      method: "POST",
      url: baseURL+'/api/addEmployee',
      data: {
        employeeInfo: employeeInfo
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function getAllEmployees(token) {
    var request = $http({
      method: "GET",
      url: baseURL+'/api/getAllEmployees',
      headers: {
        Authorization: token
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function getRestaurantDetails(selectedLocation) {
    var request = $http({
      method: "GET",
      url: baseURL+'/api/getRestaurantDetails',
      headers: {
        Authorization: token
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function handleError(response) {
    var ret = '';
    if (!angular.isObject(response.data) || !response.data.message) {
      ret = ($q.reject("An unknown error occurred."));
    }
    if (ret.length == 0) {
      ret = ($q.reject(response.data.message));
    }
    return ret;
  }

  function handleSuccess(response) {
    return (response.data);
  }
});
/* Attaching new file */const baseURL = "url-value-to-be-given-here"
app.service("locationDataService", function($http, $q) {
  return ({
    addNewLocation: addNewLocation,
    getAllLocation: getAllLocation
  });

  function addNewLocation(locationInfo) {
    var request = $http({
      method: "POST",
      url: baseURL+'/api/location',
      data: {
        locationInfo: locationInfo
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function getAllLocation(token) {
    var request = $http({
      method: "GET",
      url: baseURL+'/api/getAllLocations',
      headers: {
        Authorization: token
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function handleError(response) {
    var ret = '';
    if (!angular.isObject(response.data) || !response.data.message) {
      ret = ($q.reject("An unknown error occurred."));
    }
    if (ret.length == 0) {
      ret = ($q.reject(response.data.message));
    }
    return ret;
  }

  function handleSuccess(response) {
    return (response.data);
  }
});
/* Attaching new file */const baseURL = "url-value-to-be-given-here"
app.service("loginService", function($http, $q) {
  return ({
    userLogin: userLogin,
    getUserDetails: getUserDetails
  });

  function userLogin(userDetails) {
    var request = $http({
      method: "POST",
      url: baseURL+'/api/authenticate',
      data: {
        userDetails: userDetails
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function getUserDetails(token) {
    var request = $http({
      method: "GET",
      url: baseURL+'/api/memberinfo',
      headers: {
        Authorization: token
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function handleError(response) {
    var ret = '';
    if (!angular.isObject(response.data) || !response.data.message) {
      ret = ($q.reject("An unknown error occurred."));
    }
    if (ret.length == 0) {
      ret = ($q.reject(response.data.message));
    }
    return ret;
  }

  function handleSuccess(response) {
    return (response.data);
  }
});
/* Attaching new file */const baseURL = "url-value-to-be-given-here"
app.service("sectionDataService", function($http, $q) {
  return ({
    addNewSection: addNewSection,
    getAllSection: getAllSection
  });

  function addNewSection(sectionInfo) {
    var request = $http({
      method: "POST",
      url: baseURL+'/api/section',
      data: {
        sectionInfo: sectionInfo
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function getAllSection(token) {
    var request = $http({
      method: "GET",
      url: baseURL+'/api/getAllSections',
      headers: {
        Authorization: token
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function handleError(response) {
    var ret = '';
    if (!angular.isObject(response.data) || !response.data.message) {
      ret = ($q.reject("An unknown error occurred."));
    }
    if (ret.length == 0) {
      ret = ($q.reject(response.data.message));
    }
    return ret;
  }

  function handleSuccess(response) {
    return (response.data);
  }
});
/* Attaching new file */const baseURL = "url-value-to-be-given-here"
app.service("tableDataService", function($http, $q) {
  return ({
    addNewTable: addNewTable,
    getAllTable: getAllTable
  });

  function addNewTable(tableInfo) {
    var request = $http({
      method: "POST",
      url: baseURL+'/api/tables',
      data: {
        tableInfo: tableInfo
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function getAllTable(token) {
    var request = $http({
      method: "GET",
      url: baseURL+'/api/getAllTables',
      headers: {
        Authorization: token
      }
    });
    return (request.then(handleSuccess, handleError));
  }

  function handleError(response) {
    var ret = '';
    if (!angular.isObject(response.data) || !response.data.message) {
      ret = ($q.reject("An unknown error occurred."));
    }
    if (ret.length == 0) {
      ret = ($q.reject(response.data.message));
    }
    return ret;
  }

  function handleSuccess(response) {
    return (response.data);
  }
});
