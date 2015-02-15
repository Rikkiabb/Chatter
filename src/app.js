var ChatApp = angular.module("ChatApp", ["ngRoute"]);

ChatApp.config(
	function($routeProvider){
		$routeProvider
		.when("/index", {templateUrl: "index.html", controller:"HomeController"})
		.otherwise({redirectTo: "/index"});
	}

);

ChatApp.controller("HomeController", function($scope){
	$scope.message = "Hello World!";
	$scope.shown = true;
});
