angular.module("WeddingPenguin").factory('guestTablesFactory',[
	'$http', 
	'authFactory',
	'authInterceptor', 
	function($http, authFactory, authInterceptor){
		var o = { tables: [], };

		o.getAll = function(){
			return $http.get('guests/api/tables', authInterceptor).success(function(data){
				angular.copy(data, o.tables);
			})
		}

		o.create = function(table){
			return $http.post('guests/api/tables', table, authInterceptor).success(function(data){
		  		o.tables.push(data);
		  	});
		};

		o.update = function(table){
			return $http.post('guests/api/tables', table)
				.success(function(data){
					console.log('table updated')
				})
		}

/*		o.get = function(id){
			return $http.get('guests/api/tables/'+id, authInterceptor).then(function(res){
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

		o.update1= function(guest, data1){
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
*/
		return o;
}])