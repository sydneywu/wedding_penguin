angular.module('WeddingPenguin').controller('AuthCtrl',[
	'$scope',
	'$state',
	'authFactory',
	'authInterceptor',
	'$http',
	function($scope, $state, authFactory, authInterceptor, $http){
		
		$scope.user = {};

		$scope.getUser = function(){
			return $http.get('api/guests', authInterceptor)
		}

		$scope.getUser();

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

		function handleRequest(res) {
		    var token = res.data ? res.data.token : null;
		    if(token) { console.log('JWT:', token); }
		    self.message = res.data.message;	//tbf
		  }											


		function test(){
			return $http.get('api/guests')		//tbf
		}


}])