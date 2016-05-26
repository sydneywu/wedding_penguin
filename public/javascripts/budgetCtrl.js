angular.module("WeddingPenguin").controller('BudgetCtrl', 
	function($scope, budgetFactory){

		$scope.users = budgetFactory.query();

		$scope.setDataforUser = function(budgetID){
			$scope.currentUser = budgetFactory.get({budget: userID});
		}

	})