angular.module('main.descriptionFactory', [])
.factory('descriptionService', ['$http', function($http) {
	'use strict';
	var descriptionService={};

	descriptionService.getDescription = function(edition) {
		return $http({
			method: 'post',
			url: 'getDescription',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};
	
	descriptionService.getDescriptionPhotoList = function(edition) {
		return $http({
			method: 'post',
			url: 'getDescriptionPhotoList',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};

	descriptionService.updateDescription = function(content, id, edition) { 
		return $http({
			method: 'post',
			url: 'updateDescription',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				id: id,				
				content: content,
				edition: edition
			}
		});
	};
	
	descriptionService.removeDescriptionPhoto = function(id, edition) { 
		return $http({
			method: 'post',
			url: 'removeDescriptionPhoto',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				id: id,
				edition: edition
			}
		});
	};

	return descriptionService;
}]);