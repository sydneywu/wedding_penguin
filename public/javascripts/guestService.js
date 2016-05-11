angular.module("WeddingPenguin").factory('guestsFactory',['$http', function($http){
	var o = {
		guests: [], 
	};

	o.getAll = function(){
		return $http.get('/guests').success(function(data){
			angular.copy(data, o.guests);
		})
	}

	o.create = function(guest){
		return $http.post('/guests', guest).success(function(data){
			o.guests.push(data);
		});
	};

	o.get = function(id){
		return $http.get('/guests/'+id).then(function(res){
			//angular.copy(data, o.guest);
			return res.data;
		})
	}

	o.change = function(guest){
		return $http.put('/guests/' + guest._id + '/change')
			.success(function(data){
				guest.relation = 'num';
			});
	};

	o.update1= function(guest, data1){
		return $http.put('/guests/' + guest._id, data1)
			.success(function(data){
				console.log('guest updated')
			})
	}

	o.delete = function(guest){
		return $http.delete('/guests/' + guest._id)
			.success(function(data){
				console.log('guest deleted')
			})
	}

	return o;
}])