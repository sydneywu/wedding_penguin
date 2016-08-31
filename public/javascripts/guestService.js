angular.module("WeddingPenguin").factory('guestsFactory',[
	'$http', 
	'authFactory',
	'authInterceptor', 
	function($http, authFactory, authInterceptor){
		var o = { guests: [], };

		o.getAll = function(){
			return $http.get('guests/api/guests', authInterceptor).success(function(data){
				angular.copy(data, o.guests);
			})
		}

		o.create = function(guest){
			return $http.post('guests/api/guests', guest, authInterceptor).success(function(data){
		  		o.guests.push(data);
		  	});

		};

		o.get = function(id){
			return $http.get('guests/api/guest/'+id, authInterceptor).then(function(res){
				//angular.copy(data, o.guest);
				return res.data;
			})
		}

		o.change = function(guest){
			return $http.put('guests/api/guest/' + guest._id + '/change')
				.success(function(data){
					guest.relation = 'num';
				});
		};

		o.update = function(guest, data1){
			return $http.put('guests/api/guest/' + guest._id, data1)
				.success(function(data){
					console.log('guest updated')
				})
		}

		o.delete = function(guest){
			return $http.delete('guests/api/guest/' + guest._id)
				.success(function(data){
					console.log('guest deleted')
				})
		}

		return o;
}])