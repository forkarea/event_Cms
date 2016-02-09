angular.module('main.partnerFactory', [])
.factory('partnerServices', ['$http', function($http) {
	'use strict';
	var partnerServices={};

	partnerServices.getPartnersList = function(edition) {
		return $http({
			method: 'post',
			url: 'getPartnersList',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};

	partnerServices.getPartnerDictionary = function(edition) {
		return $http({
			method: 'post',
			url: 'getPartnerDictionary',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};
	
	partnerServices.addNewPartner = function(edition, element) { 
		return $http({
			method: 'post',
			url: 'addNewPartner',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition,				
				name: element.name,
				description: element.description,
				www: element.www,
				fb: element.fb,
				type: element.type
			}
		});
	};

	partnerServices.changePartner = function(element) { 
		return $http({
			method: 'post',
			url: 'updatePartner',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),				
				name: element.name,
				description: element.description,
				www: element.www,
				fb: element.fb,
				type: element.type,
				partner_id: element.id,
				logo: element.logo
			}
		});
	};
	
	partnerServices.removePartner = function(id) {
		return $http({
			method: 'post',
			url: 'removePartner',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				id: id
			}
		});
	};
	
	partnerServices.getMediaPartnersList = function(edition) {
		return $http({
			method: 'post',
			url: 'getMediaPartnersList',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};

	partnerServices.getMediaPartnerDictionary = function(edition) {
		return $http({
			method: 'post',
			url: 'getMediaPartnerDictionary',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition
			}
		});
	};
	
	partnerServices.addNewMediaPartner = function(edition, element) { 
		return $http({
			method: 'post',
			url: 'addNewMediaPartner',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				edition: edition,				
				name: element.name,
				description: element.description,
				www: element.www,
				fb: element.fb,
				type: element.type
			}
		});
	};

	partnerServices.changeMediaPartner = function(element) { 
		return $http({
			method: 'post',
			url: 'updateMediaPartner',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),				
				name: element.name,
				description: element.description,
				www: element.www,
				fb: element.fb,
				type: element.type,
				partner_id : element.id,
				logo: element.logo
			}
		});
	};
	
	partnerServices.removeMediaPartner = function(id) {
		return $http({
			method: 'post',
			url: 'removeMediaPartner',
			data: {
				username: localStorage.getItem('Username'),
				session_id: localStorage.getItem('SessionID'),
				id: id
			}
		});
	};

	return partnerServices;
}]);