ChatApp.controller('RoomsController', function ($scope, $location, $rootScope, $routeParams, socket) {
	// TODO: Query chat server for active rooms
	$scope.rooms = {};
	$scope.currentUser = $routeParams.user;
	$scope.showInput = false;
	



	socket.on('roomlist', function(list){
				
				$scope.rooms = Object.keys(list);
				
	});

	
	socket.emit('rooms');
	// socket.on('cons', function(breyta){console.log("cons");console.log(breyta);});
	// socket.on('con', function(breyta){console.log("con");console.log(breyta);});

	$scope.createRoom = function(){
		var obj = {
			room: $scope.roomName,
			pass: undefined
		};
		socket.emit('joinroom', obj  ,function (success, reason) {
			if (!success){
				$scope.errorMessage = "WELLWELLWELL";
			}
			else{
				socket.emit('rooms');
			}
		});
		
	};




	// socket.on('updateusers', function(a, b, c){
	// 		console.log(a);


	// });


	if($scope.showInput === false){
		$scope.buttonName = "Create Room";
	}
	else
	{
		$scope.buttonName = "Close";
	}
});