'use strict';
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
]);