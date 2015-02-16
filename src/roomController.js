ChatApp.controller('RoomController', function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.currentRoom = $routeParams.room;
	$scope.currentUser = $routeParams.user;
	$scope.currentUsers = [];
	$scope.errorMessage = '';
	$scope.messages = [];
	$scope.message = '';
	var objMessage = {
		roomName : "lobby",
		msg : $scope.message
		
	};
	$scope.sendMessage = function() {
		console.log($scope.message, "<-------");
		if($scope.message === ''){
			console.log("nothing");
		}
		else{ 
			objMessage.msg = $scope.message;
			//console.log(objMessage, "----");
			//console.log($routeParams.room, "---");
			socket.emit('sendmsg', objMessage);
		}
		$scope.message = "";
	};

	socket.on('updatechat', function (roomName, msgHistory){
		$scope.roomName = roomName;
		$scope.msg = msgHistory;
		console.log("updatechat!!!!");
	});
	socket.on('cons', function (roomName, msgHistory){
		console.log("<--------cool");		
	})

	socket.on('updateusers', function (roomName, users, ops) {	
		$scope.currentUsers = users;
	});		
	socket.emit('joinroom', $scope.currentRoom, function (success, reason) {
		if (!success)
		{
			$scope.errorMessage = reason;
		}
	});
});