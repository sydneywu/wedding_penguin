var app = angular.module('WeddingPenguin',['ui.router', 'ui.bootstrap', 'angular.filter', 'ngResource']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){

		$stateProvider
			.state('home', {
					url: '/home',					// use id to display individual records
					templateUrl: '/home.html',
					controller: 'MainCtrl',

			})

			.state('guests', {
					url: '/guests',
					templateUrl: '/guests.html',
					controller: 'MainCtrl',
					resolve:{								//ensure the getAll function will run first
						guestsPromise: 
							['guestsFactory', 
							function(guests){ 
								return guests.getAll();
							}]
					}
			})

			.state('guestDetails', {
					url: '/guests/{id}',
					templateUrl: '/guest_details.html',
					controller: 'GuestCtrl',
					resolve:{								//ensure the getAll function will run first
						guestPromise: ['$stateParams', 'guestsFactory', function($stateParams, guests){
							return guests.get($stateParams.id);
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


		//$urlRouterProvider.otherwise('home');
	
	}
]);


app.factory('guestsFactory',['$http', function($http){
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

app.controller('GuestCtrl', [
	'$scope',
	'$stateParams',
	'guestsFactory',
	'guestPromise',
	function($scope, $stateParams, guestsFactory, guestb){
		
		$scope.guest=guestPromise;

		$scope.updateGuest = function(){
			guestsFactory.update1($scope.guest, {
				name: $scope.guest.name,
				relation: $scope.guest.relation,
				table: $scope.guest.table
			})
		}

		$scope.deleteGuest = function(){
			console.log ($scope.guest);
			guestsFactory.delete($scope.guest);
		}
	}
])

app.controller('MainCtrl', [
	'$scope',
	'$stateParams',
	'guestsFactory',
	'$uibModal',
	function($scope, $stateParams, guestsFactory, $uibModal){
		
		$scope.tableNo = [1,2,3,4,5];
		$scope.totalTables=5;
		$scope.getNumber=function(num){
			return new Array(num);
		}

		$scope.guests = guestsFactory.guests;		//for all guests
		
		//$scope.test= $scope.guest;

		$scope.addGuest = function(){
			if(!$scope.guestName || $scope.guestName ===""){return;}	//error checking
			guestsFactory.create({												
				name: $scope.guestName,
				relation: $scope.guestRelation,
				table: $scope.guestTable,
			});
			//$scope.name='';
			//$scope.relation='';
			//$scope.table='';
		}

		$scope.changeGuest = function(guest){
			guestsFactory.change(guest)
		}




		// modal window
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

}]);




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

