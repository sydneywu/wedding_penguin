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
			return $http.post('/vendor/api/login', vendor).success(function(data){
				o.saveToken(data.token);
		  		console.log(data.token);					//tbf

			})
		}

		o.logOut = function(){
			$window.localStorage.removeItem('wedding-penguin-vendor');
		}

		o.get = function(id){
			return $http.get('/vendor/api/profile', authInterceptor).then(function(res){
				//angular.copy(data, o.guest);
				return res.data;
			})
		}

		return o;
}])



.service('vendorInterceptor', [
	'$window', 
	'vendorFactory', 
	function ($window, vendorFactory) {
  
	console.log('User is Logged In: ' + vendorFactory.isLoggedIn());
	if(vendorFactory.isLoggedIn()){
		return {headers: {Authorization: 'Bearer '+ vendorFactory.getToken()}}	
	} else {
		$window.location.href = '/vendor/login';
	}

}])

vendorApp.factory('vendorProfileFactory',[
	'$http',
	'vendorFactory',
	'vendorInterceptor',
	function($http, vendorFactory, vendorInterceptor){
		
		var o = {vendors: []};

		o.getAll = function(){
			return $http.get('/vendor/api/vendors', vendorInterceptor).success(function(data){
				angular.copy(data, o.vendors);
			})
		}
		o.get = function(id){
			return $http.get('/vendor/api/vendor/'+ vendorFactory.currentVendor()._id, vendorInterceptor).then(function(res){
				//angular.copy(data, o.guest);
				return res.data;
			})
		}

		o.getProfile = function(){
			return $http.get('/vendor/api/vendor/' + vendorFactory.currentVendor()._id).then(function(res){
				return res.data;
			})
		}


		o.update= function(vendor, data){
			return $http.put('/vendor/api/vendor/' + vendorFactory.currentVendor()._id, data)
				.success(function(data){
					console.log('guest updated')
				})
		}

		o.delete = function(vendor){
			return $http.delete('/vendor/api/vendor/' + vendor._id)
				.success(function(data){
					console.log('vendor deleted')
				})
		}

		return o;



}])