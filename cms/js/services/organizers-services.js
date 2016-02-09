angular.module('main.organizersFactory', [])
.factory('organizersService', ['$http', function($http) {
	'use strict';
	var organizersService={};

	organizersService.getOrganizers = function(edition) {
		return $http({
			method: 'post',
			url: 'getOrganizers',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};
	
	organizersService.getOrganizersPhotoList = function(edition) {
		return $http({
			method: 'post',
			url: 'getOrganizersPhotoList',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};
	
	organizersService.updateOrganizers = function(content, id, edition) { 
		return $http({
			method: 'post',
			url: 'updateOrganizers',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				id: id,				
				content: content,
				edition: edition
			}
		});
	};
	
	organizersService.removeOrganizersPhoto = function(id, edition) { 
		return $http({
			method: 'post',
			url: 'removeOrganizersPhoto',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				id: id,
				edition: edition
			}
		});
	};
	
	return organizersService;
}]);