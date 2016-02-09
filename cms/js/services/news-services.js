angular.module('main.newsFactory', [])
.factory('newsService', ['$http', function($http) {
	'use strict';
	var newsService={};

	newsService.getNewsList = function(edition) {
		return $http({
			method: 'post',
			url: 'getNewsList',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};

	newsService.addNewNews = function(edition, element) { 
		return $http({
			method: 'post',
			url: 'addNewNews',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				title: element.title,				
				date: element.date.toLocaleString(),
				content: element.content,
				priority: element.priority,
				edition: edition
			}
		});
	};

	newsService.changeNews = function(element) { 
		return $http({
			method: 'post',
			url: 'updateNews',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				news_id: element.id,				
				title: element.title,				
				date: element.date.toLocaleString(),
				content: element.content,
				priority: element.priority,
				photo: element.photo
			}
		});
	};

	newsService.removeNews = function(id) {
		return $http({
			method: 'post',
			url: 'removeNews',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				id: id
			}
		});
	};

	return newsService;
}]);