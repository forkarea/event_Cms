angular.module('main.agendaFactory', [])
.factory('agendaService', ['$http', function($http) {
	'use strict';
	var agendaService={};

	agendaService.getAgendasList = function(edition) {
		return $http({
			method: 'post',
			url: 'getAgendasList',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};
	
	agendaService.addNewAgenda = function(edition, element) { 
		return $http({
			method: 'post',
			url: 'addNewAgenda',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition,
				startDate: element.start_date.toLocaleString(),										
				startTime: element.start_time.toLocaleString(),
				stopDate: element.stop_date.toLocaleString(),
				stopTime: element.stop_time.toLocaleString(),
				trainer: element.trainer_id,
				name: element.name,
				description: element.description
			}
		});
	};

	agendaService.changeAgenda = function(element) { 
		return $http({
			method: 'post',
			url: 'changeAgenda',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				agenda_id: element.id,
				startDate: element.start_date.toLocaleString(),										
				startTime: element.start_time.toLocaleString(),
				stopDate: element.stop_date.toLocaleString(),
				stopTime: element.stop_time.toLocaleString(),
				trainer: element.trainer_id,
				name: element.name,
				description: element.description
			}
		});
	};
	
	agendaService.removeAgenda = function(id) {
		return $http({
			method: 'post',
			url: 'removeAgenda',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				id: id
			}
		});
	};

	return agendaService;
}]);