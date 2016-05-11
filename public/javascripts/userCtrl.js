angular.module('WeddingPenguin').controller('AuthCtrl',[
	'$scope',
	'$state',
	'authFactory',
	function($scope, $state, authFactory){
		
		$scope.user = {};

		$scope.register = function(){
			authFactory.register($scope.user).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('home');
			});
		};

		$scope.login = function(){
			authFactory.login($scope.user).error(function(error){
				$scope.error = error;
			}).then(function(){
				$state.go('home');
			});		
		};

}])