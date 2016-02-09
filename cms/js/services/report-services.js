angular.module('main.reportFactory', [])
.factory('reportService', ['$http', function($http) {
	'use strict';
	var reportService={};

	reportService.getReport = function(edition) {
		return $http({
			method: 'post',
			url: 'getReport',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};

	reportService.getReportPhotoList = function(edition) {
		return $http({
			method: 'post',
			url: 'getReportPhotoList',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};

	reportService.updateReport = function(content, id, edition) { 
		return $http({
			method: 'post',
			url: 'updateReport',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				id: id,				
				content: content,
				edition: edition
			}
		});
	};

	reportService.removeReportPhoto = function(id, edition) { 
		return $http({
			method: 'post',
			url: 'removeReportPhoto',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				id: id,
				edition: edition
			}
		});
	};

	return reportService;
}]);