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
	  $stateProvider
		.state('profile', {
					url: '/profile',					// use id to display individual records
					templateUrl: '/vendor/profile.html',
					controller: 'MainCtrl',

			})

		.state('login', {
			url: '/login',
			templateUrl: '/login.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'authFactory', function($state, authFactory){
				if (authFactory.isLoggedIn()){
					$state.go('profile');
				}
			}]
		})

		.state('register', {
				url: '/register',
				templateUrl: '/register.html',
				controller: 'AuthCtrl',
				onEnter: ['$state', 'authFactory', function($state, authFactory){
				if (authFactory.isLoggedIn()){
					$state.go('profile');
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
	'$window',
	function($scope, $state, vendorFactory, $http, $window){
		
		$scope.vendor = {};

		$scope.register = function(){
			vendorFactory.register($scope.vendor).error(function(error){
				$scope.error = error;
			}).then(function(){
				$window.location.href = '/vendor/profile';			//tbf (to be fixed)
			})
		}

		$scope.login = function(){
			vendorFactory.login($scope.vendor).error(function(error){
				$scope.error = error;
			}).then(function(){
				$window.location.href = '/vendor/profile';			//tbf
			});		
		};
}])

vendorApp.controller('VendorProfileCtrl',[
	'$scope',
	'$stateParams',
	'vendorFactory',
	'vendorProfileFactory',
	'vendorInterceptor',

	function($scope, $stateParams, vendorFactory, vendorProfileFactory, vendorInterceptor){
		
		
		var promise = vendorProfileFactory.getProfile();

		promise.then(function(result){
			$scope.vendor=result;
		})

		$scope.updateVendor = function(){
			vendorProfileFactory.update($scope.guest, {
				_id: $scope.vendor._id,
				username: $scope.vendor.username,
				email: $scope.vendor.email,
				phone: $scope.vendor.phone,
				website: $scope.vendor.website
			})
		}

}])