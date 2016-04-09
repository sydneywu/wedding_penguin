var app = angular.module('WeddingPenguin',[]);

app.controller('GuestCtrl',['$scope', function($scope){
	$scope.guests = [
		{name:'mary', table: 1, relation: 'family'}, 
		{name:'mary', table: 1, relation: 'family'}, 
		{name:'mary', table: 1, relation: 'family'}, 
	
	]

	$scope.addGuest = function(){
		$scope.guests.push({name: $scope.guestName, table: $scope.guestTable, relation: $scope.guestRelation});
		$scope.name="Guest's Name";
		$scope.relation="Relation"
	}

	$scope.totalTables = 5

	$scope.getNumber=function(num){
		return new Array(num);
	}

}])