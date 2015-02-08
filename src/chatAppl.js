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

angular.module("MyChatApplication", []);

angular.module("MyChatApplication").controller("HomeController",
["$scope",
	function($scope){
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

// angular.module("MyChatApplication").constant("BACKEND_URL", "http://localhost:8080" );

angular.module("MyChatApplication", ["ngRoute"]).config(function($routeProvider){
	$routingProvider
	.when("/index",{
		templateUrl: "src/index.html",
		controller: "HomeController"
	});
});