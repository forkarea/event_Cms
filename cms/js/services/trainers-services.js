angular.module('main.trainersFactory', [])
.factory('trainersService', ['$http', function($http) {
	'use strict';
	var trainersService={};

	trainersService.getTrainersList = function(edition) {
		return $http({
			method: 'post',
			url: 'getTrainersList',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};
	
	trainersService.addNewTrainer = function(edition, element) { 
		return $http({
			method: 'post',
			url: 'addNewTrainer',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition,				
				first_name: element.first_name,
				last_name: element.last_name,
				description: element.description,
				experience: element.experience
			}
		});
	};
	
	trainersService.changeTrainer = function(element) { 
		return $http({
			method: 'post',
			url: 'updateTrainer',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),				
				first_name: element.first_name,
				last_name: element.last_name,
				description: element.description,
				experience: element.experience,
				trainer_id: element.id,
				photo: element.photo
			}
		});
	};
	
	trainersService.getTrainersShortList = function(edition) {
		return $http({
			method: 'post',
			url: 'getTrainersShortList',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};
	
	trainersService.removeTrainer = function(id) {
		return $http({
			method: 'post',
			url: 'removeTrainer',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				id: id
			}
		});
	};

	return trainersService;
}]);