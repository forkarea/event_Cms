var confApp=angular.module('configPage', ['configPage.configPageFactory', 'main.inform', 'ngMaterial']);

confApp.controller('configPageCtrl', ['$scope', '$http', '$window', 'configPageService', 'informService', 
	function ($scope, $http, $window, configPageService, informService) {
		$scope.db = null;
		$scope.user = null;
		'use strict';

		var validForm = function(form) {
			if (form.$invalid) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
				return false;
			} else if ($scope.user.password !== $scope.user.confirmPassword) {
				informService.showAlert('Błąd', 'Hasło i potwierdzone hasło nie są identyczne');
			} else {
				return true;
			}
		};

		$scope.save = function(form) {
			if (validForm(form)) {
				var next = false;
				configPageService.saveDB($scope.db)
				.success(function () {
					next = true;
				})
				.error(function () {
					informService.showAlert('Błąd', 'Nie zapisano danych dostępu do bazy danych');
				});
				if (next) {
					next = false;
					configPageService.createDB()
					.success(function () {
						next = true;
					})
					.error(function () {
						informService.showAlert('Błąd', 'Nie utworzono bazy danych');
					});
				}
				if (next) {
					configPageService.addFirstUser($scope.user)
					.success(function () {
						informService.showAlert('Błąd', 'Konfiguracja bazy danych powiodła się');
					})
					.error(function () {
						informService.showAlert('Błąd', 'Nie utworzono konta użytkownika');
					});
				}
			}
		};
}]);