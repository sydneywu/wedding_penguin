var app = angular.module('WeddingPenguin',['ui.router', 'ui.bootstrap', 'angular.filter', 'ngResource']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	'$locationProvider',
	function($stateProvider, $urlRouterProvider, $locationProvider){

		$stateProvider
			.state('home', {
					url: '/home',					// use id to display individual records
					templateUrl: '/home.html',
					controller: 'MainCtrl',

			})

			.state('guests', {
					url: '/guests',
					templateUrl: '/guests.html',
					controller: 'GuestsCtrl',
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
					templateUrl: '/ui_views/guest_details.html',
					controller: 'GuestCtrl',
					resolve:{								//ensure the getAll function will run first
						guestPromise: ['$stateParams', 'guestsFactory', function($stateParams, guests){
							return guests.get($stateParams.id);
						}]
					}
			})


			.state('checklist', {
				url: '/checklist',
				templateUrl: '/checklist.html',
				controller: 'TodoCtrl',
				resolve:{
					checklistPromise: ['checklists', function(checklist){
						return checklists.getAll();
					}]
				}
			})

			.state('login', {
				url: '/login',
				templateUrl: '/login.html',
				controller: 'AuthCtrl',
				onEnter: ['$state', 'authFactory', function($state, authFactory){
					if (authFactory.isLoggedIn()){
						$state.go('home');
					}
				}]
			})

			.state('register', {
					url: '/register',
					templateUrl: '/register.html',
					controller: 'AuthCtrl',
					onEnter: ['$state', 'authFactory', function($state, authFactory){
					if (authFactory.isLoggedIn()){
						$state.go('home');
					}
				}]

			})


	
	}
]);


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


app.controller('NavCtrl', [
	'$scope',
	'authFactory',
	function($scope, authFactory){
		$scope.isLoggedIn = authFactory.isLoggedIn;
		$scope.currentUser = authFactory.currentUser;
		$scope.logOut = authFactory.logOut;
}])

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

