angular.module('main.userFactory', [])
.factory('usersService', ['$http', function($http) {
	'use strict';
	var usersService={};

	usersService.getUsersList = function() {
		return $http({
			method: 'post',
			url: 'getUsersList',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
			}
		});
	};
	
	usersService.removeUser = function(r_id, r_username) {
		return $http({
			method: 'post',
			url: 'removeUser',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				r_id: r_id,
				r_username: r_username
			}
		});
	};
	
	usersService.getUserDetails = function() {
		return $http({
			method: 'post',
			url: 'getUserDetails',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID')				
			},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	usersService.setUserDetails = function(first_name, last_name, email) {
		return $http({
			method: 'post',
			url: 'setUserDetails',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				first_name: first_name,
				last_name: last_name,
				email: email
			},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	usersService.setPassword = function(oldPassword, newPassword) {
		return $http({
			method: 'post',
			url: 'setPassword',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				old_password: oldPassword,
				new_password: newPassword
			},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};
	
	usersService.addNewUser = function(user) {
		return $http({
			method: 'post',
			url: 'addNewUser',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				n_username: user.username,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				role: user.role,
				password: user.password			
			},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	usersService.changeUser = function(user) {
		return $http({
			method: 'post',
			url: 'changeUser',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				n_username: user.username,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				role: user.role			
			},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	usersService.changeUserAndPassword = function(user) {
		return $http({
			method: 'post',
			url: 'changeUserAndPassword',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				n_username: user.username,
				first_name: user.first_name,
				last_name: user.last_name,
				email: user.email,
				role: user.role,
				password: user.password			
			},
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};
	
	return usersService;
}]);