angular.module('configPage.configPageFactory', [])
.factory('configPageService', ['$http', function($http) {
	'use strict';
	var configPageService={};

	configPageService.addFirstUser = function(user) {
		return $http({
			method: 'post',
			url: 'addFirstUser',
			data: {
				username: user.username,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				password: user.password
			}
		});
	};

	configPageService.saveDB = function(db) {
		return $http({
			method: 'post',
			url: 'saveDB',
			data: {
				db_server: db.db_server,
				db_user: db.db_user,
				db_password: db.db_password,
				db_name: db.db_name
			}
		});
	};

	configPageService.createDB = function() {
		return $http({
			method: 'post',
			url: 'createDB',
			data: {
				db_server: db.db_server,
				db_user: db.db_user,
				db_password: db.db_password,
				db_name: db.db_name
			}
		});
	};

	return configPageService;
}]);