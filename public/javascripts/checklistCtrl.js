angular.module("WeddingPenguin").controller('ChecklistsCtrl', [
'$scope',
'$q',
'$stateParams',
'checklistsFactory',
'authFactory',
'$uibModal',
function($scope, $q, $stateParams, checklistsFactory, authFactory,$uibModal){

	checklistsFactory.getAll();
	$scope.checklists = checklistsFactory.checklists

	$scope.addChecklist = function(){
			
		if(!$scope.checklistName || $scope.checklistName ===""){return;}	//error checking
		checklistsFactory.create({												
			name: $scope.checklistName,
			category: $scope.checklistCategory,
			dueDate: $scope.checklistDuedate,
			user: authFactory.currentUserID()
		});
	}



}])