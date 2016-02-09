app.controller('userNewCtrl', ['$scope', '$rootScope', '$window', 'informService', '$mdDialog', 'usersService', 
	function ($scope, $rootScope, $window, informService, $mdDialog, usersService) {
		'use strict';
		$scope.user = {};
		$scope.isEdit = false;
		$scope.userRole = localStorage.getItem('UserRole');
		$scope.changePassword = false;

		var validateEmail = function(email) {
			var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		};

		var validForm = function(form) {
			if (form.$invalid) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
				return false;
			} else if(!validateEmail($scope.user.email)) {
				informService.showAlert('Błąd', 'Wypełnij poprawnie pole e-mail');
				return false;
			} else if(angular.isUndefined($scope.user.role)) {
				informService.showAlert('Błąd', 'Nie wybrano roli użytkownika');
				return false;
			} else if($scope.user.password !== $scope.user.confirmPassword) {
				informService.showAlert('Błąd', 'Podane hasła nie są identyczne');
				return false;
			} else {
				return true;
			}
		};
		
		$scope.save = function(form) {
			if (validForm(form)) {
				usersService.addNewUser($scope.user)
				.success(function () {
					informService.showSimpleToast('Nowy użytkownik został dodany');
					$rootScope.$broadcast('new.user', '');
					$scope.close(form);
				})
				.error(function (data, status) {
					if (status === 302) {
						informService.showAlert('Błąd', 'Użytkownik o podanej nazwie już istnieje.');
					} else  if (status == 409) {
						informService.showAlert('Błąd', 'Wypełnij poprawnie formularz');
					} else {
						informService.showAlert('Błąd', 'Nie dodano nowego użytkownika');
					}
				});
			}
		};

		$scope.saveChanges = function(form) {
			if (validForm(form)) {
				var msg = 'Czy zapisać zmiany dla użytkownika ' + $scope.user.first_name + ' ' + $scope.user.last_name + '?';
				$mdDialog.show(informService.showConfirm('Potwierdzenie', msg)).then(function() {
					if ($scope.changePassword) {
						usersService.changeUserAndPassword($scope.user)
						.success(function () {
							informService.showSimpleToast('Dane zostały zaktualizowane');
							$rootScope.$emit('edit.user', '');
							$scope.close(form);
						})
						.error(function () {
							informService.showAlert('Błąd', 'Aktualizacja danych nie powiodła się');
						});
					} else {
						usersService.changeUser($scope.user)
						.success(function () {
							informService.showSimpleToast('Dane zostały zaktualizowane');
							$rootScope.$emit('edit.user', '');
							$scope.close(form);
						})
						.error(function () {
							informService.showAlert('Błąd', 'Aktualizacja danych nie powiodła się');
						});
					}
				}, function() {
				});
			}
		};

		$rootScope.$on('user.to.edit', function (event, value) {
			$scope.reset($scope.newUser);
			$scope.isEdit = true;
			$scope.user = value;
		});

		$scope.reset = function(form) {
			if (form) {
				$scope.isEdit = false;
				$scope.user = {};
				form.$setPristine();
				form.$setUntouched();
			}
		};

		$rootScope.$on('clear.new.user', function (event, value) {
			$scope.reset($scope.newUser);
		});

		$scope.close = function(form) {
			$scope.reset(form);
			$scope.closeRight();
		};

		var init = function() {
			if($scope.userRole !== 'a') {
				$scope.close($scope.newUser);
			}
		};

		init();
	}]);