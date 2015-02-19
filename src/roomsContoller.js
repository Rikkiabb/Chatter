ChatApp.controller('RoomsController', function ($scope, $location, $rootScope, $routeParams, $timeout, socket) {
	// TODO: Query chat server for active rooms
	$scope.rooms = {};
	$scope.currentUser = $routeParams.user;
	$scope.showInput = false;
	$scope.errorMessage = '';
	$scope.roomObj = [];


	socket.on('roomlist', function(list){		
		$scope.rooms = Object.keys(list);
		//console.log($scope.rooms);			
	});

	socket.emit('rooms');


	$scope.createRoom = function(){
		if($scope.roomName === undefined){
			$scope.errorMessage = "Please choose a room name";
			$timeout(function () { $scope.errorMessage = ''; }, 3000);
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
					$scope.errorMessage = reason;
					$timeout(function () { $scope.errorMessage = ''; }, 3000);
				}
			});
		}
	};

	$scope.joinRoom = function(currRoom, roomPassword){
		var obj = {
			room: currRoom,
			pass: roomPassword
		};
		socket.emit('joinroom', obj, function (success, reason) {
			if(success){
				$location.path('/room/' + $scope.currentUser + '/' + obj.room);
			}
			else{
				$scope.errorMessage = reason;
				$timeout(function () { $scope.errorMessage = ''; }, 3000);
			}
		});

	};

	socket.on('roomlist', function(list){
		$scope.roomObj = list;
		$scope.rooms = Object.keys(list);
		console.log("-----",$scope.roomObj);
				
	});

	socket.on('servermessage', function(msg, room, kickedUser){

		if(kickedUser === $scope.currentUser)
		{
			if(msg === "kick"){
				$scope.errorMessage = "You have been kicked! Out of " + room;
				$timeout(function () { $scope.errorMessage = ''; }, 4000);
			}
			else if(msg === "ban"){
				$scope.errorMessage = "You have been banned! From " + room;
				$timeout(function () { $scope.errorMessage = ''; }, 4000);
			}	
		}
	});
});





