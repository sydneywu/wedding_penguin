angular.module('WeddingPenguin').controller('TestCtrl', [
	'$scope',
	'$q',
	function($scope,$q){

		function add(x, y){
			var q = $q.defer();
			setTimeout(function(){
				var result = x + y;
				if(result >=0){
					q.resolve(x+y);
				}else{
					q.reject('negative value: ' + result);
				}
			}, 100);
			return q.promise
		}




		var startTime = Date.now();
		add(5, -2).then(function(result){
			$scope.result = result;
			$scope.elapsedTime = Date.now()- startTime;
		});



			

}])