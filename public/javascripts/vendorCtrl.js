vendorApp = angular.module('WeddingVendor', [
	'ui.router', 
	'ngAnimate', 
	'ui.bootstrap', 
	'angular.filter', 
	'ngResource']);

vendorApp.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider){
		$stateProvider.state('login', {
			url: '/login',
			templateUrl: '/login.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'authFactory', function($state, authFactory){
				if (authFactory.isLoggedIn()){
					$state.go('home');
				}
			}]
		})

		.state('register', {
				url: '/register',
				templateUrl: '/register.html',
				controller: 'AuthCtrl',
				onEnter: ['$state', 'authFactory', function($state, authFactory){
				if (authFactory.isLoggedIn()){
					$state.go('home');
				}
			}]
		})
}]);



vendorApp.controller('VendorNavCtrl'),[
	'$scope',
	'vendorFactory',
	function($scope, vendorFactory){
		$scope.isLoggedIn = vendorFactory.isLoggedIn;
		$scope.currentVendor = vendorFactory.currentVendor;
		$scope.logOut = vendorFactory.logOut;
	}
]

vendorApp.controller('VendorCtrl',[
	'$scope',
	'$state',
	'vendorFactory',
	'$http',
	function($scope, $state, vendorFactory, $http){
		
		$scope.vendor = {};

		$scope.register = function(){
			vendorFactory.register($scope.vendor).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('home');			//tbf (to be fixed)
			})
		}

		$scope.login = function(){
			authFactory.login($scope.vendor).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('home');			//tbf
			});		
		};



}])