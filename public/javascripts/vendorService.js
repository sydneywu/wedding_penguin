vendorApp.factory('vendorFactory',[
	'$http',
	'$window',
	function($http, $window){
		
		var o = {};

		o.saveToken = function(token){
			$window.localStorage['wedding-penguin-vendor'] = token;			
		}

		o.getToken = function(token){
			return $window.localStorage['wedding-penguin-vendor'] 					
		}

		o.isLoggedIn = function(){
			var token = o.getToken();

			if(token){
				var payload = JSON.parse($window.atob(token.split('.')[1]));
				return payload.exp > Date.now()/1000;
			} else {
				return false;
			}
		};

		o.currentVendor = function(){
			if (o.isLoggedIn()){
				var token = o.getToken();
				var payload = JSON.parse($window.atob(token.split('.')[1]))
			
				return payload
			}
		}

		o.register = function(vendor){
			return $http.post('/vendor/api/register', vendor).success(function(data){
				o.saveToken(data.token);
		  		console.log(data.token);					//tbf

			})
		}

		o.login = function(vendor){
			return $http.post('/api/login', vendor).success(function(data){
				o.saveToken(data.token);
		  		console.log(data.token);					//tbf

			})
		}

		o.logOut = function(){
			$window.localStorage.removeItem('wedding-penguin-vendor');
		}

		return o;
}])