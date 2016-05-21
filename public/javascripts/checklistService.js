angular.module("WeddingPenguin").factory('checklistsFactory', ['$http', function($http){
	var o = {
		checklists: []
	}

	o.getAll = function(){
		return $http.get('api/checklists').success(function(data){
			angular.copy(data, o.checklists);
		})
	}

	o.create = function(){
		return $http.post('api/checklists').success(function(data){
			o.checklists.push(data);
		})
	}

	return o;
}])