var app = angular.module('WeddingPenguin',['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){

		$stateProvider.state('home', 
			{url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
			}
		);

	$urlRouterProvider.otherwise('home');
	
	}
]);

app.factory('guests',[function(){
	var o = {
		post: []
	};
		return o;
}])

app.controller('MainCtrl',['$scope', 'guests', function($scope, guests){
	$scope.guests = guests.guests;
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