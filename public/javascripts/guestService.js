angular.module("WeddingPenguin").factory('guestsFactory',[
	'$http', 
	'authFactory',
	'authInterceptor', 
	function($http, authFactory, authInterceptor){
		var o = { guests: [], };

		o.getAll = function(){
			return $http.get('api/guests', authInterceptor).success(function(data){
				angular.copy(data, o.guests);
			})
		}

		o.create = function(guest){
			return $http.post('api/guests', guest, authInterceptor).success(function(data){
		  		o.guests.push(data);
		  	});

		};

		o.get = function(id){
			return $http.get('api/guest/'+id, authInterceptor).then(function(res){
				//angular.copy(data, o.guest);
				return res.data;
			})
		}

		o.change = function(guest){
			return $http.put('api/guest/' + guest._id + '/change')
				.success(function(data){
					guest.relation = 'num';
				});
		};

		o.update1= function(guest, data1){
			return $http.put('api/guest/' + guest._id, data1)
				.success(function(data){
					console.log('guest updated')
				})
		}

		o.delete = function(guest){
			return $http.delete('api/guest/' + guest._id)
				.success(function(data){
					console.log('guest deleted')
				})
		}

		return o;
}])