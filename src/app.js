var ChatApp = angular.module("ChatApp", ["ngRoute"]);

ChatApp.config(
	function($routeProvider){
		$routeProvider
		.when("/login", {templateUrl: "views/login.html", controller:"HomeController"})
		.when('/rooms/:user/', { templateUrl: 'Views/rooms.html', controller: 'RoomsController' })
		.when('/room/:user/:room/', { templateUrl: 'Views/room.html', controller: 'RoomController' })
		.otherwise({redirectTo: "/login"});
	}
);




ChatApp.controller('RoomsController', function ($scope, $location, $rootScope, $routeParams, socket) {
	// TODO: Query chat server for active rooms
	$scope.rooms = ['Room 1','Room 2','Room 3','Room 4','Room 5'];
	$scope.currentUser = $routeParams.user;
});

ChatApp.controller('RoomController', function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.currentRoom = $routeParams.room;
	$scope.currentUser = $routeParams.user;
	$scope.currentUsers = [];
	$scope.errorMessage = ''

	socket.on('updateusers', function (roomName, users, ops) {
		// TODO: Check if the roomName equals the current room !
		$scope.currentUsers = users;
	});		

	socket.emit('joinroom', $scope.currentRoom, function (success, reason) {
		if (!success)
		{
			$scope.errorMessage = reason;
		}
	});
});