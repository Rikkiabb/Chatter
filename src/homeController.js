ChatApp.controller('HomeController', function ($scope, $location, $rootScope, $routeParams, socket) {

	$scope.username = '';
	$scope.errorMessage = '';

	$scope.login = function($event) {			
		
		if($event !== undefined){
			if($event.keyCode !== 13){
				return;
			}	
		}
		
		if ($scope.username === '') {
			$scope.errorMessage = 'Please choose a username before continuing!';

		} else {
			socket.emit('adduser', $scope.username, function (available) {
				if (available) {
					$location.path('/rooms/' + $scope.username);
					$scope.username = '';
				} else {
					$scope.errorMessage = 'This username is already taken!';

				}
			});			
		}


	};
});