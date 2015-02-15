ChatApp.controller('HomeController', function ($scope, $location, $rootScope, $routeParams, socket) {

	$scope.nickname = '';
	$scope.errorMessage = '';

	$scope.login = function() {			
		if ($scope.nickname === '') {
			$scope.errorMessage = 'Please choose a nick-name before continuing!';

		} else {
			socket.emit('adduser', $scope.nickname, function (available) {
				if (available) {
					$location.path('/rooms/' + $scope.nickname);
				} else {
					$scope.errorMessage = 'This nick-name is already taken!';
				}
			});			
		}
	};
});