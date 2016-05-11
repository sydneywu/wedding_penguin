angular.module('WeddingPenguin').controller('GuestsCtrl', [
	'$scope',
	'$stateParams',
	'guestsFactory',
	'$uibModal',
	function($scope, $stateParams, guestsFactory, $uibModal){

		$scope.guests = guestsFactory.guests;

		$scope.addGuest = function(){
			if(!$scope.guestName || $scope.guestName ===""){return;}	//error checking
			guestsFactory.create({												
				name: $scope.guestName,
				relation: $scope.guestRelation,
				table: $scope.guestTable,
				user: $scope.guestUser
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