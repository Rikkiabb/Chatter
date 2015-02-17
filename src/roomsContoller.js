ChatApp.controller('RoomsController', function ($scope, $location, $rootScope, $routeParams, socket) {
	// TODO: Query chat server for active rooms
	$scope.rooms = {};
	$scope.currentUser = $routeParams.user;
	$scope.showInput = false;
	$scope.errorMessage = '';
	
	socket.emit('rooms');


	$scope.createRoom = function(){
		var obj = {
			room: $scope.roomName,
			pass: undefined
		};
		socket.emit('joinroom', obj  ,function (success, reason) {
			if (success){
				$location.path('/room/' + $scope.currentUser + '/' + obj.room);
			}
			else{
				$scope.errorMessage = reason;
			}
		});
		
	};

	$scope.joinRoom = function(currRoom){
		var obj = {
			room: currRoom,
			pass: undefined
		};
		socket.emit('joinroom', obj, function (success, reason) {
			if(success){
				$location.path('/room/' + $scope.currentUser + '/' + obj.room);
			}
			else{
				$scope.errorMessage = reason;
			}
		});

	};

	socket.on('roomlist', function(list){
				
		$scope.rooms = Object.keys(list);
				
	});

	socket.on('servermessage', function(msg, room, kickedUser){
		if(msg == "kick"){

			if(kickedUser === $scope.currentUser)
			{
				$scope.errorMessage = "You have been kicked out of " + room;
				$timeout(function () { $scope.errorMessage = ''; }, 4000);
			}
				
		}
		
		
	});



});