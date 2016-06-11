angular.module("WeddingPenguin").factory('vendorListFactory',[
	'$http',
	function($http){
		var o = {vendors: []};

		o.getAll = function(){
			return $http.get('/vendor-listing/api/vendors').success(function(data){
				angular.copy(data, o.vendors);
			})
		}

		return o;
}])