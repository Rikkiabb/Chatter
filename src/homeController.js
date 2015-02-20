ChatApp.controller('HomeController', function ($scope, $location, $rootScope, $routeParams, socket, toaster) {

	$scope.username = '';
	$scope.errorMessage = '';

	$scope.login = function($event) {			
		
		if($event !== undefined){
			if($event.keyCode !== 13){
				return;
			}	
		}
		
		if ($scope.username === '') {
			toaster.pop('error', 'Error!', 'Please choose a username before continuing!');

		} else {
			socket.emit('adduser', $scope.username, function (available) {
				if (available) {
					$location.path('/rooms/' + $scope.username);
					$scope.username = '';
				} else {
					toaster.pop('error', 'Error!', 'This username is already taken!');

				}
			});			
		}


	};
});