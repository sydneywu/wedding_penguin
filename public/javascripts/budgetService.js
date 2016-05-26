angular.module("WeddingPenguin").factory('budgetFactory', function($resource){
	return $resource('/budget/api/budget/:budget', {budget: '@budget'});
});