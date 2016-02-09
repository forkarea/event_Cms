app.controller('profileCtrl',['$scope', '$rootScope', '$http', '$window', 'usersService', 'informService',
	function ($scope, $rootScope, $http, $window, usersService, informService) {
		'use strict';
		$scope.username = localStorage.getItem("Username");
		var validateEmail = function(email) {
			var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		}

		$scope.getUserDetails = function() {
			usersService.getUserDetails()
			.success(function (data) {
				$scope.username = data.username;
				$scope.first_name = data.first_name;
				$scope.last_name = data.last_name;
				$scope.email = data.email;
			})
			.error(function () {
				informService.showSimpleToast('Błąd pobrania danych o profilu');
			});
		}

		$scope.save= function(form) {
			if (form.$invalid) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
			} else if(!validateEmail($scope.email)) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie pole e-mail');
			} else {
				usersService.setUserDetails($scope.first_name, $scope.last_name, $scope.email)
				.success(function (data) {
					$scope.first_name = data.first_name;
					$scope.last_name=data.last_name;
					$scope.email=data.email;
					$scope.errorMessage = '';
					var msg = data.first_name + ' ' + data.last_name;
					$rootScope.$emit('edit.profile', msg);
					informService.showSimpleToast('Dane o użytkowniku zostały zaktualizowane');
				})
				.error(function (data) {
					switch (data.code) {
						case 'first_name':
							informService.showAlert('Błąd', 'Wypełnij poprawnie pole imię');
							break;
						case 'last_name':
							informService.showAlert('Błąd', 'Wypełnij poprawnie pole nazwisko');
							break;
						case 'email':
							informService.showAlert('Błąd', 'Wypełnij poprawnie pole e-mail');
							break;
						default:
							informService.showAlert('Błąd', 'Dane nie zostały zaktualizowane');
					}
				});
			}
		};

	}]);