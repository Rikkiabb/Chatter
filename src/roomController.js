ChatApp.controller('RoomController', function ($scope, $location, $rootScope, $routeParams, $timeout, socket) {
	$scope.currentRoom = $routeParams.room;
	$scope.currentUser = $routeParams.user;
	$scope.currentTopic = '';
	$scope.currentUsers = [];
	$scope.errorMessage = '';
	$scope.successMessage = '';
	$scope.messages = [];
	$scope.message = '';
	$scope.privmsg = '',
	$scope.privateMessage = [];
	$scope.receiver = '';
	$scope.boolReceiver = false;
	$scope.showprivate = false;
	$scope.showMyMsg = false;
	var objMessage = {
		roomName : $scope.currentRoom,
		msg : $scope.message
	};

	var roomObj = {
		room: $scope.currentRoom,
		pass: undefined
	};

	socket.emit('usersInRoom', $scope.currentRoom);

	// socket.on('receiveUsersInRoom', function (users){
	// 	$scope.currentUsers = users;
		
	// });

	$scope.createPassword = function() {

		if($scope.setPW === undefined){
			$scope.errorMessage = "Please choose a password";
			$timeout(function () { $scope.errorMessage = ''; }, 3000);
		}
		else{
			var passwObj = {
				password: $scope.setPW,
				room: $scope.currentRoom
			};
			console.log("passwObj:", passwObj);
			socket.emit('setpassword', passwObj, function (success){
				if(!success){
					$scope.errorMessage = "Could not set password";
					$timeout(function () { $scope.errorMessage = ''; }, 3000);
				}
			});
			$scope.setPW = '';
		}

	};

	$scope.sendMessage = function() {
		if($scope.message === ''){
			console.log("nothing");
		}
		else{ 
			objMessage.msg = $scope.message;
			socket.emit('sendmsg', objMessage);
		}
		$scope.message = "";
	};

	$scope.partRoom = function() {
		socket.emit('partroom', $scope.currentRoom);
		$location.path('/rooms/'+ $scope.currentUser);
	}

	$scope.showPrivateMsg = function(usernick){
		$scope.showprivate = true;
		$scope.receiver = usernick;
	}

	$scope.sendPrivate = function(){
		var privObj = {
			receiver: $scope.receiver,
			sender: $scope.currentUser,
			message: $scope.privmsg
		};
		//console.log("sendPrivate---->", privObj);
		$scope.showMyMsg = true;
		socket.emit('privatemsg', privObj, function (success){
			if(!success){
				console.log("NEINEINEI");
			}
		});
		$scope.privmsg = "";
	}


	$scope.kickUser = function() {

		var kickObj = {
			user: $scope.kickedUser,
			room: $scope.currentRoom
		};

		socket.emit('kick', kickObj, function (success, reason) {

			if(!success){
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

			if(!success){
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
		socket.emit('op', opObj, function (success, reason) {

			if(!success){
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
			if(!success){
				$scope.errorMessage = reason;
				$timeout(function () { $scope.errorMessage = ''; }, 3000);
			}	
		});
	}

	$scope.setTopic = function () {
		var topicObj = {
			topic: $scope.topicName,
			room: $scope.currentRoom
		};

		socket.emit('settopic', topicObj, function (success) {

			if(!success){
				$scope.errorMessage = "Only admins can set Topic";
				$timeout(function () { $scope.errorMessage = ''; }, 3000);
			}

		});
	}

	socket.on('rec_notification', function (msgObj){
		if($scope.currentUser === msgObj.receiver){
			$scope.successMessage = "You have mail from " + msgObj.sender;
			$timeout(function () { $scope.successMessage = ''; }, 3000);
		}
	});

	socket.on('updatechat', function (roomName, msgHistory){
		$scope.roomName = roomName;
		$scope.msg = msgHistory;
	});

	socket.on('updateusers', function (roomName, users, ops) {	

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

	socket.on('kicked', function (room, kickedUser, admin){

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

	socket.on('servermessage', function(msg, room, user, ops){

		if(user === $scope.currentUser)
		{
			if(msg === "join"){
				if(angular.equals(ops, {})){
					var opObj = {
						user: $scope.currentUser,
						room: $scope.currentRoom
					};
					console.log(opObj);
					socket.emit('op', opObj, function (success, reason) {

						if(!success){
							$scope.errorMessage = reason;
							$timeout(function () { $scope.errorMessage = ''; }, 3000);
						}
					});
				}
			}
			
		}
	});

	socket.on('recv_privatemsg', function (sender, msgObj){
		//console.log("RecPrivate---sender->", sender, "--msgObj-->", msgObj);
		$scope.boolReceiver = true;
		$scope.username = sender;
		$scope.privateMessage = msgObj;
	});	

	socket.on('updatetopic', function (room, topic, admin) {

		if($scope.currentRoom === room){
			$scope.currentTopic = topic;
		}
	});
});
