ChatApp.controller('RoomController', function ($scope, $location, $rootScope, $routeParams, socket, toaster) {
	$scope.currentRoom = $routeParams.room;
	$scope.currentUser = $routeParams.user;
	$scope.currentTopic = '';
	$scope.currentUsers = [];
	$scope.errorMessage = '';
	$scope.successMessage = '';
	$scope.messages = [];
	$scope.message = '';
	$scope.privmsg = '';
	$scope.privateMessage = [];
	$scope.receiver = '';
	$scope.boolReceiver = false;
	$scope.showprivate = false;
	$scope.showMyMsg = false;
	$scope.showTopic = false;
	$scope.showPw = false;
	$scope.isPassSet = false;
	$scope.isTopicSet = false;

	//Update the roomslist in roomsController, if user creates room.
	socket.emit('rooms');
	//Send newUser message to server if newUser joins room.
	socket.emit('newUser', $scope.currentRoom);


	socket.emit('passSetTrueFalse', $scope.currentRoom);

	socket.on('recPassSetTrueFalse', function (bool){
		$scope.isPassSet = bool;
	});

	$scope.createPassword = function($event) {

		//Not perform check if mouse clicked.
		if($event !== undefined){
			//Check if keydown is enter
			if($event.keyCode !== 13){
				return;
			}	
		}

		//Stop user from creating empty password.
		if($scope.setPW === undefined){
			toaster.pop('error', 'Error!', 'Please choose a password!');
			return;
		}
		else{
			
			var passwObj = {
				password: $scope.setPW,
				room: $scope.currentRoom
			};
			
			socket.emit('setpassword', passwObj, function (success){
				if(!success){
					toaster.pop('error', 'Error!', 'Could not set password!');
				}
				else{
					
					//Display remove password button.
					$scope.isPassSet = true;
					toaster.pop('success', 'Well done!', 'Successfully changed the password');
				}
			});
			//Lock the room in the rooms controller.
			socket.emit('rooms');
			$scope.setPW = '';
		}

	};

	$scope.removePass = function(){
		var passwObj = {
			room: $scope.currentRoom
		};
		socket.emit('removepassword', passwObj, function (success){
			if(!success){ 
				toaster.pop('error', 'Error!', 'Could not remove password!');
			}
			else{
				
				//Display the set password button.
				$scope.isPassSet = false;
				
				//Unlock the room in the roomsController.
				socket.emit('rooms');
				toaster.pop('success', 'Well done!', 'Successfully removed the password');
			}
		});
		$scope.setPW = '';
	};

	$scope.sendMessage = function($event) {
		//Not perform check if mouse clicked.
		if($event !== undefined){
			//Check if keydown is enter.
			if($event.keyCode !== 13){
				return;
			}	
		}

		//Is not valid of length > 200 chars.
		if($scope.messageForm.$valid){
		
			if($scope.message !== ''){ 
				
				var objMessage = {
					roomName : $scope.currentRoom,
					msg : $scope.message
				};
				
				socket.emit('sendmsg', objMessage);
				//Only empty input if it's valid.
				$scope.message = "";
			}

		}
		else{
			toaster.pop('error', 'Error!', 'Your message cannot be longer than 200 characters!');
		}
		
	};

	$scope.partRoom = function() {
		//Leave room.
		socket.emit('partroom', $scope.currentRoom);
		$location.path('/rooms/'+ $scope.currentUser);
	};

	$scope.showPrivateMsg = function(usernick){
		$scope.showprivate = true;
		$scope.receiver = usernick;
	};

	$scope.sendPrivate = function($event){
		//Not perform check if mouse clicked.
		if($event !== undefined){
			//Check if keydown is enter.
			if($event.keyCode !== 13){
				return;
			}	
		}

		var privObj = {
			receiver: $scope.receiver,
			sender: $scope.currentUser,
			message: $scope.privmsg
		};
		
		$scope.showMyMsg = true;
		socket.emit('privatemsg', privObj, function (success){
			if(!success){
			
				toaster.pop('error', 'Error!', 'Sending message failed!');
				
			}
		});
		$scope.privmsg = "";
	};


	$scope.kickUser = function(user) {
		
		var kickObj = {
			user: user,
			room: $scope.currentRoom
		};

		socket.emit('kick', kickObj, function (success, reason) {

			if(!success){
				toaster.pop('error', 'Error!', reason);
			}
		});
	};

	$scope.banUser = function(user) {

		var banObj = {
			user: user,
			room: $scope.currentRoom
		};

		socket.emit('ban', banObj, function (success, reason) {

			if(!success){
				toaster.pop('error', 'Error!', reason);
			}
		});
	};

	$scope.unBanUser = function(user) {

		var unBanObj = {
			user: user,
			room: $scope.currentRoom
		};

		socket.emit('unban', unBanObj, function (success) {

			if(success){
				toaster.pop('success', 'YES!', 'Successfully unbanned ' + unBanObj.user);
			}
			else{
				toaster.pop('error', 'Error!', 'Unban unsuccessfull!');
			}
		});
	};

	$scope.opUser = function (user) {
		
		var opObj = {
			user: user,
			room: $scope.currentRoom
		};
		socket.emit('op', opObj, function (success, reason) {

			if(!success){
				toaster.pop('error', 'Error!', reason);
			}
		});
	};

	$scope.deOpUser = function (user) {
		
		var deOpObj = {
			user: user,
			room: $scope.currentRoom
		};
		
		socket.emit('deop', deOpObj, function (success, reason) {
			if(!success){
				toaster.pop('error', 'Error!', reason);
			}	
		});
	};

	$scope.showPass = function () {
		
		//Show create password input field and button.
		$scope.showPw = !$scope.showPw;
	};

	$scope.showTop = function () {
		
		//Show create topic input field and button.
		$scope.showTopic = !$scope.showTopic;
		$scope.isTopicSet = true;

	};

	$scope.setTopic = function ($event) {
		
		//Not perform check if mouse clicked.
		if($event !== undefined){
			//Check if keydown if enter.
			if($event.keyCode !== 13){
				return;
			}	
		}

		//Prevent user from creating an empty topic.
		if($scope.topicName === undefined){
			toaster.pop('error', 'Error!', 'Topic cannot be empty!');
			return;
		}
		
		var topicObj = {
			topic: $scope.topicName,
			room: $scope.currentRoom
		};

		socket.emit('settopic', topicObj, function (success) {

			if(!success){
				toaster.pop('error', 'Error!', 'Only admins can set a topic!');
			}
		});

		$scope.topicName = '';
		$scope.isTopicSet = false;
		$scope.showTopic = false;

	};

	$scope.disconnUser = function () {

		//Disconnect user.
		socket.emit('disco-nect');
		//Update userslist in roomsController.
		socket.emit('users');
		$location.path('/login');
	};

	socket.on('rec_notification', function (msgObj){
		
		//Let the receiver know that he got a message.
		if($scope.currentUser === msgObj.receiver){
			toaster.pop('info', 'Mail!', "You've got mail from " + msgObj.sender);
		}
	});

	socket.on('updatechat', function (roomName, msgHistory){
		$scope.roomName = roomName;
		$scope.msg = msgHistory;
	});

	socket.on('updateusers', function (roomName, users, ops, banned) {	

		//Only update room were user joined.
		if($scope.currentRoom === roomName){
			$scope.currentUsers = users;
		}

		//For op, opperations to be viewed.
		if($scope.currentUser === ops[$scope.currentUser]){
			$scope.op = true;
		}
		else{
			$scope.op = false;
		}
		//Get opped users.
		$scope.ops = ops;
		//Get banned users.
		$scope.banned = banned;
	});

	socket.on('kicked', function (room, kickedUser, admin){

		if($scope.currentUser === kickedUser){
			//Redirect kicked user
			$location.path('/rooms/'+ $scope.currentUser);
		}
		else if($scope.currentUser === admin){
			//Let admin know.
			toaster.pop('success', 'ROUNDHOUSE!', 'Successfully kicked ' + kickedUser);
		}
	});

	socket.on('banned', function(room, bannedUser, admin){

		if($scope.currentUser === bannedUser){
			//Redirect banned user.
			$location.path('/rooms/'+ $scope.currentUser);
		}
		else if($scope.currentUser === admin){
			//Let admin know.
			toaster.pop('success', 'YES!', 'Successfully banned ' + bannedUser);

		}
	});

	socket.on('opped', function (room, oppedUser, admin) {

		if($scope.currentUser === admin){
			toaster.pop('success', 'YES!', 'Successfully opped ' + oppedUser);
		}
		else if($scope.currentUser === oppedUser){
			//Let the opped user have the admin view.
			$scope.op = true;
			toaster.pop('success', 'YES!', 'You were opped by ' + admin + ' CONGRATULATIONS!');
		}
	});

	socket.on('deopped', function (room, deOppedUser, admin) {

		if($scope.currentUser === admin){
			toaster.pop('success', 'YES!', 'Successfully deopped ' + deOppedUser);
		}
		else if($scope.currentUser === deOppedUser){
			//Remove the admin view from the deopped user.
			$scope.op = false;
			toaster.pop('error', 'NO!', 'You were deopped by ' + admin + ', SORRY:(');

		}
	});

	socket.on('servermessage', function(msg, room, user, ops){

		//Check if user is the user entering the room.
		if(user === $scope.currentUser)
		{
			if(msg === "join"){
				//Check if there are no admins.
				if(angular.equals(ops, {})){
					var opObj = {
						user: $scope.currentUser,
						room: $scope.currentRoom
					};
					//Op user entering room.
					socket.emit('op', opObj, function (success, reason) {

						if(!success){
							
							toaster.pop('error', 'Error!', reason);
						}
					});
				}
			}
			
		}
	});

	socket.on('recv_privatemsg', function (sender, msgObj){
		
		$scope.boolReceiver = true;
		$scope.username = sender;
		$scope.privateMessage = msgObj;
	});	

	socket.on('updatetopic', function (room, topic, admin) {

		//Only update topic with room updating it's topic.
		if($scope.currentRoom === room){
			$scope.currentTopic = topic;
		}
	});
});
