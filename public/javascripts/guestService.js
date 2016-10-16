angular.module("WeddingPenguin").factory('guestsFactory',[
	'$http', 
	'authFactory',
	'authInterceptor', 
	function($http, authFactory, authInterceptor){
		var o = { 
			guests: [], 
			participants: []
		};

		o.getAll = function(){
			return $http.get('guests/api/guests', authInterceptor).success(function(data){
				angular.copy(data, o.guests);
			})
		}

		o.getAllParticipants = function(url){
			return $http.get('guests/api/'+url, authInterceptor).success(function(data){
				console.log("calling success");
				angular.copy(data, o.participants);
			})
		}

		o.createParticipant = function(url, data){
			return $http.post('guests/api/'+url, data, authInterceptor)
				.success(function(data){
					o.participants.push(data)
				}
			)
		}

		o.updateParticipant = function(url, participant, data){
			return $http.put('guests/api/'+ url + "/" + participant/*._id*/, data, authInterceptor)
				.success(function(data){
					console.log('guest updated')
				})
		}


		o.deleteParticipant = function(url, participant){
			return $http.delete('guests/api/' + url + "/" + participant/*._id*/, authInterceptor)
				.success(function(data){
					console.log('guest deleted')
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

		o.update = function(guest, data){
			return $http.put('guests/api/guest/' + guest._id, data)
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