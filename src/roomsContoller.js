ChatApp.controller('RoomsController', function ($scope, $location, $rootScope, $routeParams, socket) {
	// TODO: Query chat server for active rooms
	$scope.rooms = {};
	$scope.currentUser = $routeParams.user;
	$scope.showInput = false;
	



	socket.on('roomlist', function(list){
				
				$scope.rooms = Object.keys(list);
				//console.log($scope.rooms);
				
	});
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
		socket.emit('joinroom', obj, function(success, reason){
			if(success){
				$location.path('/room/' + $scope.currentUser + '/' + obj.room);
			}
			else{
				$scope.errorMessage = reason;
			}
		});

	};

});