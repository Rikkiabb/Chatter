ChatApp.controller('RoomController', function ($scope, $location, $rootScope, $routeParams, socket) {
	$scope.currentRoom = $routeParams.room;
	$scope.currentUser = $routeParams.user;
	$scope.currentUsers = [];
	$scope.errorMessage = '';
	$scope.messages = [];
	$scope.message = '';
	$scope.privmsg = '',
	$scope.privateMessage = [];
	$scope.reciever = '';
	$scope.boolReceiver = false;
	$scope.showprivate = false;
	$scope.showMyMsg = false;
	var objMessage = {
		roomName : $scope.currentRoom,
		msg : $scope.message
	};

	var obj = {
		room: $scope.currentRoom,
		pass: undefined
	};

	socket.emit('joinroom', obj, function(success, reason){
		if(!success){
			$scope.errorMessage = reason;
		}

	});

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
		$scope.reciever = usernick;
	}

	$scope.sendPrivate = function(){
		var privObj = {
			nick: $scope.reciever,
			message: $scope.privmsg
		};
		console.log("sendPrivate---->", privObj);
		$scope.showMyMsg = true;
		socket.emit('privatemsg', privObj, function(success){
			if(!success){
				console.log("NEINEINEI");
			}
		});
		$scope.privmsg = "";
	}

	socket.on('recv_privatemsg', function (sender, msgObj){
		console.log("RecPrivate---sender->", sender, "--msgObj-->", msgObj);
		$scope.boolReceiver = true;
		$scope.username = sender;
		$scope.privateMessage = msgObj;
	});

	socket.on('updatechat', function (roomName, msgHistory){
		$scope.roomName = roomName;
		$scope.msg = msgHistory;
	});

	//socket.emit('cons', "", "")
	socket.on('cons', function (roomName, msgHistory){
		console.log("<--------cool");		
	})

	socket.on('updateusers', function (roomName, users, ops) {	
		$scope.currentUsers = users;
	});		
});
