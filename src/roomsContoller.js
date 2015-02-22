ChatApp.controller('RoomsController', function ($scope, $location, $rootScope, $routeParams, socket, toaster) {
	// TODO: Query chat server for active rooms
	$scope.rooms = {};
	$scope.users = [];
	$scope.currentUser = $routeParams.user;
	$scope.showInput = false;
	$scope.errorMessage = '';
	$scope.roomObj = [];

	//Get updated roomlist.
	socket.emit('rooms');
	//Get updated userslist.
	socket.emit('users');

	$scope.showInp = function () {
		$scope.showInput = !$scope.showInput;
	};


	$scope.createRoom = function($event){
		
		//Not perform check if mouse clicked.
		if($event !== undefined){
			//Check if keydown is enter
			if($event.keyCode !== 13){
				return;
			}	
		}

		//Stop user from creating room with no name.
		if($scope.roomName === undefined){
			
			toaster.pop('error', 'Error!', 'Please choose a room name');
		}
		else{
			var obj = {
				room: $scope.roomName,
				pass: undefined
			};
			socket.emit('joinroom', obj  ,function (success, reason) {
				if (success){
					$location.path('/room/' + $scope.currentUser + '/' + obj.room);
				}
				else{
					toaster.pop('error', 'Error!', reason);
				}
			});
		}

		$scope.roomName = '';
	};

	$scope.joinRoom = function(currRoom, roomPassword, $event){
		
		//Not perform check if mouse clicked.
		if($event !== undefined){
			//Check if keydown is enter.
			if($event.keyCode !== 13){
				return;
			}	
		}

		var obj = {
			room: currRoom,
			pass: roomPassword
		};
		socket.emit('joinroom', obj, function (success, reason) {
			if(success){
				$location.path('/room/' + $scope.currentUser + '/' + obj.room);
			}
			else{
				toaster.pop('error', 'Error!', reason);
			}
		});

		$scope.roomPassword = '';
	};

	//Called if user signs out.
	$scope.disconnUser = function () {

		//Disconnect user.
		socket.emit('disco-nect');
		//Update users.
		socket.emit('users');
		//
		$location.path('/login');
	};

	//Listen for updated roomlist.
	socket.on('roomlist', function(list){		
		$scope.rooms = Object.keys(list);
		$scope.roomObj = list;			
	});


	//Listen for update userslist.
	socket.on('userlist', function (users) {
		$scope.users = users;
	});

	//To let user now if he was kicked or banned.
	socket.on('servermessage', function(msg, room, kickedUser){

		if(kickedUser === $scope.currentUser)
		{
			if(msg === "kick"){
				
				toaster.pop('error', 'ROUNDHOUSE!', 'You have been kicked! Out of ' + room);
			}
			else if(msg === "ban"){
				toaster.pop('error', 'NOOOOOOO!', 'You have been banned! From ' + room);
			}	
		}
	});


});





