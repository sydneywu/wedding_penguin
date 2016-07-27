vendorApp = angular.module('WeddingVendor', [
	'ui.router', 
	'ngAnimate', 
	'ui.bootstrap', 
	'angular.filter', 
	'ngResource']);

vendorApp.controller('VendorNavCtrl'),[
	'$scope',
	'vendorFactory',
	function($scope, vendorFactory){
		$scope.isLoggedIn = vendorFactory.isLoggedIn;
		$scope.currentVendor = vendorFactory.currentVendor;
		$scope.logOut = vendorFactory.logOut;
	}
]

vendorApp.controller('VendorCtrl',[
	'$scope',
	'$state',
	'vendorFactory',
	'$http',
	'$window',
	function($scope, $state, vendorFactory, $http, $window){
		
		/*$scope.vendor = {};*/

		$scope.register = function(){
			vendorFactory.register($scope.vendor).error(function(error){
				$scope.error = error;
			}).then(function(){
				$window.location.href = '/vendor/profile';			//tbf (to be fixed)
			})
		}

		$scope.login = function(){
			vendorFactory.login($scope.vendor).error(function(error){
				$scope.error = error;
			}).then(function(){
				$window.location.href = '/vendor/profile';			//tbf
			});		
		};
}])

vendorApp.controller('VendorProfileCtrl',[
	'$scope',
	'$stateParams',
	'vendorFactory',
	'vendorProfileFactory',
	'vendorInterceptor',
	'$http',
	function($scope, $stateParams, vendorFactory, vendorProfileFactory, vendorInterceptor, $http){
		
		var getVendor = function(){
			var promise = vendorProfileFactory.getProfile();

			promise.then(function(result){
				$scope.vendor=result;
			})
		}

		getVendor();

		$scope.categories = ["Category", "Venue", "Bridal", "Photographer", "Videographer"];

		$scope.updateVendor = function(){
			vendorProfileFactory.update($scope.vendor, {
				_id: $scope.vendor._id,
				username: $scope.vendor.username,
				email: $scope.vendor.email,
				phone: $scope.vendor.phone,
				website: $scope.vendor.website,
				category: $scope.vendor.category
			})
		};

		$scope.addGallery = function(){
			vendorProfileFactory.createGallery($scope.vendor, {
				galleryName: $scope.vendor.galleryName
			})

			getVendor();
		};

		$scope.uploadAvatarPic = function(){

	        var file = $scope.myFile;	//use the directive fileModel to bind the file
	        var uploadURL = "photos/avatar/";
	        var fd = new FormData();
	        fd.append('file', file);

	        vendorProfileFactory.uploadImage(uploadURL, fd);

	    };

	   	$scope.uploadShowcasePic = function(){

	        var file = $scope.myFile;	//use the directive fileModel to bind the file
	        var uploadURL = "photos/showcase/";
	        var fd = new FormData();
	        fd.append('file', file);

	        vendorProfileFactory.uploadImage(uploadURL, fd);

	    };

}]);

/* Directive to bind image files to variables to the controller. NG-model not working for type=myfile */
angular.module('WeddingVendor').directive('fileModel', ['$parse', function ($parse) {
return {			
    restrict: 'A',
    link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
            });
        });
    }
};
}]);

