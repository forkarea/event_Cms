angular.module('main.services', [])
.factory('services', ['$http', function($http) {
	'use strict';
	var services={};

	services.getEditions = function() {
		return $http({
			method: 'post',
			url: 'getEditions'
		});
	};

	services.getMenu = function(edition) {
		return $http({
			method: 'post',
			url: 'getMenuForEdition',
			data: {
				edition: edition
			}
		});
	};

	services.getNewsList = function(edition) {
		return $http({
			method: 'post',
			url: 'getNews',
			data: {
				edition: edition
			}
		});
	};

	services.getDescription = function(edition) {
		return $http({
			method: 'post',
			url: 'getDescription',
			data: {
				edition: edition
			}
		});
	};

	services.getTrainersList = function(edition) {
		return $http({
			method: 'post',
			url: 'getTrainers',
			data: {
				edition: edition
			}
		});
	};

	services.getAgendaList = function(edition) {
		return $http({
			method: 'post',
			url: 'getAgenda',
			data: {
				edition: edition
			}
		});
	};

	services.getOrganizers = function(edition) {
		return $http({
			method: 'post',
			url: 'getOrganizers',
			data: {
				edition: edition
			}
		});
	};

	services.getPartnersList = function(edition) {
		return $http({
			method: 'post',
			url: 'getPartners',
			data: {
				edition: edition
			}
		});
	};

	services.getMediaPartnersList = function(edition) {
		return $http({
			method: 'post',
			url: 'getMediaPartners',
			data: {
				edition: edition
			}
		});
	};

	services.getReport = function(edition) {
		return $http({
			method: 'post',
			url: 'getReport',
			data: {
				edition: edition
			}
		});
	};

	

	return services;
}]);