app.controller('headerController', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
  $scope.loginName = $rootScope.userName ;
}]);