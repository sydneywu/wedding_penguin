angular.module('WeddingPenguin').controller('VendorsListCtrl', [
	'$scope',
	'$q',
	'$stateParams',
	'vendorListFactory',
	function($scope, $q, $stateParams, vendorListFactory){

		vendorListFactory.getAll();			//run the function to get all 
		
		$scope.vendors = vendorListFactory.vendors;

}])
