var ChatApp = angular.module("ChatApp", ["ngRoute"]);

ChatApp.config(
	function($routeProvider){
		$routeProvider
		.when("/login", {templateUrl: "views/login.html", controller:"HomeController"})
		.otherwise({redirectTo: "/login"});
	}

);


ChatApp.controller('HomeController', function ($scope, socket) {

	$scope.nickname = '';

	$scope.login = function() {			
		if ($scope.nickname === '') {
			console.log("kjadbf");

		} else {
			socket.emit('adduser', $scope.nickname, function (available) {
				if (available) {
					console.log("added user");
				} else {
					console.log("not added user");
				}
			});			
		}

	};
});