app.controller('changepassCtrl', ['$scope', '$http', '$window', 'usersService', 'informService',
	function ($scope, $http, $window, usersService, informService) {
		'use strict';
		$scope.save = function(form) {
			if (form.$invalid) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
			} else if(angular.isUndefined($scope.newPassword) || $scope.newPassword.length < 5) {
				informService.showAlert('Błąd', 'Hasło musi mieć minimum 5 znaków');
			} else if($scope.newPassword === $scope.confirmNewPassword) {
				usersService.setPassword($scope.oldPassword, $scope.newPassword)
				.success(function () {
					$scope.oldPassword = '';
					$scope.newPassword = '';
					$scope.confirmNewPassword = '';
					informService.showSimpleToast('Hasło zostało zmienione');
				})
				.error(function (data, status) {
					if (status === 401) {
						informService.showAlert('Błąd', 'Podano błędne stare hasło');
					} else {
						switch (data.code) {
							case 'oldpassword':
								informService.showAlert('Błąd', 'Wypełnij poprawnie pole stare hasło');
								break;
							case 'newpassword':
								informService.showAlert('Błąd', 'Wypełnij poprawnie nowe hasło');
								break;
							default:
								informService.showAlert('Błąd', 'Operacja zmiany hasła nie powiodła się');
						}
					}
					
				});
			} else {
				informService.showAlert('Błąd', 'Nowe hasło i potwierdzone hasło nie są identyczne');
			}
		};
	}]);
