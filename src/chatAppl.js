var dummyServer = {
	serverNames : [],
	contains : function(name){
		for(var i = 0; i < this.serverNames.length; i++){
			if(name === this.serverNames[i]){
				return true;
			}
		}
		return false;
	}
};

var chatAppl = angular.module("MyChatApplication", ["ngRoute"]);

chatAppl.controller("HomeController",
["$scope", "$http",
	function($scope, $http){
		console.log("aaa");
		$scope.taken = false;
		$scope.name = "Enter your name";
		$scope.logIn = function logIn(){
			if(dummyServer.contains($scope.name)){
				$scope.taken = true;
			}
			else{
				dummyServer.serverNames.push($scope.name);
				$scope.taken = false;
			}
		console.log($scope.taken);
		};
}]);


chatAppl.config(function($routeProvider){
	$routeProvider
	.when("/index",{
		templateUrl: "src/index.html",
		controller: "HomeController"
	});
});