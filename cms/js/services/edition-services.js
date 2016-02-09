angular.module('main.editionFactory', [])
.factory('editionService', ['$http', function($http) {
	'use strict';
	var editionService={};

	editionService.getEditions = function(edition) {
		return $http({
			method: 'post',
			url: 'getEditions',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID')
			}
		});
	};

	editionService.getEditionsList = function(edition) {
		return $http({
			method: 'post',
			url: 'getEditionsList',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID')
			}
		});
	};
	
	editionService.addNewEdition = function(element) { 
		return $http({
			method: 'post',
			url: 'addNewEdition',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				number: element.number,				
				name: element.name,
				start_date: element.start_date.toLocaleString(),
				stop_date: element.stop_date.toLocaleString(),
				visibility: element.visibility
			}
		});
	};

	editionService.changeEdition = function(element) { 
		return $http({
			method: 'post',
			url: 'changeEdition',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition_id: element.id,
				number: element.number,	
				name: element.name,
				startDate: element.start_date.toLocaleString(),										
				stopDate: element.stop_date.toLocaleString(),
				visibility: element.visibility
			}
		});
	};

	editionService.setEditionVisibility = function(element) { 
		return $http({
			method: 'post',
			url: 'setEditionVisibility',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition_id: element.id,
				visibility: element.visibility
			}
		});
	};

	return editionService;
}]);