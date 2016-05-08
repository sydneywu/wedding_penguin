var app = angular.module('WeddingPenguin',['ui.router', 'ui.bootstrap', 'angular.filter', 'ngResource']);

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
			})

			.state('checklist', {
				url: '/checklist',
				templateURL: '/checklist.html',
				controller: 'TodoCtrl',
				resolve:{
					checklistPromise: ['checklists', function(checklist){
						return checklists.getAll();
					}]
				}
			})

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

	o.get = function(id){
		return $http.get('/guests/'+id).then(function(res){
			return res.data;
		})
	}

	return o;
}])


app.factory('checklists',['$http', function($http){
	var o = {
		checklists: []
	};
	o.getAll = function(){
		return $http.get('/checklist').success(function(data){
			angular.copy(data, o.checklists);
		})
	}

	o.create = function(checklist){
		return $http.post('/checklists', checklist).success(function(data){
			o.checklist.push(data);
		});
	};

	return o;
}])

app.controller('MainCtrl',
function($scope, guests, $uibModal){
		
		$scope.tableNo = [1,2,3,4,5];

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

app.controller('TodoCtrl',
function($scope, checklists){

		$scope.checklists = checklists.checklists;


		$scope.addChecklist = function(){
			if(!$scope.checklistName || $scope.checklistName ===""){return;}
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

