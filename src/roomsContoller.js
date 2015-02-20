ChatApp.controller('RoomsController', function ($scope, $location, $rootScope, $routeParams, $timeout, socket, toaster) {
	// TODO: Query chat server for active rooms
	$scope.rooms = {};
	$scope.users = [];
	$scope.currentUser = $routeParams.user;
	$scope.showInput = false;
	$scope.errorMessage = '';
	$scope.roomObj = [];


	socket.on('roomlist', function(list){		
		$scope.rooms = Object.keys(list);
		//console.log($scope.rooms);			
	});

	socket.emit('rooms');
	socket.emit('users');

	$scope.showInp = function () {
		$scope.showInput = !$scope.showInput;
	};

	$scope.createRoom = function($event){
		if($event !== undefined){
			if($event.keyCode !== 13){
				return;
			}	
		}

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
		
		if($event !== undefined){
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

	$scope.disconnUser = function () {

		socket.emit('disco-nect');
		socket.emit('users');
		$location.path('/login');
	};

	socket.on('roomlist', function(list){
		$scope.roomObj = list;
		$scope.rooms = Object.keys(list);
				
	});

	socket.on('userlist', function (users) {
		$scope.users = users;
	});

	socket.on('servermessage', function(msg, room, kickedUser){

		if(kickedUser === $scope.currentUser)
		{
			if(msg === "kick"){
				
				toaster.pop('error', 'You have been kicked! Out of ' + room);
			}
			else if(msg === "ban"){
				toaster.pop('error', 'NOOOOOOO!', 'You have been banned! From ' + room);
			}	
		}
	});
});





