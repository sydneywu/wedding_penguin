angular.module('WeddingPenguin').controller('GuestsCtrl', [
	'$scope',
	'$q',
	'$stateParams',
	'$uibModal',
	'guestsFactory',
	'authFactory',
	function($scope, $q, $stateParams, $uibModal, guestsFactory, authFactory){

		$scope.totalTables = 5;
		$scope.getNumber= function(num){
			 return new Array(num);
		}
		$scope.currentUserID = authFactory.currentUserID;
		var greetings = function(){return 'hello'};
		//$scope.currentUserID = greetings;

		guestsFactory.getAll();			//run the function to get all guests
		$scope.guests = guestsFactory.guests;

		$scope.addGuest = function(){

			if(!$scope.guestName || $scope.guestName ===""){return;}	//error checking
			guestsFactory.create({												
				name: $scope.guestName,
				relation: $scope.guestRelation,
				table: $scope.guestTable,
				user: authFactory.currentUserID()
			});
		}

		$scope.editGuest = function(params) {

		    var modalInstance = $uibModal.open({
		      animation: $scope.animationsEnabled,
		      templateUrl: 'guest_details.html',
		      controller: 'ModalInstanceGuestCtrl',
		      size: 'lg',
		      resolve: {
		        guestPromise: ['guestsFactory', function(guests){
					return guests.get(params._id);
				}]
		      }
		    });
		}

			

}])

.controller('GuestCtrl', [
	'$scope',
	'$stateParams',
	'guestsFactory',
	'guestPromise',
	function($scope, $stateParams, guestsFactory, guestPromise){
		
		
		$scope.guest=guestPromise;

		$scope.updateGuest = function(){
			guestsFactory.update1($scope.guest, {
				name: $scope.guest.name,
				relation: $scope.guest.relation,
				table: $scope.guest.table,
				user: $scope.guest.user
			})
		}

		$scope.deleteGuest = function(){
			console.log ($scope.guest);
			guestsFactory.delete($scope.guest);
		}
	}
])

app.controller('ModalInstanceGuestCtrl', [
	'$scope',
	'$uibModalInstance',
	'$stateParams',
	'guestsFactory',
	'guestPromise',
	function ($scope, $uibModalInstance, $stateParams, guestsFactory, guestPromise) {

		$scope.guest=guestPromise;

		$scope.updateGuest = function(){
			guestsFactory.update1($scope.guest, {
				name: $scope.guest.name,
				relation: $scope.guest.relation,
				table: $scope.guest.table,
				user: $scope.guest.user
			})
		}

		$scope.deleteGuest = function(){
			console.log ($scope.guest);
			guestsFactory.delete($scope.guest);
		}
	
		$scope.items = [1,2,3];
		$scope.selected = {
		item: $scope.items[0]
		};

		$scope.ok = function () {
		$uibModalInstance.close($scope.selected.item);
		};

		$scope.cancel = function () {
		$uibModalInstance.dismiss('cancel');
		};

}]);