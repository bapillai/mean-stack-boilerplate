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
