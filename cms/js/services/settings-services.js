angular.module('main.settingsFactory', [])
.factory('settingsServices', ['$http', function($http) {
	'use strict';
	var settingsServices={};

	settingsServices.getMenuList = function(edition) {
		return $http({
			method: 'post',
			url: 'getMenuForEdition',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};
	
	settingsServices.saveMenuList = function(data, edition) {
		return $http({
			method: 'post',
			url: 'saveMenuForEdition',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				data: data,
				edition: edition
			}
		});
	}
	
	settingsServices.getDataForDashboard = function(edition) {
		return $http({
			method: 'post',
			url: 'getDashboardForEdition',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};

	settingsServices.getDictionaries = function(edition) {
		return $http({
			method: 'post',
			url: 'getDictionaries',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};

	settingsServices.savePartnersDictionary = function(edition, dictionary) {
		return $http({
			method: 'post',
			url: 'savePartnersDictionary',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition,
				data: dictionary
			}
		});
	};

	settingsServices.saveMediaPartnersDictionary = function(edition, dictionary) {
		return $http({
			method: 'post',
			url: 'saveMediaPartnersDictionary',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition,
				data: dictionary
			}
		});
	};
	

	return settingsServices;
}]);