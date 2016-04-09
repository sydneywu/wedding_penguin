var app = angular.module('WeddingPenguin',[]);

app.controller('GuestCtrl',['$scope', function($scope){
	$scope.guests = [
	{'name':'mary', 'table': 1, 'relation': 'family'}, 
	{'name':'mary', 'table': 1, 'relation': 'family'},
	{'name':'mary', 'table': 1, 'relation': 'family'} 
	
	]
}])