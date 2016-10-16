angular.module('WeddingPenguin').factory('authFactory',authFactory)

authFactory.$inject = [
	'$http',
	'$window',
]

function authFactory($http, $window){

	var authFactory = {
		getToken: getToken,
		hasToken: hasToken,
		saveToken: saveToken,
		extractToken: extractToken, 	//pass the token from the storage to req.header for express router.
		isLoggedIn: isLoggedIn,
		currentUser: currentUser,
		currentUserID: currentUserID,
		getToken: getToken,
		register: register,
		login: login,
		logOut: logOut,
	};

	return authFactory;


	/************** Functions ***************/

	function getToken(){
		return $window.localStorage['wedding-penguin-token'];
	}

	function hasToken(){
		var token = getToken()
		if (!token){
			$window.location.href = "/home";
		}
	}

	function saveToken(newToken){
		$window.localStorage['wedding-penguin-token'] = newToken;
	}
	
	function extractToken(){
		return {
	  		headers: {Authorization: 'Bearer '+authFactory.getToken()}
	  	}
	}

	function isLoggedIn(){
	 var token = getToken();

	  if(token){
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.exp > Date.now() / 1000;
	  } else {
	    return false;
	  }
	};

	function currentUser(){
		if (isLoggedIn()){
			var token = getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.username
		}
	}

	function currentUserID(){
		if (isLoggedIn()){
			var token = getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload._id;
		}
	}

	function register(user){
	  return $http.post('/api/register', user).success(function(data){
	    authFactory.saveToken(data.token);			//save the JWT (generated from routes and models) into local storage
	  	console.log(data.token);					//tbf
	  });
	};

	function login(user){
		return $http.post('/api/login', user).success(function(data){
			authFactory.saveToken(data.token);
			console.log(data.token);				//tbf
		});
	}

	function logOut(){
		$window.localStorage.removeItem('wedding-penguin-token');
	}



	return authFactory;

}

angular.module('WeddingPenguin').factory('authInterceptor', function (authFactory) {
  	return authFactory.extractToken()
})

