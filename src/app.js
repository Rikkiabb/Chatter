var ChatApp = angular.module("ChatApp", ['ngRoute', 'angularMoment']);

ChatApp.config(
	function($routeProvider){
		$routeProvider
		.when("/login", {templateUrl: "views/login.html", controller:"HomeController"})
		.when('/rooms/:user/', { templateUrl: 'Views/rooms.html', controller: 'RoomsController' })
		.when('/room/:user/:room/', { templateUrl: 'Views/room.html', controller: 'RoomController' })
		.otherwise({redirectTo: "/login"});
	}
);