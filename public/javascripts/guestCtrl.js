angular.module('WeddingPenguin').controller('GuestsCtrl', [
	'$scope',
	'$q',
	'$stateParams',
	'$uibModal',
	'guestsFactory',
	'guestTablesFactory',
	'authFactory',
	function($scope, $q, $stateParams, $uibModal, guestsFactory, guestTablesFactory, authFactory){

		$scope.totalTables = 5;
		$scope.getNumber= function(num){
			 return new Array(num);
		}

		$scope.guestSorter = ['table', 'relation']	//require for ngOption to work



		$scope.tableTest = [
			{"number": 1, "name": "VIP"},
			{"number": 2, "name": "Friends"},
			{"number": 3, "name": "Secondary"},
			{"number": 4, "name": "Four"},
			{"number": 6, "name": "Six"},
			{"number": 10, "name": "Ten"}
		]

		$scope.matchTable = function(tableNo){ //This function is for display of table name based on the table no.
			var lookup = {};
			for (var i =0, len = $scope.tableTest.length; i<len; i++){
				lookup[$scope.tableTest[i].number] = $scope.tableTest[i];
			} //this function creates another object which has a key equals to the array's number.
			// e.g. {"number":1, "name": "VIP"} will become {1: {"number:1", "name":"VIP"}}
			// The purpose is similar to jquery grep function.
			return lookup[tableNo].name;
		}

		$scope.currentUserID = authFactory.currentUserID;

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

		$scope.tableSettings = function(){
			var ModalInstance = $uibModal.open({
				templateUrl: 'table_settings.html',
				controller: 'ModalInstanceTableCtrl',
				size: 'lg',
				/*resolve: {
			        guestPromise: ['guestsFactory', function(guests){
						return guests.get(params._id);
					}]
			     }*/
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
			guestsFactory.update($scope.guest, {
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
			guestsFactory.update($scope.guest, {
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

		$scope.close = function () {
			$uibModalInstance.close();
		};

}]);

app.controller('ModalInstanceTableCtrl', [
	'$scope',
	'$uibModalInstance',
	'$stateParams',
	'guestTablesFactory',
	function ($scope, $uibModalInstance, $stateParams, guestTablesFactory) {

		$scope.close = function () {
			$uibModalInstance.close();
		};

		guestTablesFactory.getAll();
		$scope.tables = guestTablesFactory.tables;

		$scope.addTable = function(){
			guestTablesFactory.create({												
				number: 1,
				name: 'test2'
			});
		}

		$scope.testUpdateTable = function(){
			guestTablesFactory.update({												
				number: 1,
				name: 'test2'
			});
		}

		$scope.setTableNo = function(){

			var input = $scope.userTableNo
			if(input != parseInt(input,10) || input > 500 || input < 1){		//error checking
				console.log('invalid input'); 
				return;
			}

			for (var i = 0; i < input; i++){
				console.log(i+1);
				
				/*guestTablesFactory.update({												
					name: $scope.guestName,
					relation: $scope.guestRelation,
					table: $scope.guestTable,
					user: authFactory.currentUserID()
				});*/
			}
		}

}]);