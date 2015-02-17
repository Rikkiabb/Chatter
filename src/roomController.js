ChatApp.controller('RoomController', function ($scope, $location, $rootScope, $routeParams, $timeout, socket) {
	$scope.currentRoom = $routeParams.room;
	$scope.currentUser = $routeParams.user;
	$scope.currentUsers = [];
	$scope.errorMessage = '';
	$scope.successMessage = '';
	$scope.messages = [];
	$scope.message = '';
	var objMessage = {
		roomName : "lobby",
		msg : $scope.message
		
	};

	var roomObj = {
		room: $scope.currentRoom,
		pass: undefined
	};
	socket.emit('joinroom', roomObj, function(success, reason){
		if(success){
			socket.emit('rooms');
		}
		else{
			$scope.errorMessage = reason;
		}
	});

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

	$scope.partRoom = function() {
		socket.emit('partroom', $scope.currentRoom);
		$location.path('/rooms/'+ $scope.currentUser);
	}

	$scope.kickUser = function() {

		var kickObj = {
			user: $scope.kickedUser,
			room: $scope.currentRoom
		};

		socket.emit('kick', kickObj, function (success, reason) {

			if(success){

			}
			else{
				$scope.errorMessage = reason;
				$timeout(function () { $scope.errorMessage = ''; }, 3000);
			}
		});
	}

	$scope.banUser = function() {

		var banObj = {
			user: $scope.bannedUser,
			room: $scope.currentRoom
		};

		socket.emit('ban', banObj, function (success, reason) {

			if(success){

			}
			else{
				$scope.errorMessage = reason;
				$timeout(function () { $scope.errorMessage = ''; }, 3000);
			}
		});
	}

	$scope.unBanUser = function() {

		var unBanObj = {
			user: $scope.unBannedUser,
			room: $scope.currentRoom
		};

		socket.emit('unban', unBanObj, function (success) {

			if(success){
				$scope.successMessage = "Successfully unbanned " + unBanObj.user;
				$timeout(function () { $scope.successMessage = ''; }, 3000);
			}
			else{
				$scope.errorMessage = "Unban unsuccessfull";
				$timeout(function () { $scope.errorMessage = ''; }, 3000);
			}
		});
	}

	$scope.opUser = function () {
		var opObj = {
			user: $scope.oppedUser,
			room: $scope.currentRoom
		};
		console.log(opObj);
		
		socket.emit('op', opObj, function (success, reason) {

			if(success){

			}
			else{
				$scope.errorMessage = reason;
				$timeout(function () { $scope.errorMessage = ''; }, 3000);
			}
		
		});
	
	}

	$scope.deOpUser = function () {
		var deOpObj = {
			user: $scope.deOppedUser,
			room: $scope.currentRoom
		};
		
		socket.emit('deop', deOpObj, function (success, reason) {

			if(success){

			}
			else{
				$scope.errorMessage = reason;
				$timeout(function () { $scope.errorMessage = ''; }, 3000);
			}
		
		});
	
	}
	
	socket.on('updatechat', function (roomName, msgHistory){
		$scope.roomName = roomName;
		$scope.msg = msgHistory;
		console.log("updatechat!!!!");
	});
	socket.on('cons', function (roomName, msgHistory){
		console.log("<--------cool");		
	})

	socket.on('updateusers', function (roomName, users, ops) {	
		console.log("UPDATE USERS");
		if($scope.currentRoom === roomName){
			$scope.currentUsers = users;
		}

		if($scope.currentUser === ops[$scope.currentUser]){
			$scope.op = true;
		}
		else{
			$scope.op = false;
		}
	});

	socket.on('kicked', function(room, kickedUser, admin){

		if($scope.currentUser === kickedUser){
			$location.path('/rooms/'+ $scope.currentUser);
		}
		else if($scope.currentUser === admin){
			$scope.successMessage = "Successfully kicked " + kickedUser;
			$timeout(function () { $scope.successMessage = ''; }, 3000);
		}
	});

	socket.on('banned', function(room, bannedUser, admin){

		if($scope.currentUser === bannedUser){
			$location.path('/rooms/'+ $scope.currentUser);
		}
		else if($scope.currentUser === admin){
			$scope.successMessage = "Successfully banned " + bannedUser;
			$timeout(function () { $scope.successMessage = ''; }, 3000);
		}
	});

	socket.on('opped', function (room, oppedUser, admin) {

		if($scope.currentUser === admin){
			$scope.successMessage = "Successfully opped " + oppedUser;
			$timeout(function () { $scope.successMessage = ''; }, 3000);
		}
		else if($scope.currentUser === oppedUser){
			$scope.op = true;
			$scope.successMessage = "You were opped by " + admin + " CONGRATULATIONS!";
			$timeout(function () { $scope.successMessage = ''; }, 3000);
		}
	});

	socket.on('deopped', function (room, deOppedUser, admin) {

		if($scope.currentUser === admin){
			$scope.successMessage = "Successfully deopped " + deOppedUser;
			$timeout(function () { $scope.successMessage = ''; }, 3000);
		}
		else if($scope.currentUser === deOppedUser){
			$scope.op = false;
			$scope.errorMessage = "You were deopped by " + admin + ", SORRY:(";
			$timeout(function () { $scope.errorMessage = ''; }, 3000);
		}
	});		
});
