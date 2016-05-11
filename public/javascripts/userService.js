angular.module('WeddingPenguin').factory('authFactory',[
	'$http',
	'$window', 
	function($http, $window){
		
		var authFactory = {};

		authFactory.saveToken = function(token){
			$window.localStorage['wedding-penguin-token'] = token;
		}

		authFactory.getToken = function(){
			return $window.localStorage['wedding-penguin-token'];
		}

		authFactory.isLoggedIn = function(){
		  var token = authFactory.getToken();

		  if(token){
		    var payload = JSON.parse($window.atob(token.split('.')[1]));

		    return payload.exp > Date.now() / 1000;
		  } else {
		    return false;
		  }
		};

		authFactory.currentUser = function(){
			if (authFactory.isLoggedIn()){
				var token = authFactory.getToken();
				var payload = JSON.parse($window.atob(token.split('.')[1]));

				return payload.username;
			}
		}

		authFactory.register = function(user){
		  return $http.post('/register', user).success(function(data){
		    authFactory.saveToken(data.token);
		  });
		};

		authFactory.login = function(user){
			return $http.post('/login', user).success(function(data){
				authFactory.saveToken(data.token);
			});
		}

		authFactory.logOut = function(){
			$window.localStorage.removeItem('wedding-penguin-token');
		}

		return authFactory;

}])


