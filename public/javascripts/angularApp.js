var app = angular.module('WeddingPenguin',['ui.router', 'ui.bootstrap']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){

		$stateProvider
			.state('home', 
				{url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl',
				resolve:{								//ensure the getAll function will run first
					guestPromise: ['guests', function(guests){
						return guests.getAll();
					}]
				}
			});

	$urlRouterProvider.otherwise('home');
	
	}
]);

app.factory('guests',['$http', function($http){
	var o = {
		guests: []
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

	return o;
}])

app.controller('MainCtrl',
function($scope, guests, $uibModal){

		$scope.items = [1,2,3,4,5,6];
		$scope.guests = guests.guests;


		$scope.addGuest = function(){
			if(!$scope.guestName || $scope.guestName ===""){return;}
			guests.create({
				name: $scope.guestName,
				relation: $scope.guestRelation,
				table: $scope.guestTable,
			});
			//$scope.name='';
			//$scope.relation='';
			//$scope.table='';
		}

		$scope.totalTables = 5

		$scope.getNumber=function(num){
			return new Array(num);
		}

		$scope.open = function(){

			var modalInstance = $uibModal.open({
			    templateUrl: 'myModalContent.html',
			    controller: 'ModalInstanceCtrl',
				resolve: {
			    	tables: function () {
			        	return $scope.items;
		        	}
  			    }
			})

		    modalInstance.result.then(function (selectedItem) {
		      $scope.selected = selectedItem;
		    }, function () {
		      $log.info('Modal dismissed at: ' + new Date());
		    });

		}

})

app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, tables) {

  $scope.items = tables;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});